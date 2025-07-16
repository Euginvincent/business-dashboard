// app/api/users/[id]/route.ts
import { db } from '../../../../lib/drizzle';
import { users } from '../../../../db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0]);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await req.json();

  try {
    await db
      .update(users)
      .set({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        mobile: body.mobile,
        dob: body.dob,
      })
      .where(eq(users.id, id));

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ message: 'Failed to update user' }), {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
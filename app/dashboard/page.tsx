import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../lib/drizzle';
import { users } from '../../db/schema';
import UserActions from './UserActions';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserActionsWrapper from './UserActionsWrapper';

interface User {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  mobile: string | null;
  dob: string | null;
  role: string | null;
}

export default async function Dashboard() {
  // cookies() is now async in Next.js 14+
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch the current user's profile to check if admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

    console.log('userProfile:', userProfile);
  const isAdmin = userProfile?.role === 'admin';
  console.log('userProfile:', userProfile);
  console.log('isAdmin:', isAdmin);

  // Fetch all users
  const usersList: User[] = await db.select().from(users);

  return (
    <div className="min-h-screen w-full bg-[#e0f7fa] p-8"> 
      <Header />
      <main className="flex-grow max-w-5xl mx-auto mt-10 bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Last Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">DOB</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 border">{u.firstname}</td>
                <td className="px-4 py-2 border">{u.lastname}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.mobile}</td>
                <td className="px-4 py-2 border">{u.dob}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border">
                  <UserActionsWrapper userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
import { notFound, redirect } from 'next/navigation';
import { db } from '../../../lib/drizzle';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import EditUserForm from './form';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const userList = await db.select().from(users).where(eq(users.id, params.id));
  const user = userList[0];
  if (!user) return notFound();
  return <EditUserForm user={user} />;
}

// app/users/[id]/form.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserForm({ user }: { user: any }) {
  const [form, setForm] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    mobile: user.mobile || '',
    dob: user.dob || '',
    role: user.role || 'user',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to update user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstname" value={form.firstname} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" />
        <input name="lastname" value={form.lastname} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" className="w-full p-2 border rounded" />
        <input name="dob" value={form.dob} onChange={handleChange} placeholder="DOB" className="w-full p-2 border rounded" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
} 
'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; 

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="w-full bg-gray-100 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="background-color: #2d3748; bg-opacity-100 hover:bg-red-600 text-white px-4 py-2 rounded"
        style={{height:"30px", padding:"5px", fontWeight:"600"}}
      >
        Logout
      </button>
    </header>
  );
}

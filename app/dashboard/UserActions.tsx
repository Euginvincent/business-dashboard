'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditUserModal from './EditUserModal';

interface UserActionsProps {
  userId: string;
  role?: string | null; 
}


export default function UserActions({ userId, role }: UserActionsProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });

    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete user');
    }
  };

   const isAdmin = role === 'admin';

  return (
    <>
      {/* Edit button */}
      <button
        type="button"
        onClick={() => isAdmin && setShowModal(true)}
        className={`mr-2 ${isAdmin ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
        disabled={!isAdmin}
        style={{ marginLeft: '20px' }}
      >
        Edit
      </button>

      {/* Delete button */}
      <button
        type="button"
        onClick={isAdmin ? handleDelete : undefined}
        className={`text-red-600 hover:underline ${!isAdmin ? 'text-gray-400 cursor-not-allowed' : ''}`}
        disabled={!isAdmin}
        style={{ marginLeft: '20px' }}
      >
        Delete
      </button> 

      {/* Modal */}
      <EditUserModal
        userId={userId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}

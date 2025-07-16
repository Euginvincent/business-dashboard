'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditUserModal from './EditUserModal';

interface UserActionsProps {
  userId: string;
  userEmail: string;
  role?: string | null;
  loggedInEmail?: string | null;
}

export default function UserActions({ userId, userEmail, role, loggedInEmail }: UserActionsProps) {
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
  const isSelf = userEmail === loggedInEmail;

  const canEdit = isAdmin || isSelf;
  const canDelete = isAdmin;

  return (
    <>
      {/* Edit button */}
      <button
        type="button"
        onClick={() => canEdit && setShowModal(true)}
        className={`mr-2 ${canEdit ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
        disabled={!canEdit}
        style={{ marginLeft: '20px' }}
      >
        Edit
      </button>

      {/* Delete button (only admins) */}
      <button
        type="button"
        onClick={canDelete ? handleDelete : undefined}
        className={`text-red-600 hover:underline ${!canDelete ? 'text-gray-400 cursor-not-allowed' : ''}`}
        disabled={!canDelete}
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

'use client';
import { useEffect, useState } from 'react';

export default function EditUserModal({
  userId,
  isOpen,
  onClose,
  onSuccess,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setError('');

      fetch(`/api/users/${userId}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load user');
          const data = await res.json();
          setForm({
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            email: data.email || '',
            mobile: data.mobile || '',
            dob: data.dob || '',
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load user');
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to update user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Edit User</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading user info...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{height:"25px", borderRadius:"5px"}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{height:"25px", borderRadius:"5px"}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{height:"25px", borderRadius:"5px"}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{height:"25px", borderRadius:"5px"}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{height:"25px", borderRadius:"5px"}}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 pt-4" style={{marginTop:"10px", height:"20px"}}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
                style={{marginLeft:"10px"}}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

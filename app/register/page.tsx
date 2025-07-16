'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    mobile: '',
    dob: '',
    role: 'user',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  //   setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // Block invalid characters for firstname and lastname
  if ((name === 'firstname' || name === 'lastname') && !/^[a-zA-Z.]*$/.test(value)) {
    return; 
  }

  setForm({ ...form, [name]: value });
  setFieldErrors({ ...fieldErrors, [name]: undefined });
};

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!form.email) {
      errors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errors.email = 'Invalid email address';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  if (!validate()) return;

  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
});


if (error) {
  setError(error.message);
  return;
}

// Insert user details into your users table
const userId = data.user?.id;
if (!userId) {
  setError('User ID not found after registration.');
  return;
}
  const { error: insertError } = await supabase.from('users').insert([
  {
    id: userId,
    email: form.email,
    firstname: form.firstname,
    lastname: form.lastname,
    mobile: form.mobile,
    dob: form.dob,
    role: form.role,
  },
]);

  if (insertError) {
    setError(insertError.message);
    return;
  }

  router.push('/login');
};

  return (
    <div className="min-h-100 flex items-center justify-center bg-gradient-to-r .bg-yellow-400 p-8">
      <div className="w-100 max-w-md bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Register</h2>

        <form onSubmit={handleSubmit}>
          {/** Firstname */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "12px", marginTop:"5px"}}>
            <label htmlFor="firstname" className="w-32 text-gray-700 font-medium">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px", width:"50%"}}

            />
          </div>

          {/** Lastname */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "13px", marginTop:"5px"}}>
            <label htmlFor="lastname" className="w-32 text-gray-700 font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}

            />
          </div>

          {/** Mobile */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "35px", marginTop:"5px"}}>
            <label htmlFor="mobile" className="w-32 text-gray-700 font-medium">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                handleChange(e);
              }
            }}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}

            />
          </div>

          {/** DOB */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "48px", marginTop:"5px"}}>
            <label htmlFor="dob" className="w-32 text-gray-700 font-medium">
              DOB
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}

            />
          </div>

          {/** Role */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "50px", marginTop:"5px"}}>
            <label htmlFor="role" className="w-32 text-gray-700 font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}

            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/** Email */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "42px", marginTop:"5px"}}>
            <label htmlFor="email" className="w-32 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}
              required
            />
          </div>

          {/** Password */}
          <div className="flex items-center mb-3 gap-4" style={{gap: "18px", marginTop:"5px"}}>
            <label htmlFor="password" className="w-32 text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
              style={{height:"25px", borderRadius:"5px"}}
            />
          </div>

          {fieldErrors.password && (
            <p className="text-red-600 text-sm text-center mb-4">{fieldErrors.password}</p>
          )}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="flex justify-center mt-4" style={{gap: "12px", marginTop:"5px", marginLeft:"30px"}}>
            <button
            
              type="submit"
              className="w-40 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              style={{height:"30px", borderRadius:"5px"}}
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-40 p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              style={{ height: '30px', borderRadius: '5px', marginLeft:"10px" }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

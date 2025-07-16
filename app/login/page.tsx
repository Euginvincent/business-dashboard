'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; 
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error || !data.user) {
      setError('Invalid email or password.');
      return;
    }

    // Fetch user role
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('email', form.email)
      .single();

    if (roleError || !userData) {
      console.error('Failed to fetch role:', roleError);
      setError('Failed to fetch user role');
      return;
    }

    localStorage.setItem('role', userData.role);

    router.push('/dashboard');
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  // if (!validate()) return;

  //   const { error } = await supabase.auth.signInWithPassword({
  //     email: form.email,
  //     password: form.password,
  //   });

  //   if (error) {
  //     setError('Invalid email or password.');
  //   } else {
  //     router.push('/dashboard');
  //   }
  // };

  return (

    <div className="min-h-100 flex items-center justify-center bg-gradient-to-r from-red-500 to-purple-100 p-8">
      <div className="w-100 max-w-md bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h2>

        <form onSubmit={handleSubmit}>   
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
              required
            />
          </div>

          {fieldErrors.password && (
            <p className="text-red-600 text-sm text-center mb-4">{fieldErrors.password}</p>
          )}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="flex justify-center mt-4" style={{gap: "12px", marginTop:"5px"}}>
            <button
            
              type="submit"
              className="w-40 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              style={{height:"30px", borderRadius:"5px"}}
            >
              Login
            </button>            
          </div>
            <div className="flex justify-center mt-8 text-sm text-gray-700">
            <span>Don&apos;t have an account?&nbsp;</span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

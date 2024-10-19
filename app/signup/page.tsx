'use client';

import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Link from 'next/link';
import { z } from 'zod';
import { useRouter } from 'next/router';

// Zod schema for form validation
const signupSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const router=useRouter()

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate the form data using Zod
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      // Handle validation errors
      const validationError = validation.error.errors[0].message;
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const { fullName, email, password } = formData;
      await axiosInstance.post('/api/signup', { fullName, email, password });
      alert('Registration successful!');

      setFormData({ fullName: '', email: '', password: '' });
      setError(null);
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-10 space-y-6 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-center text-gray-600">Create your account now!</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-white rounded-lg font-semibold tracking-wide transition-colors duration-300 shadow-md ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {loading ? 'Signing up...' : 'Create Account'}
          </button>

          {error && <p className="text-red-500 text-center font-semibold mt-2">{error}</p>} {/* Error message in red */}
        </form>

        <p className="text-center flex flex-col text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-500 font-semibold hover:text-purple-700">
            Log in
          </Link>
          <Link
              href="/forgotpassword"
              className="text-indigo-500 font-semibold hover:underline"
            >
              forgot password
            </Link>
        </p>
      </div>
    </div>
  );
}

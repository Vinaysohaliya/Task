'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import LogoutButton from '@/components/Logout';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    try {
      await axiosInstance.post('/api/reset-password', { token, newPassword });
      alert('Password reset successfully');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Reset Password
        </button>
      </form>
        <LogoutButton/>
    </div>
  );
}

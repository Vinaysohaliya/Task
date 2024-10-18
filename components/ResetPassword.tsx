'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid token');
      return;
    }

    try {
      await axiosInstance.post('/api/reset-password', { token, newPassword });
      setSuccess('Password reset successfully. You can now log in.');
      setNewPassword('');
      setError('');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          disabled={!token}
        >
          Reset Password
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>
    </div>
  );
}

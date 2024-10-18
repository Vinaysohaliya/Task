// components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/logout');
      // Redirect the user to the login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white p-2 rounded hover:bg-red-700">
      Logout
    </button>
  );
}

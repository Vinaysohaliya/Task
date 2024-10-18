// app/resetpassword/page.tsx
import ResetPassword from '@/components/ResetPassword';
import React, { Suspense } from 'react';

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;

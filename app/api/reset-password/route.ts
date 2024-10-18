import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabase } from '@/utils/supabaseClient';
import AppError from '@/utils/AppError';

export const POST = async (req: NextRequest) => {
  const { token, newPassword } = await req.json();
console.log(token,newPassword);

  if (!token || !newPassword) {
    throw new AppError('Token and new password are required', 400);
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('reset_token', token)
    .select();
    console.log(user);
    

  if (!user || error) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const isTokenExpired = new Date(user[0].reset_token_expiration) < new Date();
  if (isTokenExpired) {
    throw new AppError('Reset token has expired', 400);
  }
console.log(isTokenExpired);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log(hashedPassword);

  const { error: updateError } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expiration: null,
    })
    .eq('id', user[0].id);

  if (updateError) {
    throw new AppError('Failed to reset password', 500);
  }

  return NextResponse.json({ success: true, message: 'Password reset successfully' });
};

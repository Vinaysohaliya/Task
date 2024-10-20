import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabase } from '@/utils/supabaseClient'; 
import AppError from '@/utils/AppError';

export async function POST(req: Request) {
  try {
    const { userId, oldPassword, newPassword } = await req.json(); // Parse the JSON body

    if (!userId || !oldPassword || !newPassword) {
      throw new AppError('User ID, old password, and new password are required.', 400);
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found.', 404);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isOldPasswordValid) {
      throw new AppError('Old password is incorrect.', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', userId);

    if (updateError) {
      throw new AppError('Failed to update password.', 500);
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
    
  } catch (err) {
    const error = err instanceof AppError ? err : new AppError('An error occurred.', 500);
    return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
  }
}

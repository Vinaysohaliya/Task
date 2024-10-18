import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import AppError from '@/utils/AppError';
import { supabase } from '@/utils/supabaseClient';
import sendEmail from '@/utils/sendEmail';

export const POST = async (req: NextRequest) => {
  const { email } = await req.json();

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user || error) {
    throw new AppError('No user found with this email', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  
  const resetTokenExpiration = Date.now() + 20* 60 * 1000; // 15 minutes from now
console.log(resetTokenExpiration);

  const { error: updateError } = await supabase
    .from('users')
    .update({
      reset_token: resetToken,
      reset_token_expiration: resetTokenExpiration,
    })
    .eq('id', user.id);

  if (updateError) {
    throw new AppError('Failed to generate reset token', 500);
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/resetpassword?token=${resetToken}`;

  const subject = 'Password Reset Request';
  const message = `You have requested to reset your password. Click on the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail(email, subject, message);
    console.log(`Password reset link sent to: ${email}`);
  } catch (error) {
    throw new AppError('There was an error sending the email. Try again later.', 500);
  }

  return NextResponse.json({
    success: true,
    message: 'Reset password link sent to your email',
  });
};

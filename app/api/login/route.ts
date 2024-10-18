import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '@/utils/AppError';
import { supabase } from '@/utils/supabaseClient';

export const POST = (async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .select();

  if (error || !user) {
    throw new AppError('Invalid email or password', 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 400);
  }

  const token = jwt.sign({ userId: user[0].id, email: user[0].email }, 'token', { expiresIn: '1h' });

  user[0].password = undefined;

  const cookieOptions = {
    httpOnly: true,
    secure: "token",
    maxAge: 60 * 60 * 1000,
    path: '/', 
};
  const response = NextResponse.json({ success: true, message: 'User registered successfully', user: { ...user[0], password: undefined }, token }, { status: 200 });
  response.cookies.set('token', token, cookieOptions);

  return response;

//   return NextResponse.json({ success: true, message: 'User logged in successfully', token, user }, { status: 200 });
});

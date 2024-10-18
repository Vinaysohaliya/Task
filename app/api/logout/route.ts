import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req:NextRequest,res:NextResponse) => {
  const cookieOptions = {
    path: '/',
    maxAge: 0, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
  };

  const response = NextResponse.json({
    success: true,
    message: 'User logged out successfully',
  }, { status: 200 });

  response.cookies.set('token', '', cookieOptions);

  return response;
};

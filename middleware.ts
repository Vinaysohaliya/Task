import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
console.log(process.env.NEXT_PUBLIC_JWT_SECRATE);

  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRATE);

    await jwtVerify(token, secret); 
    
    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    
    return NextResponse.redirect(new URL('/signup', req.url));
  }
}

export const config = {
  matcher: ['/'], 
};

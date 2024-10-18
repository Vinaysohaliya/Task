import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify from jose

// Middleware function to protect routes
export async function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get('token')?.value;

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT token using the jose library
    const secret = new TextEncoder().encode('token'); // Replace 'token' with your secret or use process.env.JWT_SECRET
    await jwtVerify(token, secret); // Verifies the token
    
    // If token is valid, proceed to the next middleware or route
    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    
    // If token is invalid or expired, redirect to signup page
    return NextResponse.redirect(new URL('/signup', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/'], // Add any routes you want to protect
};

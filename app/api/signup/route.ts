import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '@/utils/AppError';
import { supabase } from '@/utils/supabaseClient';

export const POST = async (req: NextRequest) => {
    const { fullName, email, password } = await req.json();
    console.log(email, password);

    if (!email || !password) {
        throw new AppError('All fields are required', 400);
    }

    const { data: userExists } = await supabase.from('users').select('*').eq('email', email).single();

    if (userExists) {
        throw new AppError('Email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase.from('users')
        .insert([{
            fullName,
            email,
            password: hashedPassword,
        }])
        .select();

    if (error) {
        throw new AppError('User registration failed, please try again later', 400);
    }

    const token = jwt.sign({ userId: user[0].id, email: user[0].email }, "token", { expiresIn: '1h' });

    const cookieOptions = {
        httpOnly: true, 
        maxAge: 60 * 60 * 1000, 
        path: '/', 
    };

    const response = NextResponse.json({ success: true, message: 'User registered successfully', user: { ...user[0], password: undefined }, token }, { status: 200 });
    response.cookies.set('token', token, cookieOptions);

    return response;
};

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Replace with your actual password or use environment variable
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

        if (password === SUPER_ADMIN_PASSWORD) {
            const token = jwt.sign(
                {
                    role: 'SUPER_ADMIN' // You can include more info if needed
                },
                process.env.ADMIN_API_KEY!,
                {
                    expiresIn: '1h'
                }
            );
            return NextResponse.json({ 
                success: true ,
                token
            });
        } else if (password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                {
                    role: 'ADMIN' // You can include more info if needed    
                },
                process.env.ADMIN_API_KEY!,
                {
                    expiresIn: '1h'
                }
            );
            return NextResponse.json({ 
                success: true ,
                token
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        otp: {
          select: {
            code: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user || !user.otp) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    const { code, expiresAt } = user.otp;

    if (new Date() > expiresAt) {
      await prisma.oTP.delete({ where: { userId: user.id } });
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    if (otp === code) {
      await prisma.oTP.delete({ where: { userId: user.id } });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' } 
      );
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_SECRET as string,
        { expiresIn: '7d' } 
      );

      cookies().set('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return NextResponse.json({
        message: 'OTP verified successfully!',
        user: { id: user.id, email: user.email },
        accessToken,
      }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
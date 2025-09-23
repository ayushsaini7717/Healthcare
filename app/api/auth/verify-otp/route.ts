import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    if (otp === code) {
      await prisma.oTP.delete({ where: { userId: user.id } });

      return NextResponse.json({ message: 'OTP verified successfully!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
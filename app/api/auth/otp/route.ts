import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    const user = await prisma.user.upsert({
      where: { email },
      update: {}, 
      create: { email, password: '' },
      select: {
        id: true,
      },
    });

    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: { code: otp, expiresAt },
      create: { userId: user.id, code: otp, expiresAt },
    });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your One-Time Password',
      html: `
        <h1>Your One-Time Password</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code is valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 });
  }
}
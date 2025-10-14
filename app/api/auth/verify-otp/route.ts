import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt  from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, otp, type, password } = await request.json();

    if(type === "verification"){
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
 
     return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
 
     } else {
       return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
     }

   }else{
      const hashPassword = await bcrypt.hash(password,5);
      const user = await prisma.user.update({
        where: {
          email: email
        },data: {
          password: hashPassword,
          isEmailVerified: true
        }
      })

      if(!user){
        return NextResponse.json({ msg: "Failed to create account!" ,},{ status: 500 });
      }
      return NextResponse.json({ msg: "Successfully created account!" },{ status: 200 });
   }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
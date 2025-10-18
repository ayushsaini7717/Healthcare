import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { HospitalStatus } from "@prisma/client";


export async function POST(request: Request) {
    const body = await request.json();

    const { email, hospitalName, address, phone, city } = body;
    
    if (!email || !hospitalName || !address || !city) {
        return NextResponse.json({ msg: "Missing required fields: email, hospital name, address, or city." }, { status: 400 });
    }
    
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.json({ msg: "User not found. Please sign up first." }, { status: 404 });
        }

        const hospital = await prisma.hospital.create({
            data: {
                name: hospitalName,
                address: address,
                city: city,
                phone: phone, 
                status: HospitalStatus.PENDING_REVIEW,
            }
        });

        return NextResponse.json({ 
            msg: "Hospital application submitted successfully.",
            hospitalId: hospital.id,
            details: "Access is pending Super Admin approval. You will be notified when your status changes."
        }, { status: 201 });

    } catch (error) {
        console.error("Hospital application error:", error);
        return NextResponse.json({ msg: "Internal server error during application submission." }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma'; 
import { Role } from '@prisma/client';
import { authOptions } from '@/lib/auth';

async function getAdminSession() {
  const session: any = await getServerSession(authOptions as any);
  
  if (!session || !session.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
    return null;
  }
  return session.user as { id: string; role: Role; hospitalId: string; hospitalName: string };
}


export async function GET(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin to perform this action.' }, { status: 403 });
  }

  try {
    const slots = await prisma.timeSlot.findMany({
      where: {
        hospitalId: admin.hospitalId,
      },
      include: {
        doctor: { 
          select: {
            id: true,
            name: true,
            specialty: true,
          }
        }
      }, 
    });

    return NextResponse.json(slots, { status: 200 });

  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { startTime, endTime, doctorId } = body; 

    if (!startTime || !endTime) {
      return NextResponse.json({ message: 'startTime and endTime are required.' }, { status: 400 });
    }

    
    if (new Date(`1970-01-01T${endTime}:00Z`) <= new Date(`1970-01-01T${startTime}:00Z`)) {
      return NextResponse.json({ message: 'End time must be after start time.' }, { status: 400 });
    }

    if (doctorId) {
      const doctor = await prisma.doctor.findFirst({
        where: {
          id: doctorId,
          hospitalId: admin.hospitalId,
        }
      });
      if (!doctor) {
        return NextResponse.json({ message: 'Invalid Doctor ID or Doctor does not belong to this hospital.' }, { status: 404 });
      }
    }

    const today = new Date().toISOString().split('T')[0]; 
    const startISO = new Date(`${today}T${startTime}:00Z`);
    const endISO = new Date(`${today}T${endTime}:00Z`);

    const newSlot = await prisma.timeSlot.create({
    data: {
        hospitalId: admin.hospitalId,
        doctorId: doctorId || null,
        startTime: startISO,
        endTime: endISO,
        isBooked: false,
    },
    include: {
        doctor: true,
    },
    });

    return NextResponse.json(newSlot, { status: 201 });

  } catch (error) {
    console.error("Error creating time slot:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden: You must be a Hospital Admin.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get('id');

  if (!slotId) {
    return NextResponse.json({ message: 'Time Slot ID is required as a query parameter.' }, { status: 400 });
  }

  try {
    const slot = await prisma.timeSlot.findFirst({
      where: {
        id: slotId,
        hospitalId: admin.hospitalId,
      }
    });

    if (!slot) {
      return NextResponse.json({ message: 'Slot not found or you do not have permission to delete it.' }, { status: 404 });
    }

    if (slot.isBooked) {
       return NextResponse.json({ message: 'Cannot delete a slot that is already booked by a patient.' }, { status: 409 }); // 409 Conflict
    }

    await prisma.timeSlot.delete({
      where: {
        id: slotId,
      }
    });

    return NextResponse.json({ message: 'Time slot deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting time slot:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { authOptions } from '@/lib/auth';

// Helper to get session and verify admin role
async function getAdminSession() {
  const session: any = await getServerSession(authOptions as any);

  if (!session || !session.user || session.user.role !== Role.HOSPITAL_ADMIN || !session.user.hospitalId) {
    return null;
  }
  return session.user as { id: string; role: Role; hospitalId: string; };
}


/**
 * GET /api/admin/slots
 * Fetches current time slots for the admin's hospital after cleaning old ones.
 */
export async function GET(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    // --- NEW: Auto-deletion logic ---
    // Delete slots that are in the past and were never booked
    // --- FIXED: Auto-deletion logic ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    await prisma.timeSlot.deleteMany({
      where: {
        hospitalId: admin.hospitalId,
        isBooked: false,
        endTime: {
          lt: today, // Delete only slots that ended before today
        },
      },
    });
    // --- END NEW ---

    // Fetch the remaining slots
    const slots = await prisma.timeSlot.findMany({
      where: {
        hospitalId: admin.hospitalId,
        // Optional: Filter for future slots only if desired
        // startTime: {
        //   gte: now,
        // }
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
      orderBy: {
        startTime: 'asc', // Sort by start time
      },
    });

    return NextResponse.json(slots, { status: 200 });

  } catch (error) {
    console.error("Error fetching/cleaning time slots:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { date, startTime, endTime, doctorId } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ message: 'date, startTime, and endTime are required.' }, { status: 400 });
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ message: 'Invalid time format. Use HH:MM.' }, { status: 400 });
    }

    const slotDate = new Date(date);
    if (isNaN(slotDate.getTime())) {
      return NextResponse.json({ message: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    const startDateTime = new Date(slotDate);
    const [sh, sm] = startTime.split(':').map(Number);
    startDateTime.setHours(sh, sm, 0, 0);

    const endDateTime = new Date(slotDate);
    const [eh, em] = endTime.split(':').map(Number);
    endDateTime.setHours(eh, em, 0, 0);

    if (endDateTime <= startDateTime) {
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

    const newSlot = await prisma.timeSlot.create({
      data: {
        hospitalId: admin.hospitalId,
        doctorId: doctorId || null,
        startTime: startDateTime,
        endTime: endDateTime,
        isBooked: false,
      },
      include: { doctor: true },
    });

    return NextResponse.json(newSlot, { status: 201 });

  } catch (error) {
    console.error("Error creating time slot:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



/**
 * DELETE /api/admin/slots
 * Deletes an unbooked time slot.
 */
export async function DELETE(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
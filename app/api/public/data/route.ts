import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { HospitalStatus } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const hospitalId = searchParams.get('hospitalId');

  try {
   
    if (type === 'hospitals') {
      const hospitals = await prisma.hospital.findMany({
        where: { status: HospitalStatus.APPROVED }, 
        select: { id: true, name: true, city: true }
      });
      return NextResponse.json(hospitals);
    }
   
    if (!hospitalId) {
      return NextResponse.json({ message: 'hospitalId is required for this data type.' }, { status: 400 });
    }

    if (type === 'services') {
      const services = await prisma.service.findMany({
        where: { hospitalId: hospitalId },
        select: { id: true, name: true, price: true }
      });
      return NextResponse.json(services);
    }

    if (type === 'doctors') {
      const doctors = await prisma.doctor.findMany({
        where: { hospitalId: hospitalId },
        select: { id: true, name: true, specialty: true }
      });
      return NextResponse.json(doctors);
    }

    if (type === 'slots') {
      const doctorId = searchParams.get('doctorId');
      const date = searchParams.get('date'); // e.g., "2025-10-25"

      if (!date || !doctorId) {
        return NextResponse.json({ message: 'doctorId and date are required to fetch slots.' }, { status: 400 });
      }

      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0); 
      
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      const slots = await prisma.timeSlot.findMany({
        where: {
          hospitalId: hospitalId,
          doctorId: doctorId === 'general' ? null : doctorId, 
          isBooked: false, 
          startTime: {
            gte: startDate, 
            lt: endDate,    
          }
        },
        select: { id: true, startTime: true, endTime: true },
        orderBy: { startTime: 'asc' }
      });
      return NextResponse.json(slots);
    }

    return NextResponse.json({ message: 'Invalid data type requested.' }, { status: 400 });

  } catch (error) {
    console.error(`Error fetching public data (type: ${type}):`, error);
    return NextResponse.json({ message: 'Internal ServerError' }, { status: 500 });
  }
}
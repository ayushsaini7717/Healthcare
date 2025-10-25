// import { NextRequest, NextResponse } from "next/server";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function POST(request: NextRequest) {
//     try{
//         const order = await razorpay.orders.create({
//             amount: 100*100,
//             currency: "INR",
//             receipt: "reciept_" + Math.random().toString(36).substring(7),
//         })
//         return NextResponse.json({orderId: order.id},{status: 200})
//     }catch(error){
//         console.error("Error creating order:", error);
//         return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust this path
import prisma from "@/lib/prisma"; // Adjust this path
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});




export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const patientId = session.user.id;

  const body = await request.json();

  const {
    hospitalId,
    doctorId,
    serviceId,
    timeSlotId,
    startTime,
    endTime,
    type,
    notes,
  } = body;

  try {
    const [service, timeSlot] = await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.timeSlot.findUnique({ where: { id: timeSlotId } }),
    ]);

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    if (!timeSlot) {
      return NextResponse.json({ message: "Time slot not found" }, { status: 404 });
    }
    if (timeSlot.isBooked) {
      return NextResponse.json({ message: "This time slot is already booked" }, { status: 409 });
    }
    if (service.price <= 0) {
      return NextResponse.json({ message: "Invalid service price" }, { status: 400 });
    }

    const options = {
      amount: service.price, 
      currency: "INR",
      receipt: `receipt_appointment_${Date.now()}`,
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    if (!razorpayOrder) {
        throw new Error("Failed to create Razorpay order");
    }

    const [newAppointment] = await prisma.$transaction([
      prisma.appointment.create({
        data: {
          patientId,
          hospitalId,
          doctorId,
          serviceId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          type,
          notes,
          paymentStatus: "PENDING",
          status: "PENDING",
          razorpayOrderId: razorpayOrder.id,
        },
      }),
      prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { isBooked: true },
      }),
    ]);

    return NextResponse.json({
      message: "Order created",
      appointment: newAppointment,
      razorpayOrder,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

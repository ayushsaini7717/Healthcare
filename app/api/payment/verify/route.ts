import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma"; // Adjust this path

export async function POST(request: Request) {
  let validatedBody;
  const body = await request.json();
 

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
  } = body;

  // 1. Verify the signature
  const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(bodyString)
    .digest("hex");

  const isSignatureValid = expectedSignature === razorpay_signature;

  if (!isSignatureValid) {
    // If signature is invalid, payment failed. We must roll back.
    try {
      // Find the appointment and its time slot
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { service: true },
      });
      
      if (appointment) {
        await prisma.$transaction([
          prisma.appointment.update({
            where: { id: appointmentId },
            data: { 
                paymentStatus: "FAILED", 
                status: "CANCELED" 
            },
          }),
          // Free up the time slot
          prisma.timeSlot.updateMany({
            where: {
                hospitalId: appointment.hospitalId,
                doctorId: appointment.doctorId,
                startTime: appointment.startTime,
            },
            data: { isBooked: false },
          }),
        ]);
      }
    } catch (rollBackError) {
        console.error("Rollback failed:", rollBackError);
    }
    return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
  }

  // 2. Signature is valid. Update the Appointment.
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId, razorpayOrderId: razorpay_order_id },
      data: {
        paymentStatus: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        // The appointment 'status' remains 'PENDING' for hospital to confirm
      },
    });

    return NextResponse.json({
      message: "Payment verified successfully",
      appointment: updatedAppointment,
    }, { status: 200 });

  } catch (error) {
    console.error("Error verifying payment:", error);
    // This could happen if the appointmentId is wrong
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
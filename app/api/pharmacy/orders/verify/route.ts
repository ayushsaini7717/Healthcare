import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = body;

  const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(bodyString)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    try {
      await prisma.medicineOrder.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
        },
      });
    } catch (e) {
      console.error("Rollback failed", e);
    }
    return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
  }

  try {
    const updatedOrder = await prisma.medicineOrder.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    return NextResponse.json({
      message: "Payment verified and order paid",
      order: updatedOrder,
    }, { status: 200 });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
  const { items, totalAmount, deliveryAddress, prescriptionId } = body;

  if (!items || items.length === 0 || !totalAmount || !deliveryAddress) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  try {
    const options = {
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_pharmacy_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    if (!razorpayOrder) throw new Error("Failed to create Razorpay order");

    const newOrder = await prisma.medicineOrder.create({
      data: {
        patientId,
        totalAmount,
        deliveryAddress,
        prescriptionId: prescriptionId || null,
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        items: {
            create: items.map((item: any) => ({
                medicineName: item.medicineName,
                quantity: item.quantity,
                price: item.price,
            }))
        }
      },
    });

    return NextResponse.json({
      message: "Order created",
      order: newOrder,
      razorpayOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating pharmacy order:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

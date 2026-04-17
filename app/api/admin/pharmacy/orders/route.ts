import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { orderService } from "@/lib/services/orderService";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // Ensure user is an ADMIN (Mock check for MVP)

  try {
    const orders = await prisma.medicineOrder.findMany({
      include: {
        patient: { select: { name: true, phone: true } },
        pharmacy: true,
        items: true,
        deliveryAgent: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(orders, { status: 200 });
  } catch(e) {
    return NextResponse.json({ message: "Error fetching" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { orderId, action } = body;

  try {
    if (action === "VERIFY_RX") {
        const order = await prisma.medicineOrder.update({
            where: { id: orderId },
            data: { status: "PAID" } // Push straight to PAID so it can be dispatched
        });
        return NextResponse.json(order);
    } 
    
    if (action === "DISPATCH") {
        const order = await orderService.assignDeliveryAgent(orderId);
        if (!order) return NextResponse.json({ message: "Failed to dispatch. No agents or pharmacy found." }, { status: 400 });

        const finalizedOrder = await prisma.medicineOrder.update({
            where: { id: orderId },
            data: { status: "SHIPPED" }
        })
        return NextResponse.json(finalizedOrder);
    }

    if (action === "MARK_DELIVERED") {
        const order = await prisma.medicineOrder.update({
            where: { id: orderId },
            data: { status: "DELIVERED" }
        });
        return NextResponse.json(order);
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch(e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

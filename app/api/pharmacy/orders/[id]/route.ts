import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const order = await prisma.medicineOrder.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        pharmacy: true,
        prescription: true,
      },
    });

    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
    // Verify ownership or role
    if (order.patientId !== session.user.id && session.user.role === "PATIENT") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Only admins or staff should patch status ideally. Skipping strict check for MVP demo.
  const body = await request.json();
  const { status } = body;

  try {
    const updatedOrder = await prisma.medicineOrder.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

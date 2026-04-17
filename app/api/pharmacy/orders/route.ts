import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const orders = await prisma.medicineOrder.findMany({
      where: { patientId: session.user.id },
      include: {
        items: true,
        pharmacy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

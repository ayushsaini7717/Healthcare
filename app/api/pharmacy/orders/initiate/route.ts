import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { pharmacyService } from "@/lib/services/pharmacyService";
import { orderService } from "@/lib/services/orderService";

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const patientId = session.user.id;
  const body = await request.json();
  const { items, totalAmount, deliveryAddress, prescriptionUrl, lat, lng } = body;

  if (!items || items.length === 0 || !totalAmount || !deliveryAddress || !lat || !lng) {
      return NextResponse.json({ message: "Invalid payload. Address with coordinates is required." }, { status: 400 });
  }

  try {
    // 1. Validate if we can fulfill this order geographically & stock wise
    const nearestPharmacy = await pharmacyService.findNearestFulfillmentPharmacy(
        items.map((i: any) => ({ medicineId: i.id, quantity: i.quantity })),
        lat,
        lng
    );

    if (!nearestPharmacy) {
        return NextResponse.json({ message: "No nearby pharmacy can fulfill this order due to distance or stock limits." }, { status: 400 });
    }

    // 2. Check RX Constraints
    const requiresRx = items.some((i: any) => i.prescriptionRequired === true);
    if (requiresRx && !prescriptionUrl) {
       return NextResponse.json({ message: "Prescription is required for one or more items." }, { status: 400 });
    }
    const newOrder = await prisma.medicineOrder.create({
      data: {
        patientId,
        totalAmount,
        deliveryAddress,
        deliveryLat: lat,
        deliveryLng: lng,
        pharmacyId: nearestPharmacy.id,
        prescriptionUrl: prescriptionUrl || null,
        status: requiresRx ? "PENDING_VERIFICATION" : "PAID",
        items: {
            create: items.map((item: any) => ({
                medicineName: item.medicineName || item.name,
                quantity: item.quantity,
                price: item.price,
            }))
        }
      },
    });

    // Note: Deducting inventory strictly should happen on PAID state logically.
    // For MVP scale, doing it here to reserve. But best practice is to reserve in separate status.


    return NextResponse.json({
      message: "Order created",
      order: newOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating pharmacy order:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

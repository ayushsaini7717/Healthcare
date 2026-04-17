import { NextResponse } from "next/server";
import { pharmacyService } from "@/lib/services/pharmacyService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  
  try {
    const medicines = await pharmacyService.getCatalog(q);
    return NextResponse.json(medicines, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  cookies().delete("refreshToken")
  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
}

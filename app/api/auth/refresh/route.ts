// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { verifyRefreshToken } from "@/lib/auth"

export async function POST() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 })
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "15m" })

    return NextResponse.json({ accessToken }, { status: 200 })
  } catch (error) {
    console.error("Error refreshing token:", error)
    return NextResponse.json({ message: "Error refreshing token" }, { status: 500 })
  }
}

// lib/auth.ts
import jwt from "jsonwebtoken"

interface TokenPayload {
  userId: string
  email: string
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET as string) as TokenPayload
  } catch (error) {
    return null
  }
}

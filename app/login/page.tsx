"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"details" | "otp">("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        alert("OTP sent to your email!")
        setStep("otp")
      } else {
        alert(data.message || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken)
        alert("Login successful!")
        router.push("/") // redirect to homepage
      } else {
        alert(data.message || "Invalid OTP")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-green-100 rounded-t-lg">
          <CardTitle className="text-center text-green-800 text-2xl">Welcome to HealthCare+</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <Label className="text-green-700">Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label className="text-green-700">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button onClick={sendOtp} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <Label className="text-green-700">Enter OTP</Label>
                <Input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button onClick={verifyOtp} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

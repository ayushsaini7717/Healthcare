import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return <button onClick={() => signIn()}>Sign in</button>
}

export const Navbar = ({ setShowBooking }: {setShowBooking : any}) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HealthCare+</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </a>
              <a href="#doctors" className="text-muted-foreground hover:text-foreground transition-colors">
                Doctors
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Button onClick={() => setShowBooking(true)} className="rounded-full">
                Book Appointment
              </Button>
              <AuthButton/>
            </nav>
          </div>
        </div>
      </header>
  )
}

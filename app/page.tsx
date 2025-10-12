"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Heart, Shield, Users, MessageCircle, Phone, MapPin, Star } from "lucide-react"
import { AppointmentBooking } from "@/components/appointment-booking"
import { HealthcareChatbot } from "@/components/healthcare-chatbot"
import { services } from "./constants"
import { doctors } from "./constants"
import { Navbar } from "@/components/Navbar"

export default function HomePage() {
  const [showBooking, setShowBooking] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)


  return (
    <div className="min-h-screen bg-background">
      <Navbar setShowBooking={setShowBooking} />
      

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-balance mb-6 text-foreground">Your Health, Our Priority</h2>
            <p className="text-xl text-muted-foreground text-pretty mb-8 leading-relaxed">
              Experience compassionate healthcare with our team of expert doctors. Book appointments easily, get
              personalized care, and access our AI assistant in Kumaoni language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowBooking(true)} className="rounded-full text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowChatbot(true)}
                className="rounded-full text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-balance mb-4">Our Services</h3>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs with care and expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-pretty">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="secondary" className="rounded-full">
                      {service.price}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </span>
                  </div>
                  <Button className="w-full rounded-full" onClick={() => setShowBooking(true)}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="doctors" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-balance mb-4">Meet Our Doctors</h3>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our experienced team of healthcare professionals is dedicated to providing you with the best medical care.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm"
              >
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                  </div>
                  <CardTitle className="text-xl">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <Badge variant="outline" className="rounded-full">
                      {doctor.experience} experience
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full rounded-full" onClick={() => setShowBooking(true)}>
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-balance mb-4">Get In Touch</h3>
            <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
              Have questions? We're here to help. Contact us through any of these channels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-muted-foreground">+91 98765 43210</p>
                <p className="text-muted-foreground">24/7 Emergency</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-muted-foreground">123 Health Street</p>
                <p className="text-muted-foreground">Almora, Uttarakhand</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="pt-6">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Chat Support</h4>
                <p className="text-muted-foreground">Available in Kumaoni</p>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full bg-transparent"
                  onClick={() => setShowChatbot(true)}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">HealthCare+</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 HealthCare+. Providing compassionate care for your health and wellbeing.
          </p>
        </div>
      </footer>

      {showBooking && <AppointmentBooking onClose={() => setShowBooking(false)} />}

      {showChatbot && <HealthcareChatbot onClose={() => setShowChatbot(false)} />}
    </div>
  )
}

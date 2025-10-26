"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, MessageCircle } from "lucide-react";

export const ContactsSection = ({ setShowChatbot }: { setShowChatbot: (value: boolean) => void }) => {
  return (
    <section id="contact" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Have questions? We're here to help. Contact us through any of these channels.
        </p>

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
                className="mt-2 rounded-full"
                onClick={() => setShowChatbot(true)}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

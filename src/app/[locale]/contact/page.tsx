import { getSiteSettings } from "@/lib/cms/settings";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MapPin, Mail, Phone, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us - Eyesoul Premium Eyewear",
  description: "Get in touch with the Eyesoul team for support, consultations, or general inquiries.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings(locale as Locale);
  
  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const supportEmail = "hello@eyesoul.com";
  const phone = "+1 (234) 567-890";

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
          
          {/* Left Column: Information */}
          <div>
            <RevealOnScroll>
              <h1 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
                Get in touch.
              </h1>
              <p className="text-muted-foreground text-lg mb-12 max-w-md leading-relaxed">
                Whether you have a question about our collections, need help with an order, or want to book an eye examination, our concierge team is here to assist you.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="space-y-10">
                
                {/* Contact Method: WhatsApp */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MessageSquare className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">WhatsApp Concierge</h3>
                    <p className="text-muted-foreground text-sm mb-2">Fastest response time. Available 9am - 8pm.</p>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      Chat with us <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Contact Method: Email */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">Email Support</h3>
                    <p className="text-muted-foreground text-sm mb-2">We aim to respond within 24 hours.</p>
                    <a href={`mailto:${supportEmail}`} className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      {supportEmail} <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Contact Method: Visit */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">Flagship Store</h3>
                    <p className="text-muted-foreground text-sm mb-2">123 Optical Avenue, Design District, NY 10012</p>
                    <a href="/store-locator" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      Get Directions <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Form */}
          <div>
            <RevealOnScroll delay={0.2}>
              <div className="bg-neutral-50 p-8 md:p-12 rounded-2xl border border-neutral-100">
                <h3 className="font-display text-2xl font-medium mb-6">Send a Message</h3>
                <form className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">First Name</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">Last Name</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-neutral-500">Subject</label>
                    <select 
                      id="subject" 
                      className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                    >
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Eye Examination</option>
                      <option>Repairs & Warranty</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-neutral-500">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors resize-none"
                      required
                    ></textarea>
                  </div>

                  <Button type="button" className="w-full h-12 text-sm uppercase tracking-widest mt-4">
                    Send Inquiry
                  </Button>
                </form>
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </main>
  );
}

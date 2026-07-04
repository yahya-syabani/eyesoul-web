import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export async function generateMetadata() {
  return {
    title: "Terms of Service - Eyesoul Premium Eyewear",
    description: "Terms and conditions governing the use of Eyesoul's website and services.",
  };
}

export default async function TermsPage() {
  return (
    <main className="flex-grow bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
            Terms of Service
          </h1>
          <div className="w-12 h-1 bg-primary mb-12"></div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="prose prose-neutral prose-lg max-w-none">
            <p>Last updated: June 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Eyesoul website and services, you agree to be bound
              by these Terms of Service. If you do not agree, please do not use our services.
            </p>

            <h2>2. Products & Services</h2>
            <p>
              All eyewear products are subject to availability. We reserve the right to
              modify or discontinue products without prior notice. Prescription lenses
              require in-store consultation for accurate measurements.
            </p>

            <h2>3. Ordering & Payment</h2>
            <p>
              Orders placed through our marketplace partners (Tokopedia, Shopee) are subject
              to the respective platform&apos;s terms. In-store purchases are governed by
              applicable consumer protection laws.
            </p>

            <h2>4. Warranty & Returns</h2>
            <p>
              All frames come with a manufacturer&apos;s warranty against defects in materials
              and workmanship. Warranty claims can be processed at any Eyesoul store.
              Prescription lenses are non-returnable due to hygiene and customization.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and designs — is
              the property of Eyesoul and protected by applicable intellectual property laws.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              Eyesoul shall not be liable for any indirect, incidental, or consequential
              damages arising from the use of our products or services.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Changes will be posted on this page
              with an updated revision date.
            </p>

            <h2>8. Contact</h2>
            <p>
              For questions about these terms, contact us via WhatsApp or email at
              hello@eyesoul.com.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </main>
  );
}

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return {
    title: "Privacy Policy - Eyesoul Premium Eyewear",
    description: "Learn how Eyesoul collects, uses, and protects your personal information.",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Navigation");

  return (
    <main className="flex-grow bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-12 h-1 bg-primary mb-12"></div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="prose prose-neutral prose-lg max-w-none">
            <p>Last updated: June 2026</p>

            <h2>1. Information We Collect</h2>
            <p>
              When you use our website or visit our stores, we may collect personal information
              including your name, email address, phone number, and prescription details
              (if applicable). We also collect anonymous browsing data through cookies and
              analytics tools.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to process orders, schedule appointments, respond to
              inquiries, improve our products and services, and send marketing communications
              (with your consent). We do not sell your personal data to third parties.
            </p>

            <h2>3. Data Storage & Security</h2>
            <p>
              Your data is stored securely on encrypted servers. We implement industry-standard
              security measures to protect your personal information from unauthorized access,
              alteration, or disclosure.
            </p>

            <h2>4. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              To exercise these rights, please contact us via WhatsApp or email.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website uses cookies to improve your browsing experience. You can control
              cookie preferences through your browser settings.
            </p>

            <h2>6. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at hello@eyesoul.com or via our
              WhatsApp concierge.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </main>
  );
}

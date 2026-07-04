"use client";

import { useTranslations } from 'next-intl';
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    // For MVP: simulate submission — no backend yet
    // Future: POST to a newsletter API endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-white/80 text-sm">
        {t('success')}
      </div>
    );
  }

  return (
    <form className="w-full md:max-w-md flex relative" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('placeholder')}
        required
        className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus:border-white transition-colors"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={status === "submitting"}
        className="absolute right-0 top-1 hover:bg-transparent hover:text-neutral-300"
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
      {status === "error" && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-400">
          {t('error')}
        </p>
      )}
    </form>
  );
}

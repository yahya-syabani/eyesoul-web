"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

export function ContactFormClient() {
  const t = useTranslations('page.contact');
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-neutral-50 p-8 md:p-12 rounded-2xl border border-neutral-100 text-center">
        <h3 className="font-display text-2xl font-medium mb-4">Thank You!</h3>
        <p className="text-muted-foreground">Your message has been sent. We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 p-8 md:p-12 rounded-2xl border border-neutral-100">
      <h3 className="font-display text-2xl font-medium mb-6">{t('form.heading')}</h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.firstName')}</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.lastName')}</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.email')}</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.subject')}</label>
          <select
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors"
          >
            <option value="General Inquiry">{t('form.subjectOptions.general')}</option>
            <option value="Order Support">{t('form.subjectOptions.order')}</option>
            <option value="Eye Examination">{t('form.subjectOptions.exam')}</option>
            <option value="Repairs & Warranty">{t('form.subjectOptions.repairs')}</option>
          </select>
        </div>

        <div className="space-y-2 pt-2">
          <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.message')}</label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-3 focus:outline-none focus:ring-0 focus:border-primary transition-colors resize-none"
            required
          ></textarea>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
        )}

        <Button type="submit" disabled={status === "submitting"} className="w-full h-12 text-sm uppercase tracking-widest mt-4">
          {status === "submitting" ? "Sending..." : t('form.submit')}
        </Button>
      </form>
    </div>
  );
}

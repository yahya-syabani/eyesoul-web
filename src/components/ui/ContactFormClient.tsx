"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { submitContactForm } from "@/lib/cms/contact";

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

    const ok = await submitContactForm(formData);
    if (ok) {
      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.firstName')}</label>
          <input id="firstName" type="text" value={formData.firstName} onChange={handleChange} required className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-sm text-sm" />
        </div>
        <div>
          <label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.lastName')}</label>
          <input id="lastName" type="text" value={formData.lastName} onChange={handleChange} required className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-sm text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.email')}</label>
        <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-sm text-sm" />
      </div>
      <div>
        <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.subject')}</label>
        <select id="subject" value={formData.subject} onChange={handleChange} className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-sm text-sm">
          <option>General Inquiry</option>
          <option>Order Support</option>
          <option>Eye Examination</option>
          <option>Repairs & Warranty</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t('form.message')}</label>
        <textarea id="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-sm text-sm" />
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600">{t('form.success')}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{t('form.error')}</p>
      )}
      <Button type="submit" disabled={status === "submitting"} className="w-full h-12 text-sm uppercase tracking-widest mt-4">
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}

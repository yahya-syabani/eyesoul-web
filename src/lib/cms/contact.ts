interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submits a contact form to the CMS.
 */
export async function submitContactForm(data: ContactFormData): Promise<boolean> {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Verifies Turnstile token, then emails the message via Resend.
// Env vars (Vercel): TURNSTILE_SECRET_KEY, RESEND_API_KEY, CONTACT_TO_EMAIL
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { name, email, phone, message, token } = req.body || {};
  if (!name || !email || !message || !token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
  }).then((r) => r.json());
  if (!check.success) return res.status(400).json({ error: 'Human check failed' });

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'EB5 Website <onboarding@resend.dev>', // ponytail: swap to own domain once verified in Resend
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `EB5 inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\n${message}`,
    }),
  });
  if (!send.ok) return res.status(502).json({ error: 'Could not send message' });

  res.status(200).json({ ok: true });
}

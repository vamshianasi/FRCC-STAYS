/**
 * server/send-receipt.example.js
 *
 * EXAMPLE backend endpoint for the WhatsApp receipt feature.
 * Copy this into your own server (Node/Express, a serverless function, or a
 * Next.js API route) and adapt as needed.
 *
 * IMPORTANT SECURITY RULES
 *  - The WhatsApp Business Cloud API token must live ONLY here (or in your
 *    secret manager), never in frontend code and never in a git repo.
 *  - This endpoint receives only the booking id and the destination number.
 *    It looks the booking up on your side and builds the PDF itself, so the
 *    browser never has to hand over personal data or a PDF blob.
 *  - Do not log the token, the full phone number, or the ID number.
 *
 * Required environment variables
 *   WHATSAPP_TOKEN          = permanent token from Meta WhatsApp > API setup
 *   WHATSAPP_PHONE_NUMBER_ID = the sender number id (phone number id)
 *   WHATSAPP_TEMPLATE_NAME   = an APPROVED template name (e.g. frcc_booking_receipt)
 *
 * Meta message templates must be reviewed and approved by Meta before a
 * business-initiated template message can be sent. Templates are created in
 * WhatsApp Manager > Message Templates.
 */

const express = require('express');
const app = express();
app.use(express.json({ limit: '2mb' }));

const API_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${API_VERSION}`;

// Where your own booking data lives (database, another service, ...).
async function loadBooking(bookingId) {
  // Replace with a real lookup.
  throw new Error(`Implement loadBooking() for ${bookingId}`);
}

// Where your own PDF renderer lives. Must contain only the MASKED ID number.
async function renderReceiptPdf(booking) {
  // Replace with your PDF generator (the frontend uses lib/receiptPdf.js).
  throw new Error(`Implement renderReceiptPdf() for ${booking.id}`);
}

// Upload the PDF to Meta and get a media id (documents need a public URL or
// an uploaded media handle).
async function uploadDocument(pdfBuffer, mimeType = 'application/pdf', filename = 'receipt.pdf') {
  const form = new FormData();
  form.append('file', new Blob([pdfBuffer], { type: mimeType }), filename);
  form.append('type', mimeType');

  const res = await fetch(`${GRAPH_BASE}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    body: form
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Upload failed: ${data.error?.message || res.status}`);
  return data.id;
}

app.post('/api/send-receipt', async (req, res) => {
  const { bookingId, to } = req.body || {};
  if (!bookingId || !to) {
    return res.status(400).json({ error: 'bookingId and to are required' });
  }
  // Keep the destination as the caller sent it; do not echo it back in errors.
  try {
    const booking = await loadBooking(bookingId);
    const pdf = await renderReceiptPdf(booking);
    const mediaId = await uploadDocument(pdf);

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME || 'frcc_booking_receipt',
        language: { code: 'en' },
        components: [
          { type: 'header', parameters: [{ type: 'document', document: { link: mediaId } }] },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: String(booking.guestName || 'Guest') },
              { type: 'text', text: String(booking.id) },
              { type: 'text', text: String(booking.hotel?.name || '') }
            ]
          }
        ]
      }
    };

    const sendRes = await fetch(`${GRAPH_BASE}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const sendData = await sendRes.json();
    if (!sendRes.ok) throw new Error(`Send failed: ${sendData.error?.message || sendRes.status}`);

    // Return only a message id — never the number or the token.
    res.json({ messageId: sendData.messages?.[0]?.id || null });
  } catch (err) {
    // Log a safe message only.
    console.error('[send-receipt] failed:', err.message);
    res.status(502).json({ error: 'Receipt could not be sent' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`send-receipt example listening on :${PORT}`));
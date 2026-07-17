/* =========================================================
   contact.js — saves the message to the backend (MongoDB)
   AND sends emails via EmailJS (owner notification + visitor
   auto-reply), directly from the browser.

   Requires the EmailJS SDK script tag in contact.html, and
   the four EmailJS config values filled in below.
   ========================================================= */

// --- EmailJS config — fill these in from your EmailJS dashboard ---
const EMAILJS_PUBLIC_KEY = "wAhV1sAqEeU4lQKjf";                 // Account > General
const EMAILJS_SERVICE_ID = "service_yyinybc";                 // Email Services
const EMAILJS_OWNER_TEMPLATE_ID = "template_2kiivcw";           // notifies you
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_ftgyghd";   // replies to visitor

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Initialize EmailJS once
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      showStatus('Please fill in every field.', false);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // 1. Save to backend / MongoDB
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || "Request failed");
      }

      // 2. Send notification email to owner (Aakriti)
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE_ID, {
        from_name: payload.name,
        from_email: payload.email,
        message: payload.message
      });

      // 3. Send auto-reply to the visitor
      // Wrapped separately so a failure here doesn't block the success message —
      // the message was already saved and the owner was already notified.
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, {
          to_name: payload.name,
          to_email: payload.email,
          message: payload.message
        });
      } catch (autoReplyErr) {
        console.warn("Auto-reply to visitor failed:", autoReplyErr);
      }

      showStatus("Message sent — thanks for reaching out! I'll reply soon.", true);
      form.reset();

    } catch (err) {
      console.error("Error:", err);
      showStatus(err.message || "Something went wrong. Please try again.", false);

    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });

  function showStatus(msg, ok) {
    status.textContent = msg;
    status.classList.remove('ok', 'err');
    status.classList.add('show', ok ? 'ok' : 'err');
  }
});
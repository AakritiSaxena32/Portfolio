/* =========================================================
   contact.js — submits the contact form to the backend API
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
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
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("Status:", res.status);
    console.log("Response:", data);

    if (!res.ok) {
      throw new Error(data.details || data.error || "Request failed");
    }

    showStatus("Message sent — thanks for reaching out! I'll reply soon.", true);
    form.reset();

  } catch (err) {
    console.error("Error:", err);
    showStatus(err.message, false);

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
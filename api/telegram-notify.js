// Vercel Serverless Function: token Telegram hanya dibaca dari Environment Variables.
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, message: "Konfigurasi notifikasi server belum lengkap." });
  }

  const body = req.body || {};
  const stage = body.stage === "complete" ? "complete" : "welcome";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const origin = typeof body.origin === "string" ? body.origin.trim() : "";
  const destination = typeof body.destination === "string" ? body.destination.trim() : "";
  const consent = body.consent === true;

  if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80 || !consent) {
    return res.status(400).json({ ok: false, message: "Periksa nama dan persetujuan sebelum melanjutkan." });
  }
  if (stage === "complete" && (!origin || !destination || origin.length > 240 || destination.length > 240)) {
    return res.status(400).json({ ok: false, message: "Lengkapi lokasi asal dan tujuan terlebih dahulu." });
  }

  const message = stage === "complete"
    ? "<b>Form Kiosplay selesai</b>\n" +
      "<b>Nama:</b> " + escapeHtml(firstName + " " + lastName) + "\n" +
      "<b>Dikirim dari:</b> " + escapeHtml(origin) + "\n" +
      "<b>Diantar ke:</b> " + escapeHtml(destination) + "\n" +
      "<b>Status persetujuan:</b> Disetujui"
    : "<b>Form Kiosplay dimulai</b>\n" +
      "<b>Nama:</b> " + escapeHtml(firstName + " " + lastName) + "\n" +
      "<b>Status persetujuan:</b> Disetujui";

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const data = await tg.json();
    if (!tg.ok || !data.ok) {
      console.error("Telegram API rejected notification:", data.description || tg.status);
      return res.status(502).json({ ok: false, message: "Telegram belum dapat menerima notifikasi." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Telegram notification failed:", err.message);
    return res.status(502).json({ ok: false, message: "Tidak dapat menghubungi Telegram." });
  }
};

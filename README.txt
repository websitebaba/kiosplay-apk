# Kiosplay + Telegram (Vercel)

## Yang dikirim
Hanya nama yang diisi pada form dan status persetujuan. Tidak mengirim password, alamat, lokasi, atau token ke browser.

## Pengaturan wajib
1. Deploy folder ini sebagai project di Vercel.
2. Buka Project Settings -> Environment Variables.
3. Tambahkan:
   - `TELEGRAM_BOT_TOKEN` = token bot Telegram (isi langsung di dashboard Vercel; jangan di HTML atau chat).
   - `TELEGRAM_CHAT_ID` = ID chat/grup tujuan notifikasi.
4. Pilih environment Production (dan Preview jika diperlukan), lalu redeploy.

## Mendapatkan CHAT_ID
- Kirim pesan `/start` ke bot dari akun tujuan.
- Buka `https://api.telegram.org/bot<TOKEN_ANDA>/getUpdates` setelah mengganti placeholder secara lokal/pribadi.
- Cari nilai `message.chat.id` pada respons. Untuk grup, tambahkan bot ke grup lalu kirim pesan di grup dan periksa `chat.id`.
- Jangan membagikan URL yang berisi token kepada siapa pun. Jika token pernah terekspos, buat ulang melalui BotFather.

## Catatan
- Frontend memanggil endpoint same-origin `/api/telegram-notify`.
- Token hanya dibaca server dari Environment Variables.
- Pastikan domain menggunakan HTTPS.
- Uji dengan data dummy setelah deployment.

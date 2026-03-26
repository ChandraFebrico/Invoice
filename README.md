# Freelancer Invoice Generator

Project kecil buat bikin invoice freelancer dengan cara cepet.
Dibikin pake Next.js (Pages Router), jadi gak ribet setup macem-macem.

## Ini project buat apa?

Kadang kita cuma pengen:

1. Isi data client
2. Tambah item jasa
3. Download PDF

Nah project ini fokus ke itu aja.

## Fitur yang udah jalan

- Form invoice: nama klien, project, due date, status.
- Item bisa banyak (qty + rate), total ngitung otomatis.
- Ada PPN 10% dan diskon persen.
- Template preview: klasik, modern, minimalis.
- Bisa upload logo sendiri.
- Bisa ganti warna tema + font.
- Generate PDF di browser (jsPDF).
- Generate PDF via API route (PDFKit) juga ada.
- Simpan riwayat invoice ke localStorage.
- Export history ke CSV dan "Excel" (.xls model TSV).
- Ada tombol Ko-fi buat support pembuatnya :)

## Catetan kecil

- Halaman /dashboard sekarang cuma redirect ke halaman utama.
- Jadi semua proses sebenernya kepake di halaman home.
- Ini emang masih simple bgt, tapi kepake.

## Struktur folder utama

- pages/index.js -> halaman utama.
- pages/api/generate.js -> endpoint generate PDF pake PDFKit.
- components/InvoiceForm.js -> form + action button.
- components/InvoicePreview.js -> preview invoice realtime.
- components/InvoiceItem.js -> satu baris item.
- lib/invoiceStore.js -> helper simpen data invoice.
- styles/globals.css -> styling global.
- styles/InvoiceLayout.module.css -> layout halaman.

## Jalanin di lokal

```bash
npm install
npm run dev
```

Lalu buka: http://localhost:3000

## Tech stack

- Next.js Pages Router
- React
- jsPDF
- PDFKit

import Head from "next/head";
import Link from "next/link";
import styles from "../styles/InvoiceLayout.module.css";

const SITE_URL = "https://freelancer-invoice-generator.vercel.app";

export default function TermsPage() {
    return (
        <>
            <Head>
                <title>Terms of Service | Invoice Generator Gratis</title>
                <meta
                    name="description"
                    content="Syarat penggunaan Invoice Generator Gratis, termasuk batas tanggung jawab dan penggunaan aplikasi sebagai alat bantu pembuatan invoice."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${SITE_URL}/terms`} />
            </Head>

            <main className={styles.pageShell}>
                <section className={styles.hero}>
                    <h1>Terms of Service</h1>
                    <p>
                        Dengan menggunakan Invoice Generator Gratis, Anda setuju pada syarat
                        penggunaan berikut.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>1. Fungsi Layanan</h2>
                    <p>
                        Aplikasi ini disediakan sebagai alat bantu untuk membuat invoice dan
                        menghasilkan dokumen PDF. Layanan ini tidak dimaksudkan sebagai nasihat
                        hukum, pajak, atau akuntansi.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>2. Akurasi dan Kepatuhan</h2>
                    <p>
                        Anda bertanggung jawab penuh untuk memeriksa akurasi isi invoice,
                        kesesuaian nominal, identitas pihak terkait, serta kepatuhan pada hukum,
                        perpajakan, dan administrasi bisnis yang berlaku.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>3. Bukan Faktur Pajak Resmi</h2>
                    <p>
                        Invoice yang dihasilkan oleh aplikasi ini adalah dokumen tagihan umum dan
                        bukan pengganti faktur pajak resmi atau dokumen kepatuhan lain yang mungkin
                        diwajibkan oleh regulator.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>4. Batas Tanggung Jawab</h2>
                    <p>
                        Pemilik aplikasi tidak bertanggung jawab atas kerugian, sengketa, denda,
                        atau konsekuensi bisnis yang timbul dari penggunaan invoice, kesalahan input,
                        atau ketidakpatuhan pengguna terhadap aturan yang berlaku.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>5. Penggunaan yang Wajar</h2>
                    <p>
                        Anda setuju untuk menggunakan aplikasi ini hanya untuk tujuan yang sah dan
                        tidak menyalahgunakannya untuk kegiatan penipuan, pemalsuan, atau tindakan
                        lain yang melanggar hukum.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>6. Perubahan Layanan</h2>
                    <p>
                        Fitur, tampilan, atau isi layanan dapat diubah, dibatasi, atau dihentikan
                        sewaktu-waktu tanpa pemberitahuan terlebih dahulu.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <p>
                        Untuk kebutuhan hukum atau kepatuhan formal, gunakan review dari konsultan
                        hukum, pajak, atau akuntansi yang relevan.
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="/">Kembali ke Home</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                    </div>
                </section>
            </main>
        </>
    );
}
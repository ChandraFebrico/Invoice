import Head from "next/head";
import Link from "next/link";
import InvoiceForm from "../components/InvoiceForm";
import styles from "../styles/InvoiceLayout.module.css";

const SITE_URL = "https://freelancer-invoice-generator.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.svg`;

export default function Home() {
    return (
        <>
            <Head>
                {/* Primary */}
                <title>Buat Invoice Freelancer Gratis — Download PDF Langsung</title>
                <meta
                    name="description"
                    content="Buat invoice tagihan profesional secara gratis, tanpa daftar. Lengkap dengan PPN, diskon, logo, dan download PDF. Cocok untuk freelancer & UMKM Indonesia."
                />
                <meta
                    name="keywords"
                    content="buat invoice gratis, invoice freelancer, contoh invoice, template invoice, invoice tagihan, cara buat invoice, unduh invoice PDF, invoice jasa, invoice online, kwitansi digital, nota tagihan, invoice PPN, invoice UMKM, invoice desainer, invoice developer"
                />
                <meta name="author" content="febrecco" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="Indonesian" />
                <meta name="geo.region" content="ID" />
                <meta name="geo.placename" content="Indonesia" />
                <link rel="canonical" href={SITE_URL} />

                {/* Open Graph (WhatsApp, Facebook, Telegram pakai ini) */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:title" content="Buat Invoice Freelancer Gratis — Download PDF Langsung" />
                <meta
                    property="og:description"
                    content="Buat invoice tagihan profesional secara gratis, tanpa daftar. Lengkap dengan PPN, diskon, logo, dan download PDF. Cocok untuk freelancer & UMKM Indonesia."
                />
                <meta property="og:image" content={OG_IMAGE} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="id_ID" />
                <meta property="og:site_name" content="Invoice Generator Gratis" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={SITE_URL} />
                <meta name="twitter:title" content="Buat Invoice Freelancer Gratis — Download PDF Langsung" />
                <meta
                    name="twitter:description"
                    content="Buat invoice tagihan profesional secara gratis, tanpa daftar. Lengkap dengan PPN, diskon, logo, dan download PDF."
                />
                <meta name="twitter:image" content={OG_IMAGE} />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            name: "Invoice Generator Gratis",
                            alternateName: "Freelancer Invoice Generator",
                            url: SITE_URL,
                            description:
                                "Buat invoice tagihan profesional secara gratis. Lengkap dengan PPN, diskon, logo, dan download PDF. Cocok untuk freelancer & UMKM Indonesia.",
                            applicationCategory: "BusinessApplication",
                            operatingSystem: "Any",
                            inLanguage: "id-ID",
                            isAccessibleForFree: true,
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "IDR",
                            },
                            featureList: [
                                "Buat invoice PDF gratis",
                                "Hitung PPN otomatis",
                                "Template invoice profesional",
                                "Export CSV dan Excel",
                                "Riwayat invoice tersimpan",
                            ],
                            author: {
                                "@type": "Person",
                                name: "febrecco",
                                url: "https://ko-fi.com/febrecco",
                            },
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: [
                                {
                                    "@type": "Question",
                                    name: "Apakah invoice ini bisa dipakai gratis?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Ya. Anda bisa membuat invoice, menambahkan item, menghitung PPN dan diskon, lalu mengunduh PDF tanpa biaya.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Apakah data invoice tersimpan di browser?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Aplikasi ini mendukung penyimpanan riwayat invoice di sisi client agar draft lebih mudah dilanjutkan.",
                                    },
                                },
                                {
                                    "@type": "Question",
                                    name: "Apakah bisa dipakai untuk freelancer dan UMKM Indonesia?",
                                    acceptedAnswer: {
                                        "@type": "Answer",
                                        text: "Bisa. Struktur invoice dirancang untuk kebutuhan tagihan jasa, proyek, dan pekerjaan lepas dengan format yang sederhana dan profesional.",
                                    },
                                },
                            ],
                        }),
                    }}
                />
            </Head>

            <main className={styles.pageShell}>
                <section className={styles.hero}>
                    <h1>Buat Invoice Freelancer Gratis</h1>
                    <p>
                        Buat invoice profesional untuk klien, hitung PPN dan diskon otomatis,
                        lalu download PDF langsung dari browser.
                    </p>
                </section>

                <InvoiceForm />

                <section className={styles.contentSection}>
                    <h2>Invoice Online untuk Freelancer dan UMKM</h2>
                    <p>
                        Halaman ini membantu Anda membuat invoice tagihan tanpa perlu aplikasi
                        akuntansi yang rumit. Cocok untuk desainer, developer, marketer,
                        konsultan, videografer, dan pelaku UMKM yang ingin mengirim invoice
                        dengan tampilan rapi dan profesional.
                    </p>
                    <p>
                        Anda bisa menambahkan nama klien, alamat, nomor PO, item pekerjaan,
                        harga, PPN, diskon, logo bisnis, dan catatan pembayaran dalam satu
                        form yang langsung memperbarui preview invoice.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>Fitur Invoice Generator</h2>
                    <div className={styles.featureGrid}>
                        <article className={styles.featureCard}>
                            <h3>Download PDF Instan</h3>
                            <p>
                                Generate invoice PDF langsung di browser tanpa proses yang
                                panjang.
                            </p>
                        </article>
                        <article className={styles.featureCard}>
                            <h3>Hitung PPN dan Diskon</h3>
                            <p>
                                Total tagihan, pajak, dan potongan dihitung otomatis dari item
                                invoice yang Anda input.
                            </p>
                        </article>
                        <article className={styles.featureCard}>
                            <h3>Template Siap Kirim</h3>
                            <p>
                                Preview invoice dibuat agar mudah dibagikan ke klien dengan format
                                yang bersih dan konsisten.
                            </p>
                        </article>
                    </div>
                </section>

                <section className={styles.contentSection}>
                    <h2>Pertanyaan Umum</h2>
                    <div className={styles.faqList}>
                        <article>
                            <h3>Apakah invoice ini gratis?</h3>
                            <p>
                                Ya, Anda bisa membuat invoice dan mengunduh PDF tanpa perlu
                                mendaftar.
                            </p>
                        </article>
                        <article>
                            <h3>Apakah bisa dipakai untuk jasa freelance?</h3>
                            <p>
                                Bisa. Struktur field-nya cocok untuk invoice proyek, retainer,
                                maupun pekerjaan berbasis item dan kuantitas.
                            </p>
                        </article>
                        <article>
                            <h3>Apakah bisa menambahkan logo dan catatan pembayaran?</h3>
                            <p>
                                Bisa. Form invoice sudah mendukung logo, terms, notes, dan detail
                                klien agar hasil PDF lebih profesional.
                            </p>
                        </article>
                    </div>
                </section>

                <section className={styles.legalSection}>
                    <p>
                        Dengan menggunakan aplikasi ini, Anda setuju bahwa invoice yang dibuat
                        merupakan dokumen tagihan dan bukan pengganti faktur pajak resmi atau
                        nasihat hukum maupun akuntansi.
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </section>
            </main>
        </>
    );
}

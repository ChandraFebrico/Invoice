import Head from "next/head";
import Link from "next/link";
import styles from "../styles/InvoiceLayout.module.css";

const SITE_URL = "https://freelancer-invoice-generator.vercel.app";

export default function PrivacyPage() {
    return (
        <>
            <Head>
                <title>Privacy Policy | Invoice Generator Gratis</title>
                <meta
                    name="description"
                    content="Kebijakan privasi untuk Invoice Generator Gratis, termasuk penjelasan data invoice, penyimpanan, dan penggunaan layanan."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${SITE_URL}/privacy`} />
            </Head>

            <main className={styles.pageShell}>
                <section className={styles.hero}>
                    <h1>Privacy Policy</h1>
                    <p>
                        Kebijakan ini menjelaskan bagaimana Invoice Generator Gratis memproses
                        data saat Anda menggunakan aplikasi ini.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>1. Data yang Diproses</h2>
                    <p>
                        Aplikasi ini dapat memproses informasi yang Anda masukkan ke dalam form,
                        termasuk nama klien, alamat klien, nomor PO, item invoice, nilai tagihan,
                        catatan, syarat pembayaran, dan logo.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>2. Penyimpanan Data</h2>
                    <p>
                        Data invoice pada umumnya digunakan untuk menghasilkan preview dan file PDF.
                        Jika aplikasi menyimpan draft atau riwayat invoice, penyimpanan tersebut
                        dilakukan di sisi client atau browser pengguna kecuali dinyatakan lain.
                    </p>
                    <p>
                        Kami tidak menyatakan bahwa seluruh data disimpan secara permanen di server
                        untuk kebutuhan layanan ini kecuali ada fitur tambahan yang secara eksplisit
                        menjelaskan hal tersebut.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>3. Penggunaan Data</h2>
                    <p>Data yang Anda input digunakan untuk:</p>
                    <p>membuat preview invoice, menghasilkan file PDF, dan membantu Anda melanjutkan draft invoice jika fitur penyimpanan lokal tersedia.</p>
                </section>

                <section className={styles.contentSection}>
                    <h2>4. Pembagian Data</h2>
                    <p>
                        Aplikasi ini tidak dirancang sebagai layanan berbagi data invoice ke pihak
                        ketiga di luar kebutuhan teknis normal aplikasi. Namun, Anda tetap
                        bertanggung jawab untuk tidak memasukkan data sensitif yang tidak perlu.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>5. Tanggung Jawab Pengguna</h2>
                    <p>
                        Anda bertanggung jawab atas keakuratan, legalitas, dan kelayakan informasi
                        yang dimasukkan ke dalam invoice, termasuk kepatuhan terhadap aturan pajak,
                        akuntansi, dan administrasi bisnis yang berlaku.
                    </p>
                </section>

                <section className={styles.contentSection}>
                    <h2>6. Perubahan Kebijakan</h2>
                    <p>
                        Kebijakan ini dapat diperbarui sewaktu-waktu untuk menyesuaikan perubahan
                        fitur, operasional, atau kewajiban hukum.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <p>
                        Jika Anda membutuhkan kejelasan hukum, pajak, atau kepatuhan bisnis,
                        gunakan pendampingan profesional yang sesuai.
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="/">Kembali ke Home</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </section>
            </main>
        </>
    );
}
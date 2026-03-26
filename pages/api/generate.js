import PDFDocument from "pdfkit";

function toCurrency(value) {
    const amount = Number(value || 0);
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDateByLang(value, language) {
    if (!value) return "-";
    if (language === "en") {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("en-US");
    }
    const [year, month, day] = String(value).split("-");
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
}

function statusLabel(value, language) {
    if (language === "en") {
        return value === "paid" ? "Paid" : "Unpaid";
    }
    return value === "paid" ? "Lunas" : "Belum Lunas";
}

const LABELS = {
    id: {
        title: "Invoice",
        client: "Klien",
        address: "Alamat",
        project: "Proyek",
        po: "No. PO",
        invoiceDate: "Tanggal Invoice",
        dueDate: "Jatuh Tempo",
        status: "Status",
        item: "Item",
        qty: "Qty",
        rate: "Harga",
        totalCol: "Total",
        subtotal: "Subtotal",
        tax: "PPN",
        discount: "Diskon",
        total: "Total",
        terms: "Syarat",
        notes: "Catatan",
    },
    en: {
        title: "Invoice",
        client: "Client",
        address: "Address",
        project: "Project",
        po: "PO Number",
        invoiceDate: "Invoice Date",
        dueDate: "Due Date",
        status: "Status",
        item: "Item",
        qty: "Qty",
        rate: "Rate",
        totalCol: "Total",
        subtotal: "Subtotal",
        tax: "Tax",
        discount: "Discount",
        total: "Total",
        terms: "Terms",
        notes: "Notes",
    },
};

export default function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        language = "id",
        clientName,
        clientAddress,
        projectName,
        poNumber,
        invoiceDate,
        dueDate,
        items = [],
        subtotal = 0,
        taxPercent = 0,
        taxAmount = 0,
        discountAmount = 0,
        discountPercent = 0,
        total = 0,
        footerTerms = "",
        footerNotes = "",
        themeColor = "#0f766e",
        status = "unpaid",
    } = req.body || {};

    const labels = LABELS[language] || LABELS.id;
    const normalizedClientName = clientName?.trim();
    const normalizedClientAddress = clientAddress?.trim();

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

    doc.pipe(res);

    doc
        .roundedRect(50, 42, 42, 42, 8)
        .fillAndStroke(themeColor, themeColor);
    doc
        .fillColor("#ffffff")
        .fontSize(14)
        .text("FL", 63, 58, { align: "center", width: 16 });

    doc
        .fillColor("#111827")
        .fontSize(28)
        .text(labels.title, 110, 50);

    doc
        .fontSize(10)
        .fillColor("#4b5563")
        .text(
            `${formatDateByLang(invoiceDate, language)}`,
            430,
            56,
            { width: 115, align: "right" }
        )
        .text(
            `${labels.po}: ${poNumber || "-"}`,
            430,
            70,
            { width: 115, align: "right" }
        );

    doc
        .fontSize(11)
        .fillColor("#4b5563");

    const metaLines = [
        `${labels.client}: ${normalizedClientName || ""}`,
        `${labels.address}: ${normalizedClientAddress || ""}`,
        `${labels.project}: ${projectName || "-"}`,
        `${labels.dueDate}: ${formatDateByLang(dueDate, language)}`,
        `${labels.status}: ${statusLabel(status, language)}`,
    ];

    metaLines.forEach((line, index) => {
        doc.text(line, 50, 120 + index * 20);
    });

    const validItems = Array.isArray(items)
        ? items.filter((item) => item && item.description)
        : [];

    if (validItems.length > 0) {
        let y = 250;

        doc
            .fillColor("#ffffff")
            .rect(50, y, 495, 26)
            .fill(themeColor);

        doc
            .fillColor("#ffffff")
            .fontSize(10)
            .text(labels.item, 60, y + 8)
            .text(labels.qty, 330, y + 8)
            .text(labels.rate, 390, y + 8)
            .text(labels.totalCol, 470, y + 8);

        y += 30;

        validItems.forEach((item, idx) => {
            const quantity = Number(item.quantity || 0);
            const rate = Number(item.rate || 0);
            const total = quantity * rate;

            if (idx % 2 === 0) {
                doc
                    .fillColor("#f3f4f6")
                    .rect(50, y - 4, 495, 24)
                    .fill();
            }

            doc
                .fillColor("#111827")
                .fontSize(10)
                .text(item.description, 60, y)
                .text(String(quantity), 330, y)
                .text(toCurrency(rate), 390, y)
                .text(toCurrency(total), 470, y);

            y += 24;
        });

        y += 8;
        const hasDiscount = Number(discountPercent || 0) > 0;
        doc
            .fillColor("#111827")
            .fontSize(11)
            .text(`${labels.subtotal}: ${toCurrency(subtotal)}`, 50, y)
            .text(`${labels.tax} ${Number(taxPercent || 0)}%: ${toCurrency(taxAmount)}`, 50, y + 18);

        if (hasDiscount) {
            doc.text(`${labels.discount}: ${toCurrency(discountAmount)}`, 50, y + 36);
        }

        doc
            .font("Helvetica-Bold")
            .text(`${labels.total}: ${toCurrency(total)}`, 50, hasDiscount ? y + 54 : y + 36)
            .font("Helvetica");
    }

    doc
        .fillColor("#4b5563")
        .fontSize(10)
        .text(`${labels.terms}: ${footerTerms || "-"}`, 50, 740)
        .text(`${labels.notes}: ${footerNotes || "-"}`, 50, 756);

    doc.end();
}

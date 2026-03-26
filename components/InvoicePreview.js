function toCurrency(value) {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
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
        po: "No. PO",
        invoiceDate: "Tanggal Invoice",
        dueDate: "Jatuh Tempo",
        status: "Status",
        subtotal: "Subtotal",
        tax: "PPN",
        discount: "Diskon",
        total: "Total Akhir",
        item: "Item",
        qty: "Qty",
        rate: "Harga",
        totalCol: "Total",
    },
    en: {
        title: "Invoice",
        client: "Client",
        address: "Address",
        po: "PO Number",
        invoiceDate: "Invoice Date",
        dueDate: "Due Date",
        status: "Status",
        subtotal: "Subtotal",
        tax: "Tax",
        discount: "Discount",
        total: "Grand Total",
        item: "Item",
        qty: "Qty",
        rate: "Rate",
        totalCol: "Total",
    },
};

const templateClass = {
    klasik: "preview-klasik",
    modern: "preview-modern",
    minimalis: "preview-minimalis",
};

export default function InvoicePreview({ invoice }) {
    const className = templateClass[invoice.template] || "preview-klasik";
    const language = invoice.language || "id";
    const labels = LABELS[language] || LABELS.id;
    const clientName = invoice.clientName?.trim();
    const clientAddress = invoice.clientAddress?.trim();

    return (
        <aside className={`preview-card ${className}`}>
            <div
                className="preview-head"
                style={{
                    borderColor: invoice.themeColor,
                }}
            >
                <div className="preview-head-main">
                    <img
                        src={invoice.logoDataUrl || "/logo.png"}
                        alt="Logo"
                        className="preview-logo"
                    />
                    <div>
                        <h3 style={{ color: invoice.themeColor }}>{labels.title}</h3>
                        <p>{invoice.projectName || "-"}</p>
                    </div>
                </div>
                <div className="preview-head-date">
                    <strong>{formatDateByLang(invoice.invoiceDate, language)}</strong>
                    <p>{labels.po}</p>
                    <strong>{invoice.poNumber || "-"}</strong>
                </div>
            </div>

            <div className="preview-meta" style={{ fontFamily: invoice.fontFamily }}>
                <p>{labels.client}: {clientName || ""}</p>
                <p>{labels.address}: {clientAddress || ""}</p>
                <p>{labels.dueDate}: {formatDateByLang(invoice.dueDate, language)}</p>
                <p>{labels.status}: {statusLabel(invoice.status, language)}</p>
            </div>

            <div className="preview-items">
                <div className="preview-row preview-header" style={{ background: invoice.themeColor }}>
                    <span>{labels.item}</span>
                    <span>{labels.qty}</span>
                    <span>{labels.rate}</span>
                    <span>{labels.totalCol}</span>
                </div>

                {invoice.items
                    .filter((item) => item.description.trim())
                    .map((item, index) => {
                        const qty = Number(item.quantity || 0);
                        const rate = Number(item.rate || 0);
                        return (
                            <div className="preview-row" key={`${item.id || item.description}-${index}`}>
                                <span>{item.description}</span>
                                <span>{qty}</span>
                                <span>{toCurrency(rate)}</span>
                                <span>{toCurrency(qty * rate)}</span>
                            </div>
                        );
                    })}
            </div>

            <div className="preview-total">
                <p>{labels.subtotal}: {toCurrency(invoice.subtotal)}</p>
                <p>{labels.tax} {Number(invoice.taxPercent || 0)}%: {toCurrency(invoice.taxAmount)}</p>
                {Number(invoice.discountPercent || 0) > 0 ? (
                    <p>{labels.discount}: {toCurrency(invoice.discountAmount)}</p>
                ) : null}
                <p className="strong">{labels.total}: {toCurrency(invoice.total)}</p>
            </div>

            <footer className="preview-footer">
                <p>{invoice.footerTerms || "Terms: Payment due before due date."}</p>
                <p>{invoice.footerNotes || "Notes: Thank you for your business."}</p>
            </footer>
        </aside>
    );
}

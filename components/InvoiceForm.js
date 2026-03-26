import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import InvoiceItem from "./InvoiceItem";
import InvoicePreview from "./InvoicePreview";
import {
    deleteInvoice,
    getInvoices,
    makeInvoiceId,
    upsertInvoice,
} from "../lib/invoiceStore";

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
        documentTitle: "Invoice",
        detailsTitle: "Detail Invoice",
        client: "Nama Klien",
        address: "Alamat Klien",
        project: "Nama Proyek",
        poNumber: "Nomor PO",
        invoiceDate: "Tanggal Invoice",
        dueDate: "Tanggal Jatuh Tempo",
        status: "Status",
        unpaid: "Belum Lunas",
        paid: "Lunas",
        template: "Template",
        font: "Font",
        themeColor: "Warna Tema",
        tax: "PPN (%)",
        discount: "Diskon (%)",
        optional: "Opsional",
        uploadLogo: "Upload Logo Sendiri",
        footerTerms: "Syarat Pembayaran",
        footerNotes: "Catatan",
        itemList: "Daftar Item",
        addItem: "+ Tambah Item",
        subtotal: "Subtotal",
        discountLabel: "Diskon",
        total: "Total",
        downloadPdf: "Unduh PDF",
        downloadApi: "Unduh via API (PDFKit)",
        processing: "Memproses...",
        history: "Riwayat Invoice",
        emptyHistory: "Belum ada invoice tersimpan.",
        togglePaid: "Ubah Status",
        downloadHistoryPdf: "Download PDF",
        delete: "Hapus",
        termsPrefix: "Syarat",
        notesPrefix: "Catatan",
        tableItem: "Item",
        tableQty: "Qty",
        tableRate: "Harga",
        tableTotal: "Total",
        metaClient: "Klien",
        metaAddress: "Alamat",
        metaProject: "Proyek",
        metaPo: "No. PO",
        metaInvoiceDate: "Tanggal Invoice",
        metaDueDate: "Jatuh Tempo",
        metaStatus: "Status",
    },
    en: {
        documentTitle: "Invoice",
        detailsTitle: "Invoice Details",
        client: "Client Name",
        address: "Client Address",
        project: "Project Name",
        poNumber: "PO Number",
        invoiceDate: "Invoice Date",
        dueDate: "Due Date",
        status: "Status",
        unpaid: "Unpaid",
        paid: "Paid",
        template: "Template",
        font: "Font",
        themeColor: "Theme Color",
        tax: "Tax (%)",
        discount: "Discount (%)",
        optional: "Optional",
        uploadLogo: "Upload Custom Logo",
        footerTerms: "Payment Terms",
        footerNotes: "Notes",
        itemList: "Item List",
        addItem: "+ Add Item",
        subtotal: "Subtotal",
        discountLabel: "Discount",
        total: "Total",
        downloadPdf: "Download PDF",
        downloadApi: "Download via API (PDFKit)",
        processing: "Processing...",
        history: "Invoice History",
        emptyHistory: "No saved invoices yet.",
        togglePaid: "Toggle Paid",
        downloadHistoryPdf: "Download PDF",
        delete: "Delete",
        termsPrefix: "Terms",
        notesPrefix: "Notes",
        tableItem: "Item",
        tableQty: "Qty",
        tableRate: "Rate",
        tableTotal: "Total",
        metaClient: "Client",
        metaAddress: "Address",
        metaProject: "Project",
        metaPo: "PO Number",
        metaInvoiceDate: "Invoice Date",
        metaDueDate: "Due Date",
        metaStatus: "Status",
    },
};

const TEMPLATE_OPTIONS = ["klasik", "modern", "minimalis"];
const FONT_OPTIONS = [
    "Arial",
    "Helvetica",
    "Georgia",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "Tahoma",
    "Calibri",
    "Gill Sans",
    "Palatino",
    "Garamond",
    "Century Gothic",
    "Courier New",
    "Segoe UI",
    "Open Sans",
    "Roboto",
    "Inter",
    "Poppins",
    "Lato",
    "Montserrat",
];

export default function InvoiceForm() {
    const [language, setLanguage] = useState("id");
    const [clientName, setClientName] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [projectName, setProjectName] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [dueDate, setDueDate] = useState("");
    const [items, setItems] = useState([
        { id: makeInvoiceId(), description: "", quantity: 1, rate: 0 },
    ]);
    const [taxPercent, setTaxPercent] = useState(10);
    const [discountPercent, setDiscountPercent] = useState("");
    const [template, setTemplate] = useState("klasik");
    const [themeColor, setThemeColor] = useState("#111111");
    const [fontFamily, setFontFamily] = useState("Georgia");
    const [footerTerms, setFooterTerms] = useState("Pembayaran maksimal 7 hari setelah invoice diterima.");
    const [footerNotes, setFooterNotes] = useState("Terima kasih atas kepercayaan Anda.");
    const [logoDataUrl, setLogoDataUrl] = useState("");
    const [status, setStatus] = useState("unpaid");
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    const [isServerGenerating, setIsServerGenerating] = useState(false);

    useEffect(() => {
        setInvoiceHistory(getInvoices());
    }, []);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (acc, item) =>
                    acc + Number(item.quantity || 0) * Number(item.rate || 0),
                0
            ),
        [items]
    );
    const taxAmount = useMemo(
        () => subtotal * (Number(taxPercent || 0) / 100),
        [subtotal, taxPercent]
    );
    const discountAmount = useMemo(
        () => (subtotal + taxAmount) * (Number(discountPercent || 0) / 100),
        [discountPercent, subtotal, taxAmount]
    );
    const hasDiscount = useMemo(() => Number(discountPercent || 0) > 0, [discountPercent]);
    const safeTaxPercent = Number(taxPercent || 0);
    const labels = LABELS[language] || LABELS.id;
    const total = useMemo(
        () => Math.max(subtotal + taxAmount - discountAmount, 0),
        [subtotal, taxAmount, discountAmount]
    );

    const currentInvoice = useMemo(
        () => ({
            id: makeInvoiceId(),
            language,
            clientName,
            clientAddress,
            projectName,
            poNumber,
            invoiceDate,
            dueDate,
            items,
            taxPercent: safeTaxPercent,
            discountPercent,
            subtotal,
            taxAmount,
            discountAmount,
            total,
            template,
            themeColor,
            fontFamily,
            footerTerms,
            footerNotes,
            logoDataUrl,
            status,
        }),
        [
            language,
            clientName,
            clientAddress,
            projectName,
            poNumber,
            invoiceDate,
            dueDate,
            items,
            safeTaxPercent,
            discountPercent,
            subtotal,
            taxAmount,
            discountAmount,
            total,
            template,
            themeColor,
            fontFamily,
            footerTerms,
            footerNotes,
            logoDataUrl,
            status,
        ]
    );

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            { id: makeInvoiceId(), description: "", quantity: 1, rate: 0 },
        ]);
    };

    const removeItem = (index) => {
        setItems((prev) => prev.filter((_, idx) => idx !== index));
    };

    const updateItem = (index, key, value) => {
        setItems((prev) =>
            prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item))
        );
    };

    const persistInvoice = () => {
        const record = {
            ...currentInvoice,
            id: makeInvoiceId(),
            createdAt: new Date().toISOString(),
            createdBy: "user",
        };

        const next = upsertInvoice(record);
        setInvoiceHistory(next);
        return record;
    };

    const renderPdf = (invoice) => {
        const doc = new jsPDF();
        const logo = invoice.logoDataUrl || buildLogoDataUrl();

        doc.setFillColor(241, 245, 249);
        doc.rect(0, 0, 210, 45, "F");

        doc.addImage(logo, "PNG", 14, 11, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(invoice.themeColor);
        const pdfLang = invoice.language || "id";
        const pdfLabels = LABELS[pdfLang] || LABELS.id;
        doc.text(pdfLabels.documentTitle, 40, 25);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(
            `${formatDateByLang(invoice.invoiceDate, pdfLang)}`,
            196,
            20,
            { align: "right" }
        );
        doc.text(
            `${pdfLabels.metaPo}: ${invoice.poNumber || "-"}`,
            196,
            26,
            { align: "right" }
        );

        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39);
        const metaLines = [
            `${pdfLabels.metaClient}: ${invoice.clientName?.trim() || ""}`,
            `${pdfLabels.metaAddress}: ${invoice.clientAddress?.trim() || ""}`,
            `${pdfLabels.metaProject}: ${invoice.projectName || "-"}`,
            `${pdfLabels.metaDueDate}: ${formatDateByLang(invoice.dueDate, pdfLang)}`,
            `${pdfLabels.metaStatus}: ${statusLabel(invoice.status, pdfLang)}`,
        ];

        metaLines.forEach((line, index) => {
            doc.text(line, 14, 60 + index * 8);
        });

        const validItems = invoice.items.filter((item) => item.description.trim());

        if (validItems.length > 0) {
            let y = 108;

            const rgb = hexToRgb(invoice.themeColor);
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(14, y, 182, 9, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text(pdfLabels.tableItem, 17, y + 6);
            doc.text(pdfLabels.tableQty, 112, y + 6);
            doc.text(pdfLabels.tableRate, 135, y + 6);
            doc.text(pdfLabels.tableTotal, 167, y + 6);

            y += 12;
            doc.setTextColor(17, 24, 39);

            validItems.forEach((item, idx) => {
                const quantity = Number(item.quantity || 0);
                const rate = Number(item.rate || 0);
                const total = quantity * rate;

                if (idx % 2 === 0) {
                    doc.setFillColor(249, 250, 251);
                    doc.rect(14, y - 4, 182, 8, "F");
                }

                doc.text(item.description, 17, y + 1);
                doc.text(String(quantity), 112, y + 1);
                doc.text(toCurrency(rate), 135, y + 1);
                doc.text(toCurrency(total), 167, y + 1);
                y += 8;
            });

            y += 6;
            doc.setTextColor(17, 24, 39);
            doc.text(`${pdfLabels.subtotal}: ${toCurrency(invoice.subtotal)}`, 14, y);
            doc.text(
                `${pdfLabels.tax.replace(" (%)", "")} ${Number(invoice.taxPercent || 0)}%: ${toCurrency(invoice.taxAmount)}`,
                14,
                y + 8
            );
            if (Number(invoice.discountPercent || 0) > 0) {
                doc.text(`${pdfLabels.discountLabel}: ${toCurrency(invoice.discountAmount)}`, 14, y + 16);
            }
            doc.setFont("helvetica", "bold");
            doc.text(
                `${pdfLabels.total}: ${toCurrency(invoice.total)}`,
                14,
                Number(invoice.discountPercent || 0) > 0 ? y + 24 : y + 16
            );
        }

        doc.setFont("helvetica", "normal");
        doc.text(`${pdfLabels.termsPrefix}: ${invoice.footerTerms || "-"}`, 14, 265);
        doc.text(`${pdfLabels.notesPrefix}: ${invoice.footerNotes || "-"}`, 14, 274);

        return doc;
    };

    const generateClientPdf = () => {
        const saved = persistInvoice();
        if (!saved) return;

        const doc = renderPdf(saved);

        const fileName = `invoice-${(saved.clientName || "client").toLowerCase().replace(/\s+/g, "-")}.pdf`;
        doc.save(fileName);
    };

    const generateServerPdf = async () => {
        const saved = persistInvoice();
        if (!saved) return;

        setIsServerGenerating(true);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...saved,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate PDF from server");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "invoice-server.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsServerGenerating(false);
        }
    };

    const exportCsv = () => {
        const rows = [
            [
                "ID",
                "Client",
                "Address",
                "Project",
                "PONumber",
                "InvoiceDate",
                "DueDate",
                "Status",
                "Subtotal",
                "Tax",
                "Discount",
                "Total",
            ],
            ...invoiceHistory.map((inv) => [
                inv.id,
                inv.clientName,
                inv.clientAddress,
                inv.projectName,
                inv.poNumber,
                inv.invoiceDate,
                inv.dueDate,
                inv.status,
                inv.subtotal,
                inv.taxAmount,
                inv.discountAmount,
                inv.total,
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`)
                    .join(",")
            )
            .join("\n");

        downloadBlob(csv, "text/csv;charset=utf-8;", "invoice-history.csv");
    };

    const exportExcel = () => {
        const tsv = [
            "ID\tClient\tAddress\tProject\tPONumber\tInvoiceDate\tDueDate\tStatus\tSubtotal\tTax\tDiscount\tTotal",
            ...invoiceHistory.map(
                (inv) =>
                    `${inv.id}\t${inv.clientName}\t${inv.clientAddress || ""}\t${inv.projectName}\t${inv.poNumber || ""}\t${inv.invoiceDate || ""}\t${inv.dueDate}\t${inv.status}\t${inv.subtotal}\t${inv.taxAmount}\t${inv.discountAmount}\t${inv.total}`
            ),
        ].join("\n");

        downloadBlob(tsv, "application/vnd.ms-excel", "invoice-history.xls");
    };

    const togglePaid = (invoice) => {
        const updated = { ...invoice, status: invoice.status === "paid" ? "unpaid" : "paid" };
        const next = upsertInvoice(updated);
        setInvoiceHistory(next);
    };

    const removeHistory = (invoiceId) => {
        const next = deleteInvoice(invoiceId);
        setInvoiceHistory(next);
    };

    const downloadHistoryInvoice = (invoice) => {
        const doc = renderPdf(invoice);
        doc.save(`invoice-${invoice.id}.pdf`);
    };

    return (
        <section className="workspace-grid">
            <article className="invoice-card">
                <div className="toolbar">
                    <h2>{labels.detailsTitle}</h2>
                    <div className="toolbar-actions">
                        <div className="lang-switch" role="group" aria-label="Language">
                            <button
                                type="button"
                                className={language === "en" ? "secondary active" : "secondary"}
                                onClick={() => setLanguage("en")}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                className={language === "id" ? "secondary active" : "secondary"}
                                onClick={() => setLanguage("id")}
                            >
                                ID
                            </button>
                        </div>
                        <a
                            href="https://ko-fi.com/febrecco"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-link secondary"
                        >
                            ☕ Ko-fi
                        </a>
                    </div>
                </div>

                <div className="grid two-col">
                    <label>
                        {labels.client}
                        <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    </label>

                    <label>
                        {labels.address}
                        <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                    </label>

                    <label>
                        {labels.project}
                        <input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </label>

                    <label>
                        {labels.poNumber}
                        <input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder={labels.optional} />
                    </label>

                    <label>
                        {labels.invoiceDate}
                        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                    </label>

                    <label>
                        {labels.dueDate}
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </label>

                    <label>
                        {labels.status}
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="unpaid">{labels.unpaid}</option>
                            <option value="paid">{labels.paid}</option>
                        </select>
                    </label>

                    <label>
                        {labels.template}
                        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
                            {TEMPLATE_OPTIONS.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        {labels.font}
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                            {FONT_OPTIONS.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        {labels.themeColor}
                        <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                    </label>

                    <label>
                        {labels.tax}
                        <input
                            type="number"
                            min="0"
                            value={taxPercent}
                            onChange={(e) => setTaxPercent(e.target.value)}
                        />
                    </label>

                    <label>
                        {labels.discount}
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                            placeholder={labels.optional}
                        />
                    </label>
                </div>

                <label>
                    {labels.uploadLogo}
                    <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, setLogoDataUrl)} />
                </label>

                <div className="grid two-col">
                    <label>
                        {labels.footerTerms}
                        <input value={footerTerms} onChange={(e) => setFooterTerms(e.target.value)} />
                    </label>

                    <label>
                        {labels.footerNotes}
                        <input value={footerNotes} onChange={(e) => setFooterNotes(e.target.value)} />
                    </label>
                </div>

                <div className="items-header">
                    <h3>{labels.itemList}</h3>
                    <button type="button" className="secondary" onClick={addItem}>
                        {labels.addItem}
                    </button>
                </div>

                <div className="items-list">
                    {items.map((item, index) => (
                        <InvoiceItem
                            key={item.id}
                            item={item}
                            index={index}
                            onChange={updateItem}
                            onRemove={removeItem}
                        />
                    ))}
                </div>

                <div className="summary">
                    <p>{labels.subtotal}: {toCurrency(subtotal)}</p>
                    <p>{labels.tax.replace(" (%)", "")} {safeTaxPercent}%: {toCurrency(taxAmount)}</p>
                    {hasDiscount ? <p>{labels.discountLabel}: {toCurrency(discountAmount)}</p> : null}
                    <p className="strong">{labels.total}: {toCurrency(total)}</p>
                </div>

                <div className="actions">
                    <button type="button" className="primary" onClick={generateClientPdf}>
                        {labels.downloadPdf}
                    </button>
                    <button type="button" className="secondary" onClick={generateServerPdf} disabled={isServerGenerating}>
                        {isServerGenerating ? labels.processing : labels.downloadApi}
                    </button>
                    <button type="button" className="secondary" onClick={exportCsv}>
                        Export CSV
                    </button>
                    <button type="button" className="secondary" onClick={exportExcel}>
                        Export Excel
                    </button>
                </div>

                <section className="history-block">
                    <h3>{labels.history}</h3>
                    {invoiceHistory.length === 0 ? (
                        <p className="muted">{labels.emptyHistory}</p>
                    ) : (
                        <div className="history-list">
                            {invoiceHistory.slice(0, 6).map((invoice) => (
                                <div className="history-item" key={invoice.id}>
                                    <p>
                                        <strong>{labels.documentTitle}</strong> | <strong>{invoice.clientName || labels.metaClient}</strong> - {invoice.projectName || labels.metaProject}
                                    </p>
                                    <p>
                                        {statusLabel(invoice.status, language)} | {labels.metaPo}: {invoice.poNumber || "-"} | {toCurrency(invoice.total)} | {formatDateByLang(invoice.invoiceDate, language)} | {formatDateByLang(invoice.dueDate, language)}
                                    </p>
                                    <div className="actions compact">
                                        <button type="button" className="secondary" onClick={() => togglePaid(invoice)}>
                                            {labels.togglePaid}
                                        </button>
                                        <button type="button" className="secondary" onClick={() => downloadHistoryInvoice(invoice)}>
                                            {labels.downloadHistoryPdf}
                                        </button>
                                        <button type="button" className="danger" onClick={() => removeHistory(invoice.id)}>
                                            {labels.delete}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </article>

            <InvoicePreview invoice={currentInvoice} />
        </section>
    );
}

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = Number.parseInt(clean, 16);

    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function downloadBlob(text, type, fileName) {
    const blob = new Blob([text], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}

function handleLogoUpload(event, setLogoDataUrl) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        setLogoDataUrl(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
}

function buildLogoDataUrl() {
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 120;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f766e";
    ctx.fillRect(0, 0, 120, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FL", 60, 63);

    return canvas.toDataURL("image/png");
}

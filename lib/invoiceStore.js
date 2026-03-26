const STORAGE_KEY = "freelancer-invoices-v1";
const AUTH_KEY = "freelancer-auth-v1";

function isBrowser() {
    return typeof window !== "undefined";
}

export function getInvoices() {
    if (!isBrowser()) return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function saveInvoices(invoices) {
    if (!isBrowser()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function upsertInvoice(invoice) {
    const all = getInvoices();
    const idx = all.findIndex((entry) => entry.id === invoice.id);

    if (idx >= 0) {
        all[idx] = invoice;
    } else {
        all.unshift(invoice);
    }

    saveInvoices(all);
    return all;
}

export function deleteInvoice(invoiceId) {
    const next = getInvoices().filter((item) => item.id !== invoiceId);
    saveInvoices(next);
    return next;
}

export function setAuth(auth) {
    if (!isBrowser()) return;
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function getAuth() {
    if (!isBrowser()) return { isLoggedIn: false, provider: "guest" };

    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return { isLoggedIn: false, provider: "guest" };

    try {
        return JSON.parse(raw);
    } catch {
        return { isLoggedIn: false, provider: "guest" };
    }
}

export function guestMonthlyCount(invoices) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return invoices.filter((inv) => {
        if (inv.createdBy !== "guest") return false;
        const createdAt = new Date(inv.createdAt);
        return createdAt.getMonth() === month && createdAt.getFullYear() === year;
    }).length;
}

export function makeInvoiceId() {
    return `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

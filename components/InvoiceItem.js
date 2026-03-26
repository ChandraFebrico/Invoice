export default function InvoiceItem({ item, index, onChange, onRemove }) {
    return (
        <div className="item-row">
            <input
                value={item.description}
                onChange={(e) => onChange(index, "description", e.target.value)}
                placeholder="Deskripsi item"
            />
            <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) => onChange(index, "quantity", e.target.value)}
                placeholder="Qty"
            />
            <input
                type="number"
                min="0"
                value={item.rate}
                onChange={(e) => onChange(index, "rate", e.target.value)}
                placeholder="Rate"
            />
            <button type="button" className="danger" onClick={() => onRemove(index)}>
                Hapus
            </button>
        </div>
    );
}

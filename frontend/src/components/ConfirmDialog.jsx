export default function ConfirmDialog({ message, detail, confirmLabel = "Confirmar", danger = false, onConfirm, onCancel }) {
  return (
    <div className="dv-modal-overlay" onClick={onCancel}>
      <div className="dv-modal" onClick={(e) => e.stopPropagation()}>
        <p className="dv-modal__title">{message}</p>
        {detail && <p className="dv-modal__detail">{detail}</p>}
        <div className="dv-modal__actions">
          <button type="button" className="dv-btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className={danger ? "dv-btn-danger" : "dv-btn-cyan"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

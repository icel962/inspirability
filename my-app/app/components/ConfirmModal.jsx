"use client";

import { useState, useEffect } from "react";

export default function ConfirmModal() {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const handler = (e) => setModal(e.detail);
    window.addEventListener("show-confirm", handler);
    return () => window.removeEventListener("show-confirm", handler);
  }, []);

  if (!modal) return null;

  const handleConfirm = () => {
    modal.onConfirm();
    setModal(null);
  };

  return (
    <div className="confirm-overlay" onClick={() => setModal(null)}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-glow">
          <div className="confirm-icon">!</div>
        </div>
        <h3 className="confirm-title">Confirm Action</h3>
        <p className="confirm-message">{modal.message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={() => setModal(null)}>
            Cancel
          </button>
          <button className="confirm-ok" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

const DEFAULTS = {
  success: { icon: "✓", label: "OK",    title: "Done" },
  error:   { icon: "✗", label: "Close", title: "Something Went Wrong" },
  info:    { icon: "ℹ", label: "Got it", title: "Heads Up" },
  warning: { icon: "!", label: "OK",    title: "Please Check" },
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type = "info", title = null } = e.detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div
      className="notif-overlay"
      onClick={() => dismiss(toasts[0].id)}
      aria-live="assertive"
    >
      {toasts.slice(0, 1).map((t) => {
        const cfg = DEFAULTS[t.type] ?? DEFAULTS.info;
        const displayTitle = t.title || cfg.title;
        return (
          <div
            key={t.id}
            className={`notif-card notif-${t.type}`}
            role="alertdialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notif-glow">
              <span className="notif-icon">{cfg.icon}</span>
            </div>
            <h3 className="notif-title">{displayTitle}</h3>
            <p className="notif-message">{t.message}</p>
            <button className="notif-btn" onClick={() => dismiss(t.id)}>
              {cfg.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import "./chatbot.css";

const CHATBOT_ID = "2dRMzNFoNgVR-2T_slFVQ";
const ACCEPTED   = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp";

function fileIcon(mime = "") {
  if (mime.includes("pdf"))   return "📄";
  if (mime.includes("image")) return "🖼️";
  return "📝";
}

function fileSize(bytes) {
  if (!bytes)          return "";
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function ChatBot() {
  const [open,       setOpen]       = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAttachment({ name: f.name, type: f.type, size: f.size });
    e.target.value = "";
  };

  return (
    <>
      {/* ── Floating toggle ───────────────────────────────────────── */}
      <button
        className={`chat-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* ── Panel ────────────────────────────────────────────────── */}
      {open && (
        <div className="chat-container">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__left">
              <span className="chat-header__dot" />
              <span>Inspirability AI</span>
            </div>

            <div className="chat-header__actions">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileRef}
                accept={ACCEPTED}
                style={{ display: "none" }}
                onChange={handleFile}
              />
              {/* Attach button */}
              <button
                className={`chat-attach-btn ${attachment ? "has-file" : ""}`}
                onClick={() => fileRef.current?.click()}
                aria-label="Attach document"
                title="Attach PDF, DOC, or image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.34a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>

              {/* Close */}
              <button
                className="chat-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >✕</button>
            </div>
          </div>

          {/* Pending attachment strip — visible until user removes it */}
          {attachment && (
            <div className="attachment-strip">
              <span className="attachment-strip__icon">
                {fileIcon(attachment.type)}
              </span>
              <div className="attachment-strip__info">
                <span className="attachment-strip__name">{attachment.name}</span>
                <span className="attachment-strip__meta">
                  {attachment.name.split(".").pop()?.toUpperCase()} · {fileSize(attachment.size)}
                </span>
              </div>
              <span className="attachment-strip__badge">Attached ✓</span>
              <button
                className="attachment-strip__remove"
                onClick={() => setAttachment(null)}
                aria-label="Remove attachment"
              >✕</button>
            </div>
          )}

          {/* Chatbase chat embedded directly — no redirect, no second window */}
          <iframe
            src={`https://www.chatbase.co/chatbot-iframe/${CHATBOT_ID}`}
            className="chat-iframe"
            title="Inspirability AI"
            allow="microphone"
            frameBorder="0"
          />
        </div>
      )}
    </>
  );
}

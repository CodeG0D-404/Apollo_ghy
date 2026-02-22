import { useState } from "react";
import "./CSS/FloatingChat.css";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="floating-chat">
      {open && (
        <div className="chat-panel">
          <a
            href="https://wa.me/919XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-option whatsapp"
          >
            WhatsApp Chat
          </a>
        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
    </div>
  );
}

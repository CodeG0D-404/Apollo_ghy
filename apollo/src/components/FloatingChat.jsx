import "./CSS/FloatingChat.css";

export default function FloatingChat() {
  return (
    <div className="floating-chat">
      
      {/* Desktop Version */}
      <a
        href="https://wa.me/918134095156"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-desktop"
      >
        <span className="wa-icon">🟢</span>
        WhatsApp Us
      </a>

      {/* Mobile Version */}
      <a
        href="https://wa.me/918134095156"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-mobile"
      >
        💬
      </a>

    </div>
  );
}
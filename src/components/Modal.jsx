// src/components/Modal.jsx
import React, { useEffect } from "react";

export default function Modal({ children, onClose, maxWidth = "max-w-3xl" }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-lg w-full ${maxWidth} z-10`}>
        {children}
      </div>
    </div>
  );
}

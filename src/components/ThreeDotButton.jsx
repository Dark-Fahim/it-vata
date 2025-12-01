// src/components/ThreeDotButton.jsx
import React, { useRef } from "react";
import { MoreVertical } from "lucide-react";

/**
 * Simple button that exposes its DOM node via onOpen(btnEl)
 */
export default function ThreeDotButton({ onOpen, className = "" }) {
  const ref = useRef(null);
  function handleClick(e) {
    e.stopPropagation();
    onOpen && onOpen(ref.current);
  }
  return (
    <button ref={ref} onClick={handleClick} className={`three-dot-btn px-2 py-1 border rounded bg-white ${className}`}>
      <MoreVertical size={16} />
    </button>
  );
}

// src/components/PortalMenu.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * PortalMenu renders children into document.body with fixed positioning near anchorRect.
 * Props:
 *  - open (bool)
 *  - anchorRect ({left, top, width, height})
 *  - onClose ()
 *  - children
 */
export default function PortalMenu({ open, anchorRect, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    function onScroll() { onClose(); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onClose);
    };
  }, [open, onClose]);

  if (!open || !anchorRect) return null;

  const menuWidth = 220;
  const gap = 8;
  const preferredLeft = anchorRect.left + anchorRect.width - menuWidth;
  const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, preferredLeft));
  const belowTop = anchorRect.top + anchorRect.height + gap;
  const enoughBelow = (belowTop + 220) < window.innerHeight;
  const top = enoughBelow ? belowTop : Math.max(8, anchorRect.top - 220 - gap);

  const menuStyle = {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    width: `${menuWidth}px`,
    zIndex: 9999,
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const menu = (
    <div style={menuStyle}>
      <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
        {children}
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}

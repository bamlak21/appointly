"use client";

import { ReactNode, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [closing, setClosing] = useState(false);

  const handleAnimationEnd = () => {
    if (closing) {
      onClose();
      setClosing(false);
    }
  };

  if (!isOpen && !closing) return null;

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4" onClick={onClose}>
        <div
          className={`will-change-transform will-change-opacity ${
            closing ? "animate-modal-close" : "animate-modal-open"
          }`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={handleAnimationEnd}
        >
          {children}
        </div>
      </div>
    </>
  );
}
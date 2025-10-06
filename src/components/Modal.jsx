import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/*
  Focus Mode Modal
  - Fullscreen, semi-transparent overlay
  - Centers enlarged chart/content
  - Closes on backdrop click, ESC key, or close button
  - Tailwind-only styling; animations via utility classes and inline keyframes
*/
const Modal = ({ title, isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4 sm:p-6 animate-fade-in"
      onMouseDown={onBackdropClick}
      aria-modal
      role="dialog"
    >
      <div className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700 transform animate-scale-in">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            aria-label="Close"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto p-4">
          {/* Children should handle their own responsive sizing; typically a chart */}
          {children}
        </div>
      </div>

      {/* Inline keyframes for small, dependency-free animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-in { from { transform: scale(.98); opacity: .9 } to { transform: scale(1); opacity: 1 } }
        .animate-fade-in { animation: fade-in .18s ease-out both }
        .animate-scale-in { animation: scale-in .22s ease-out both }
      `}</style>
    </div>
  );
};

export default Modal;

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const ImageModal = ({ src, alt, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px) scale(${
        1 - Math.abs(deltaY) / 1000
      })`;
      modalRef.current.style.opacity = `${1 - Math.abs(deltaY) / 400}`;
    }
  };

  const handleTouchEnd = () => {
    const deltaY = currentYRef.current - startYRef.current;
    if (Math.abs(deltaY) > 100) {
      handleClose();
    } else {
      // Resetar posição se não passou do limite
      if (modalRef.current) {
        modalRef.current.style.transition = "transform 0.2s, opacity 0.2s";
        modalRef.current.style.transform = "translateY(0) scale(1)";
        modalRef.current.style.opacity = "1";
        setTimeout(() => {
          if (modalRef.current) modalRef.current.style.transition = "";
        }, 200);
      }
    }
  };

  if (!src) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`relative max-w-full max-h-full p-4 transition-transform duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-full hover:bg-black/70"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;

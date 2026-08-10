import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
};

/**
 * Shared modal shell. Handles the backdrop, escape-to-close, entrance
 * animation, and scroll locking so individual modals only need to supply
 * their header/body/footer content.
 */
function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  headerAction,
  children,
  footer,
  bodyClassName = "",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex max-h-[88vh] w-full flex-col overflow-hidden rounded-modal border border-line-strong bg-surface shadow-modal",
              SIZES[size]
            )}
          >
            {(title || onClose) && (
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-7">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-xl font-semibold text-ink">
                      {title}
                    </h2>
                  )}
                  {description && <p className="mt-1 text-sm text-ink-faint">{description}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {headerAction}
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close dialog"
                      className="rounded-control p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={cn("overflow-y-auto px-6 py-6 sm:px-7", bodyClassName)}>{children}</div>

            {footer && (
              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line px-6 py-5 sm:px-7">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;

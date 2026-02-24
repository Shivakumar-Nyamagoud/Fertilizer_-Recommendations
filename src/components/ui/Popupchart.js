"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MiniGauge from "./MiniGauge";

/* keyboard-accessible TriggerWrapper (declared outside component render) */
export function TriggerWrapper({ onClick, children, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-block cursor-pointer bg-transparent border-0 p-0"
    >
      {children}
    </button>
  );
}

/**
 * Pie3DPopupAnimated
 *
 * Props:
 *  - val (number) current value
 *  - maxVal (number) maximum value (default 100)
 *  - trigger (ReactNode) optional trigger node (child of TriggerWrapper)
 *  - title (string) modal title
 *  - className (string) wrapper className
 *  - gaugeSize (number) size of the big gauge inside modal (default 140)
 *  - onOpen (fn) optional callback when opened (receives no args or label if you pass one)
 *  - onClose (fn) optional callback when closed
 *  - closeOnBackdropClick (bool) default true
 */
export default function Pie3DPopupAnimated({
  val,
  maxVal = 100,
  trigger = null,
  title = "Level",
  className = "",
  gaugeSize = 140,
  onOpen,
  onClose,
  closeOnBackdropClick = true,
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  // sanitize numbers
  const safeMax = useMemo(() => Math.max(1, Number(maxVal) || 100), [maxVal]);
  const safeVal = useMemo(() => {
    const n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(n, safeMax));
  }, [val, safeMax]);

  const percent = useMemo(() => (safeVal / safeMax) * 100, [safeVal, safeMax]);

  // open modal: save focus, prevent scroll, call onOpen
  const openModal = useCallback(() => {
    setClosing(false);
    setOpen(true);
    previouslyFocused.current =
      typeof document !== "undefined" ? document.activeElement : null;
    if (typeof document !== "undefined")
      document.documentElement.style.overflow = "hidden";
    if (typeof onOpen === "function") {
      try {
        onOpen();
      } catch (e) {
        // ignore user callback errors
      }
    }
  }, [onOpen]);

  // close modal: animate out then unmount, restore focus and scroll, call onClose
  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      if (typeof document !== "undefined")
        document.documentElement.style.overflow = "";
      // restore focus
      try {
        if (previouslyFocused.current && previouslyFocused.current.focus)
          previouslyFocused.current.focus();
      } catch (e) {}
      if (typeof onClose === "function") {
        try {
          onClose();
        } catch (e) {}
      }
    }, 320); // matches css duration
  }, [onClose]);

  // handle ESC and tab (focus trap) while modal open
  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        // focus trap
        const root = modalRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const isShift = e.shiftKey;
        if (isShift && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!isShift && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    // focus first focusable inside modal (or modal itself)
    requestAnimationFrame(() => {
      const root = modalRef.current;
      if (root) {
        const focusable = root.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length) focusable[0].focus();
        else root.focus();
      }
    });

    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  // backdrop click handler
  const onBackdropClick = useCallback(
    (e) => {
      if (!closeOnBackdropClick) return;
      // only close if clicking the backdrop (not the modal)
      if (e.target === e.currentTarget) closeModal();
    },
    [closeOnBackdropClick, closeModal],
  );

  const headerRight = `${safeVal}/${safeMax}`;

  return (
    <div className={className}>
      {trigger ? (
        <TriggerWrapper onClick={openModal} ariaLabel={`${title} details`}>
          {trigger}
        </TriggerWrapper>
      ) : (
        <button
          onClick={openModal}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white shadow-md hover:scale-[1.01] transition-transform"
          type="button"
          aria-label={`Open ${title} details`}
        >
          Open
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 "
          role="presentation"
          onClick={onBackdropClick}
          aria-hidden={false}
        >
          {/* backdrop */}
          <div
            aria-hidden="true"
            className={
              "absolute inset-0 bg-black/30 backdrop-blur-sm " +
              (closing
                ? "opacity-0 transition-opacity duration-300"
                : "opacity-100 transition-opacity duration-300")
            }
          />

          {/* Modal card */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={
              "relative w-[94%] max-w-3xl mx-auto rounded-2xl bg-white/95 shadow-2xl ring-1 ring-green-900/8 overflow-hidden transform-gpu " +
              (closing
                ? "translate-y-6 opacity-0 scale-95 transition-all duration-300 ease-in-out"
                : "translate-y-0 opacity-100 scale-100 transition-all duration-320 ease-out")
            }
            style={{ willChange: "transform, opacity" }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-green-50 ">
              <div className="flex items-center gap-3 ">
                <div className="w-3 h-3 rounded-full bg-green-900 shadow-inner" />
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">{headerRight}</div>
                <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="px-3 py-1 rounded bg-gradient-to-r from-green-950 to-green-700  cursor-pointer"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* body */}
            <div className="px-6 py-8 flex flex-col md:flex-row items-center gap-6 ">
              <div className="flex-0 flex items-center justify-center w-full md:w-1/3">
                {/* bigger gauge inside popup */}
                <div className="p-2 rounded-lg bg-white/60 shadow-inner">
                  <MiniGauge value={safeVal} max={safeMax} size={gaugeSize} />
                </div>
              </div>

              <div className="flex-1 w-full ">
                <div className="text-3xl font-bold text-green-900">
                  {Math.round(percent)}%
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Representing <span className="font-medium">{safeVal}</span>{" "}
                  out of <span className="font-medium">{safeMax}</span> (
                  {Math.round(percent)}%).
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-50/40">
                    <div className="text-sm text-green-900 font-bold">
                      Current
                    </div>
                    <div className="text-lg text-gray-700 font-medium">
                      {safeVal}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg font-bold bg-green-50/30">
                    <div className="text-sm text text-green-900">Max</div>
                    <div className="text-lg text-gray-700 font-medium">
                      {safeMax}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-green-950 to-green-700 text-white shadow-md cursor-pointer hover:bg-green-200"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 text-xs text-gray-500 border-t border-green-50">
              Tip: use this to visualize nutrient / fertilizer fill level in an
              agricultural dashboard.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 150;

const LINKS = [
  {
    label: "LinkedIn",
    text: "linkedin.com/in/xavier-laine",
    href: "https://www.linkedin.com/in/xavier-laine-721aa9396/",
    external: true,
  },
  {
    label: "Telegram",
    text: "@volnowan",
    href: "https://t.me/volnowan",
    external: true,
  },
  {
    label: "Gmail",
    text: "demolovfennec@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=demolovfennec@gmail.com",
    external: true,
  },
];

interface ContactPopupContextValue {
  open: () => void;
}

const ContactPopupContext = createContext<ContactPopupContextValue | null>(null);

export function useContactPopup() {
  const ctx = useContext(ContactPopupContext);
  if (!ctx) throw new Error("useContactPopup must be used within ContactPopupProvider");
  return ctx;
}

export function ContactPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // document.scrollingElement is <html> in this app (standards mode), not
    // <body> — only <html> needs locking. <body> is a flex column
    // (layout.tsx: "flex flex-col"), and giving a flex container
    // overflow:hidden changes its items' auto min-size behavior, which
    // shifted the whole layout vertically when this locked body too —
    // touch only <html>. Removing the scrollbar this way widens the
    // viewport by its own width, which shifts everything right and
    // reflows any R3F scene keying off viewport dimensions (e.g. Skills'
    // scale clamp) — compensate with matching right padding on the same
    // element so the layout doesn't move at all.
    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlPaddingRight = html.style.paddingRight;
    html.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      html.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.paddingRight = previousHtmlPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <ContactPopupContext.Provider value={{ open }}>
      {children}
      {isOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={close}
          >
            <div
              className={`w-full max-w-sm rounded-[3px] border border-[#454545] bg-[#2d2d2d] shadow-2xl transition-transform duration-150 ${
                isVisible ? "scale-100" : "scale-95"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="border-b border-[#33b5e5]/50 px-5 pt-4 pb-3 text-lg font-medium tracking-wide text-[#33b5e5]">
                CONTACT
              </h3>

              <ul className="space-y-3 px-5 py-4 text-sm leading-relaxed">
                {LINKS.map((link) => (
                  <li key={link.label} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-white/60">{link.label}:</span>
                    <a
                      href={link.href}
                      className="break-all text-[#33b5e5] underline hover:text-[#5ec9f0]"
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center border-t border-white/10 px-2 py-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded px-3 py-2 text-sm font-medium uppercase tracking-wide text-white hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </ContactPopupContext.Provider>
  );
}

import { useEffect, useId, useRef } from "react";
import { RosterSidebar } from "@/components/RosterSidebar";

interface RosterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function RosterDrawer({ open, onClose }: RosterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Close roster"
        className="pointer-events-auto absolute inset-0 z-0 bg-black/65 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="pointer-events-auto relative z-10 flex h-full w-full max-w-full flex-col outline-none animate-slide-in-right sm:max-w-[380px]"
      >
        <div className="glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-white/15 sm:rounded-l-2xl sm:border-y sm:border-l">
          <RosterSidebar
            className="min-h-0 flex-1"
            titleId={titleId}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

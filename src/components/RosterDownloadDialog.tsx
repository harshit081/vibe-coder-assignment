import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { SelectedProfile } from "@/types";
import { CloseIcon } from "@/components/RosterIcons";
import {
  downloadRosterJson,
  downloadRosterText,
} from "@/utils/rosterExport";

interface RosterDownloadDialogProps {
  open: boolean;
  profiles: SelectedProfile[];
  onClose: () => void;
}

export function RosterDownloadDialog({
  open,
  profiles,
  onClose,
}: RosterDownloadDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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

  const handleTextDownload = () => {
    downloadRosterText(profiles);
    onClose();
  };

  const handleJsonDownload = () => {
    downloadRosterJson(profiles);
    onClose();
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close download options"
        className="pointer-events-auto absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="pointer-events-auto relative z-10 w-full max-w-md outline-none animate-fade-in"
      >
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <h2 id={titleId} className="font-display text-lg font-bold text-white">
                Download roster
              </h2>
              <p className="mt-1 text-sm text-white/55">
                {profiles.length} creator{profiles.length === 1 ? "" : "s"} in
                your shortlist
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 bg-zinc-950 p-5">
            <button
              type="button"
              onClick={handleTextDownload}
              className="flex w-full flex-col items-start rounded-2xl border border-white/15 bg-zinc-900 px-4 py-3.5 text-left transition-colors hover:border-pink-400/30 hover:bg-zinc-900/90"
            >
              <span className="text-sm font-semibold text-white">Text summary</span>
              <span className="mt-1 text-xs leading-relaxed text-white/55">
                Rank, display name, username, and platform only
              </span>
            </button>

            <button
              type="button"
              onClick={handleJsonDownload}
              className="flex w-full flex-col items-start rounded-2xl border border-white/15 bg-zinc-900 px-4 py-3.5 text-left transition-colors hover:border-pink-400/30 hover:bg-zinc-900/90"
            >
              <span className="text-sm font-semibold text-white">Complete JSON</span>
              <span className="mt-1 text-xs leading-relaxed text-white/55">
                Full roster data including profile fields and timestamps
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

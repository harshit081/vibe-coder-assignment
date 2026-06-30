import { useEffect } from "react";
import { RosterSidebar } from "@/components/RosterSidebar";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { PinIcon } from "@/components/RosterIcons";

interface RosterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function RosterDrawer({ open, onClose }: RosterDrawerProps) {
  const setPinned = useRosterUiStore((state) => state.setPinned);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handlePin = () => {
    setPinned(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close roster"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[420px] h-full shadow-2xl animate-slide-in-right flex flex-col">
        <RosterSidebar
          className="flex-1 min-h-0 bg-[#0c0c13] border-l border-white/10 pb-20"
          onClose={onClose}
          showPinToggle
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0c0c13]/95 backdrop-blur-xl">
          <button
            type="button"
            onClick={handlePin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-500 text-sm font-semibold text-white hover:bg-pink-400 transition-colors shadow-lg shadow-pink-500/20"
          >
            <PinIcon className="w-4 h-4" />
            Keep roster visible
          </button>
        </div>
      </div>
    </div>
  );
}

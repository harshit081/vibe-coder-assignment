import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SelectedListPanel } from "@/components/SelectedListPanel";
import { useSelectedListCount } from "@/store/selectedListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const selectedCount = useSelectedListCount();

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <header className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <Link
              to="/"
              className="font-display text-xl sm:text-2xl font-bold text-white hover:text-white/80 transition-colors"
            >
              Influencer<span className="text-pink-500">Search</span>
            </Link>
            {title && (
              <h1 className="text-lg sm:text-xl text-zinc-400 mt-1 font-body font-medium">
                {title}
              </h1>
            )}
          </div>
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {selectedCount} in roster
            </div>
          )}
        </header>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <main className="flex-1 min-w-0 w-full">{children}</main>
          <aside className="w-full xl:w-[340px] shrink-0 xl:sticky xl:top-6">
            <SelectedListPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}

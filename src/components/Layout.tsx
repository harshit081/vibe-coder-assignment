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
    <div className="p-4 min-h-screen max-w-7xl mx-auto">
      <header className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          {selectedCount > 0 && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        {title && <h1 className="text-2xl mt-2">{title}</h1>}
      </header>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <main className="flex-1 min-w-0 w-full">{children}</main>
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-4">
          <SelectedListPanel />
        </aside>
      </div>
    </div>
  );
}

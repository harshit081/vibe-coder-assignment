import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage }))
);
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((m) => ({
    default: m.ProfileDetailPage,
  }))
);

function RouteFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-zinc-950">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-pink-500/25 border-t-pink-400" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

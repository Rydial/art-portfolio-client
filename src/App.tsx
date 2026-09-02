import {LayoutGroup} from "motion/react";
import {Route, Routes, useLocation} from "react-router-dom";

import {NavChrome} from "./components/NavChrome/NavChrome";
import {HomePage} from "./pages/Home/HomePage";

export function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isGallery = location.pathname === "/gallery";

  return (
    <LayoutGroup>
      <NavChrome showHome={!isHome} showDirectoryToggle={isGallery} />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </LayoutGroup>
  );
}

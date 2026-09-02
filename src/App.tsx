import {LayoutGroup} from "motion/react";
import {Route, Routes} from "react-router-dom";

import {HomePage} from "./pages/Home/HomePage";

export function App() {
  return (
    <LayoutGroup>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </LayoutGroup>
  );
}

import { HashRouter, Routes, Route } from "react-router-dom";
import MarketingLayout from "./components/MarketingLayout";
import PlatformLayout from "./components/PlatformLayout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Methodology from "./pages/Methodology";
import NotFound from "./pages/NotFound";
import Overview from "./pages/platform/Overview";
import Assessment from "./pages/platform/Assessment";
import Reports from "./pages/platform/Reports";
import Investor from "./pages/platform/Investor";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/methodology" element={<Methodology />} />
        </Route>
        <Route element={<PlatformLayout />}>
          <Route path="/platform" element={<Overview />} />
          <Route path="/platform/assessment" element={<Assessment />} />
          <Route path="/platform/investor" element={<Investor />} />
          <Route path="/platform/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

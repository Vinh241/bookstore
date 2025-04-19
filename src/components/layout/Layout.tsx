import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollToTop";
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-svh">
      <Toaster />

      <Navbar />
      <main className="flex-grow">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

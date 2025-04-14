import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ScrollToTop";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-svh">
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

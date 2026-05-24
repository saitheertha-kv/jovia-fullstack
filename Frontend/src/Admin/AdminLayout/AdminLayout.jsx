import React, { useEffect, useState } from "react";
import AdminRouter from "../../Router/AdminRouter";

import Footer from "../Components/Footer/Footer";
import Sidebar from "../Components/SideBar/Sidebar";
import Navbar from "../Components/NavBar/Navbar";

import style from "./AdminLayout.module.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  const closeSidebar = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className={style.container}>
      {/* ✅ Navbar full width */}
      <Navbar
        isMobile={isMobile}
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ✅ Sidebar under navbar */}
      <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* ✅ Main shifts when sidebar open */}
      <div
        className={style.mainContent}
        style={{
          marginLeft: !isMobile && isSidebarOpen ? "280px" : "0px",
          width: !isMobile && isSidebarOpen ? "calc(100% - 280px)" : "100%",
        }}
      >
        <div className={style.pageShell}>
          <div className={style.pageContent}>
            <AdminRouter />
          </div>
        </div>

        {/* ✅ Footer stays inside main area */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;

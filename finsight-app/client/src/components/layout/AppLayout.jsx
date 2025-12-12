// src/components/layout/AppLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-root">
      {/* LEFT SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} />

      {/* MAIN AREA */}
      <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
        <Topbar onToggleSidebar={toggleSidebar} />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
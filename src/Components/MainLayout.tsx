import React, { useState } from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('homeBtn');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const adminName = user.name || 'Unknown';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/'; // يرجع لصفحة تسجيل الدخول
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1e1e1e] text-white">
      <Header adminName={adminName} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <main className="flex-1 p-4">
          <Outlet /> {/* هون بتنعرض الصفحات الداخلية */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

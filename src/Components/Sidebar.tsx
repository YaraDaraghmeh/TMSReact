import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const tabs = [
    { id: 'homeBtn', label: 'Home' },
    { id: 'projectsBtn', label: 'Projects' },
    { id: 'tasksBtn', label: 'Tasks' },
    { id: 'chatBtn', label: 'Chat' },
  ];

  // التأكد من تعيين الـ activeTab بناءً على الصفحة الحالية
  useEffect(() => {
    const currentPage = window.location.pathname; // للحصول على المسار الحالي
    console.log('Current page path:', currentPage); // طباعة المسار للتحقق منه

    if (currentPage.includes('index.html')) {
      setActiveTab('homeBtn'); // تعيين Home كـ active عندما تكون في صفحة Dashboard
      console.log('Setting active tab to Home');
    } else if (currentPage.includes('projects')) {
      setActiveTab('projectsBtn'); // تعيين Projects كـ active عندما تكون في صفحة Projects
      console.log('Setting active tab to Projects');
    } else if (currentPage.includes('tasks')) {
      setActiveTab('tasksBtn'); // تعيين Tasks كـ active عندما تكون في صفحة Tasks
      console.log('Setting active tab to Tasks');
    } else if (currentPage.includes('chat')) {
      setActiveTab('chatBtn'); // تعيين Chat كـ active عندما تكون في صفحة Chat
      console.log('Setting active tab to Chat');
    }
  }, [setActiveTab]); // التحقق عند تحديث الـ setActiveTab أو الـ pathname

  return (
    <div>
      {/* زر الـ "Hamburger" على الشاشات الصغيرة */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-white bg-gray-800 p-2 rounded-full fixed top-4 left-4 z-50"
      >
        ☰
      </button>

      {/* الشريط الجانبي */}
      <div
        className={classNames(
          'bg-[#2d2d2d] border-r-4 border-[#333] pt-12 px-5 overflow-y-auto transition-all duration-300',
          {
            'fixed left-0 top-0 h-full w-60 z-50': isOpen, // الشريط الجانبي مفتوح على الشاشات الصغيرة
            'hidden md:block md:w-[200px] md:h-[100vh] z-40': !isOpen, // الشريط الجانبي مرئي دائمًا على الشاشات الكبيرة
          }
        )}
      >
        {/* زر إغلاق الشريط الجانبي على الشاشات الصغيرة */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full text-xl md:hidden"
        >
          ×
        </button>

        {/* روابط الشريط الجانبي */}
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={
              tab.id === 'homeBtn' ? '/dashboard' :
              tab.id === 'projectsBtn' ? '/project' :
              tab.id === 'tasksBtn' ? '/Task' :
              '/Chat'
            }
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              'w-full block text-left bg-[#3d3d3d] text-white py-2 px-3 rounded mb-2',
              {
                'bg-[#007bff]': activeTab === tab.id,
                'hover:bg-[#0056b3]': activeTab !== tab.id,
              }
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

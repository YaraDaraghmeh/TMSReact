import React, { useEffect, useState } from 'react';
import DashboardChart from '../Components/DashboardChart';
import { useQuery } from '@apollo/client';
import { DASHBOARD_COUNTS_QUERY } from '../graphql/queries';

export default function Dashboard() {
  const [user, setUser] = useState<{ username: string; name: string; role: string } | undefined>(undefined);

  const { data, loading } = useQuery(DASHBOARD_COUNTS_QUERY);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); 
    }
  }, []);

  const currentDate = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const projectsCount = data?.projectCount || 0;
  const tasksCount = data?.taskCount || 0;
  const studentsCount = data?.studentCount || 0;
  const finishedCount = data?.finishedProjectCount || 0;

  const dataReady = [projectsCount, studentsCount, tasksCount, finishedCount].every(Number.isFinite);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      {/* الشريط العلوي */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3467eb] mb-2">
            Welcome to the Task Management System
          </h1>
          {user && (
            <p className="text-white text-sm">
              Logged in as: <span className="text-green-400 font-semibold">{user.name} ({user.role})</span>
            </p>
          )}
        </div>
        <div className="text-white text-sm md:text-base">
          {currentDate}
        </div>
      </div>

      {/* صناديق الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Number of Projects" count={projectsCount} loading={loading} />
        <StatCard title="Number of Tasks" count={tasksCount} loading={loading} />
        <StatCard title="Number of Students" count={studentsCount} loading={loading} />
        <StatCard title="Number of Finished Projects" count={finishedCount} loading={loading} />
      </div>

      {/* الرسم البياني */}
      {dataReady && (
        <DashboardChart
          user={user}  // تمرير بيانات المستخدم إلى الرسم البياني
          data={[projectsCount, studentsCount, tasksCount, finishedCount]}
        />
      )}
    </div>
  );
}

function StatCard({ title, count, loading }: { title: string; count: number; loading: boolean }) {
  return (
    <div className="bg-[#252525] p-6 rounded-lg shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition">
      <div className="text-lg mb-2">{title}</div>
      <div className="text-2xl font-bold">{loading ? 'Loading...' : count}</div>
    </div>
  );
}

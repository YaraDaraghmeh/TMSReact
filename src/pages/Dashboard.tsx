import React, { useEffect, useState } from 'react';
import DashboardChart from '../Components/DashboardChart';
import { useQuery } from '@apollo/client';
import { DASHBOARD_COUNTS_QUERY, STUDENT_TASK_STATS_QUERY } from '../graphql/queries';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
const [username, setUsername] = useState("");

useEffect(() => {
  const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUsername(parsedUser.name); 
  }
}, []);
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setUserLoaded(true);
  }, []);

  const isAdmin = user?.role === "Administrator";
  const isStudent = user?.role === "Student";

  // Admin query
  const { data: adminData, loading: adminLoading } = useQuery(DASHBOARD_COUNTS_QUERY, {
    skip: !userLoaded || !isAdmin,
  });

  // Student query
  const { data: studentData, loading: studentLoading, error: studentError } = useQuery(STUDENT_TASK_STATS_QUERY, {
    variables: { studentId: user?.studentId },
    skip: !userLoaded || !isStudent || !user?.id,
  });
  useEffect(() => {
  if (userLoaded && isStudent) {
    console.log("studentId sent to GraphQL:", user?.id);
  }
}, [userLoaded, isStudent]);

  console.log("studentData:", studentData);  
console.log("studentError:", studentError); 

  const [currentDate, setCurrentDate] = useState('');
useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setCurrentDate(now);
  }, 1000); 

  return () => clearInterval(interval); 
}, []);


  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      {}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3467eb] mb-2">
            Welcome ,{username}
          </h1>
          {/* {user && (
            // <p className="text-white text-sm">
            //   Logged in as: <span className="text-green-400 font-semibold">{user.name} ({user.role})</span>
            // </p>
          )} */}
        </div>
        <div className="text-white text-sm md:text-base">{currentDate}</div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {isAdmin && adminData?.stats && (
          <>
            <StatCard 
              title="Number of Projects" 
              count={parseInt(adminData.stats.totalProjects || '0')} 
              loading={adminLoading} 
            />
            <StatCard 
              title="Number of Tasks" 
              count={parseInt(adminData.stats.totalTasks || '0')} 
              loading={adminLoading} 
            />
            <StatCard 
              title="Number of Students" 
              count={parseInt(adminData.stats.totalStudents || '0')} 
              loading={adminLoading} 
            />
            <StatCard 
              title="Number of Finished Projects" 
              count={parseInt(adminData.stats.finishedProjects || '0')} 
              loading={adminLoading} 
            />
          </>
        )}

        {isStudent && (
          <>
            {studentLoading ? (
              <>
                <StatCard title="Pending Tasks" count={0} loading={true} />
                <StatCard title="In Progress Tasks" count={0} loading={true} />
                <StatCard title="Completed Tasks" count={0} loading={true} />
                <StatCard title="Cancelled Tasks" count={0} loading={true} />

              </>
            ) : studentData?.studentTaskStats ? (
              <>
                <StatCard 
                  title="Pending Tasks" 
                  count={studentData.studentTaskStats.pending ?? 0} 
                  loading={false} 
                />
                <StatCard 
                  title="In Progress Tasks" 
                  count={studentData.studentTaskStats.inProgress ?? 0} 
                  loading={false} 
                />
                <StatCard 
                  title="Completed Tasks" 
                  count={studentData.studentTaskStats.completed ?? 0} 
                  loading={false} 
                />
                <StatCard 
                  title="Cancelled Tasks" 
                  count={studentData.studentTaskStats.Cancelled ?? 0} 
                  loading={false} 
                />
              </>
            ) : (
              <p>No task statistics found.</p>
            )}
          </>
        )}
      </div>

      {}
      {isAdmin && adminData?.stats && (
        <DashboardChart
          user={user}
          labels={['Projects', 'Students', 'Tasks', 'Finished Projects']}
          data={[
            parseInt(adminData.stats.totalProjects || '0'),
            parseInt(adminData.stats.totalStudents || '0'),
            parseInt(adminData.stats.totalTasks || '0'),
            parseInt(adminData.stats.finishedProjects || '0'),
          ]}
        />
      )}

      {isStudent && studentData?.studentTaskStats && (
  <DashboardChart
    user={user}
    labels={['Pending Tasks', 'In Progress', 'Completed', 'Cancelled']}
    data={[
      studentData.studentTaskStats.pending ?? 0,
      studentData.studentTaskStats.inProgress ?? 0,
      studentData.studentTaskStats.completed ?? 0,
      studentData.studentTaskStats.Cancelled ?? 0,
    ]}
    backgroundColor={['#eab308', '#3b82f6', '#10b981','#ef4444']} 
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

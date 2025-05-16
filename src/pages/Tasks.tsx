import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../Components/TaskForm';

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      project {
        title
      }
      name
      description
      assignedTo {
        name
      }
      status
      dueDate
    }
    projects {
      id
      title
    }
    students {
      id
      name
    }
  }
`;

const GET_STUDENT_TASKS = gql`
 query GetStudentTasks($studentId: ID!) {
  studentTasks(studentId: $studentId) {
    id
    project {
      title
    }
    name
    description
    status
    dueDate
    assignedTo {
      id
      name
    }
  }
}
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      name
      status
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      id
      status
    }
  }
`;

const Tasks: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.name);
      setUserLoaded(true);
      console.log("User data:", {
        id: parsedUser.id,
        studentId: parsedUser.studentId,
        role: parsedUser.role
      });
    }
  }, []);

  const isAdmin = user?.role === "Administrator";
  const isStudent = user?.role === "Student";
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [showForm, setShowForm] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState('Task Status');
  const [formData, setFormData] = useState({
    projectId: '',
    name: '',
    description: '',
    assignedTo: '',
    status: '',
    dueDate: ''
  });

  const {
    loading: adminLoading,
    error: adminError,
    data: adminData,
    refetch: refetchAdminTasks
  } = useQuery(GET_TASKS, {
    skip: !userLoaded || !isAdmin
  });

  const {
    loading: studentLoading,
    error: studentError,
    data: studentData,
    refetch: refetchStudentTasks
  } = useQuery(GET_STUDENT_TASKS, {
    skip: !userLoaded || !isStudent || !user?.studentId,
    variables: { studentId: user?.studentId }
  });

  const [createTask] = useMutation(CREATE_TASK);

  const navigate = useNavigate();

  const refetchTasks = async () => {
    setIsRefetching(true);
    try {
      if (isAdmin) {
        await refetchAdminTasks();
      } else if (isStudent) {
        await refetchStudentTasks();
      }
    } catch (err) {
      console.error('Error refetching data:', err);
    } finally {
      setIsRefetching(false);
    }
  };

  console.log("Tasks data:", {
    adminData,
    studentData,
    user,
    isStudent
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          input: {
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString()
          }
        }
      });
      setShowForm(false);
      setFormData({
        projectId: '',
        name: '',
        description: '',
        assignedTo: '',
        status: '',
        dueDate: ''
      });
      await refetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'in progress': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'on hold': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortTasks = (tasks: any[]) => {
    switch (sortBy) {
      case 'Task Status':
        return [...tasks].sort((a, b) => a.status.localeCompare(b.status));
      case 'Project':
        return [...tasks].sort((a, b) => a.project?.title?.localeCompare(b.project?.title || '') || 0);
      case 'Task Name':
        return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
      case 'Assigned Student':
        return [...tasks].sort((a, b) => a.assignedTo?.name?.localeCompare(b.assignedTo?.name || '') || 0);
      case 'Due Date':
        return [...tasks].sort((a, b) => {
          const dateA = a.dueDate && !isNaN(Number(a.dueDate)) ? new Date(Number(a.dueDate)) : new Date(0);
          const dateB = b.dueDate && !isNaN(Number(b.dueDate)) ? new Date(Number(b.dueDate)) : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return tasks;
    }
  };

  if (!userLoaded) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (adminError || studentError) return <div className="flex justify-center items-center h-screen">Error: {adminError?.message || studentError?.message}</div>;

  const tasks = isStudent ? studentData?.studentTasks || [] : adminData?.tasks || [];
  const sortedTasks = sortTasks(tasks);

  if (isStudent && sortedTasks.length === 0) {
    return (
      <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
        <h1 className="text-3xl font-bold text-[#3467eb] mb-8">My Tasks</h1>
        <div className="bg-[#252525] p-8 rounded-lg text-center">
          <p className="text-xl">No tasks assigned to you yet</p>
          <p className="text-gray-400 mt-2">Please check back later or contact your administrator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3467eb]">
          {isAdmin ? 'Task Management' : 'My Tasks'}
        </h1>

        <div className="flex gap-4">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
              disabled={isRefetching}
            >
              <span>Sort By: {sortBy}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {isAdmin ? (
                    ['Task Status', 'Project', 'Task Name', 'Assigned Student', 'Due Date'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === option ? 'bg-gray-700 text-blue-400' : 'text-white hover:bg-gray-700'}`}
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    ['Task Status', 'Task Name', 'Due Date'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === option ? 'bg-gray-700 text-blue-400' : 'text-white hover:bg-gray-700'}`}
                      >
                        {option}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isRefetching}
            >
              {isRefetching ? 'Loading...' : 'Create New Task'}
            </button>
          )}
        </div>
      </div>

      {isRefetching && (
        <div className="mb-4 p-2 bg-blue-900 text-blue-200 rounded text-center">
          Updating tasks...
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#252525] rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              {isAdmin && <th className="px-6 py-3 text-left">Task ID</th>}
              <th className="px-6 py-3 text-left">Project</th>
              <th className="px-6 py-3 text-left">Task Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              {isAdmin && <th className="px-6 py-3 text-left">Assigned Student</th>}
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedTasks.map((task: any) => (
              <tr key={task.id} className="hover:bg-gray-800">
                {isAdmin && <td className="px-6 py-4">{task.id.slice(-6)}</td>}
                <td className="px-6 py-4">{task.project?.title}</td>
                <td className="px-6 py-4">{task.name}</td>
                <td className="px-6 py-4">{task.description}</td>

                {isAdmin && <td className="px-6 py-4">{task.assignedTo?.name}</td>}
                <td className="px-6 py-4">
                  {(isAdmin || task.assignedTo?.id === user?.studentId) ? (
                    <>
                      {isAdmin ? (
                        <select
                          value={task.status}
                          onChange={async (e) => {
                            try {
                              await updateTaskStatus({
                                variables: {
                                  taskId: task.id,
                                  status: e.target.value
                                }
                              });
                              await refetchTasks();
                            } catch (err) {
                              console.error("Failed to update status", err);
                            }
                          }}
                          className={`bg-transparent border border-gray-600 rounded px-2 py-1 font-semibold ${getStatusClass(task.status).split(' ')[0]}`}
                        >
                          <option value={task.status} disabled className="text-black">
                            {task.status}
                          </option>
                          <option value="Cancelled" className="text-black">Cancelled</option>
                          <option value="On Hold" className="text-black">On Hold</option>
                        </select>
                      ) : (
                        !['Cancelled', 'On Hold'].includes(task.status) ? (
                          <select
                            value={task.status}
                            onChange={async (e) => {
                              try {
                                await updateTaskStatus({
                                  variables: {
                                    taskId: task.id,
                                    status: e.target.value
                                  }
                                });
                                await refetchTasks();
                              } catch (err) {
                                console.error("Failed to update status", err);
                              }
                            }}
                            className={`bg-transparent border border-gray-600 rounded px-2 py-1 font-semibold ${getStatusClass(task.status).split(' ')[0]}`}
                          >
                            {['Pending', 'In Progress', 'Completed'].map((option) => (
                              <option key={option} value={option} className="text-black">
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-block px-2 py-1 rounded font-semibold ${getStatusClass(task.status)}`}>
                            {task.status}
                          </span>
                        )
                      )}
                    </>
                  ) : (
                    <span className={`inline-block px-2 py-1 rounded font-semibold ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {task.dueDate && !isNaN(Number(task.dueDate))
                    ? new Date(Number(task.dueDate)).toLocaleDateString()
                    : 'Invalid Date'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin && showForm && (
        <TaskForm
          formData={formData}
          onChange={handleInputChange}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          projects={adminData?.projects || []}
          students={adminData?.students || []}
          isSubmitting={isRefetching}
        />
      )}
    </div>
  );
};

export default Tasks;
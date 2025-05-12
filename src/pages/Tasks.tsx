// src/pages/Tasks.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

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

const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      name
      status
    }
  }
`;

const Tasks: React.FC = () => {
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
  
  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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
      refetch();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-blue-500';
      case 'in progress': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'on hold': return 'text-orange-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  const sortedTasks = data?.tasks ? sortTasks(data.tasks) : [];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-950 min-h-screen text-white">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <span>Sort By: {sortBy}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {['Task Status', 'Project', 'Task Name', 'Assigned Student', 'Due Date'].map((option) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create New Task
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">Task ID</th>
              <th className="px-6 py-3 text-left">Project</th>
              <th className="px-6 py-3 text-left">Task Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Assigned Student</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedTasks.map((task: any) => (
              <tr key={task.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">{task.id.slice(-6)}</td>
                <td className="px-6 py-4">{task.project?.title}</td>
                <td className="px-6 py-4">{task.name}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">{task.assignedTo?.name}</td>
                <td className={`px-6 py-4 ${getStatusClass(task.status)}`}>{task.status}</td>
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

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400">Create New Task</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Project Title:</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                >
                  <option value="" disabled>Select a Project</option>
                  {data?.projects?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Task Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block mb-2">Assigned Student:</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                >
                  <option value="" disabled>Select a Student</option>
                  {data?.students?.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                >
                  <option value="" disabled>Select Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
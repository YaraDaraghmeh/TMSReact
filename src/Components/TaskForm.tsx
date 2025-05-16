import React, { useState, useEffect } from 'react';

interface TaskFormProps {
  formData: {
    projectId: string;
    name: string;
    description: string;
    assignedTo: string;
    status: string;
    dueDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  students: { id: string; name: string }[];
  projects: { id: string; title: string }[];
  isSubmitting: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  onChange,
  onClose,
  onSubmit,
  students,
  projects,
  isSubmitting
}) => {
  const [dateError, setDateError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to today (format: YYYY-MM-DD)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    if (selectedDate < today) {
      setDateError('Due date cannot be in the past');
    } else {
      setDateError(null);
    }
    onChange(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError('Due date cannot be in the past');
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Create New Task</h2>
          <button 
            onClick={onClose}
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
              onChange={onChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="" disabled>Select a Project</option>
              {projects.map(project => (
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
              onChange={onChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block mb-2">Assigned Student:</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={onChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            >
              <option value="" disabled>Select a Student</option>
              {students.map(student => (
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
              onChange={onChange}
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
              onChange={handleDateChange}
              min={minDate}
              className={`w-full p-2 rounded bg-gray-700 border ${dateError ? 'border-red-500' : 'border-gray-600'}`}
              required
            />
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || !!dateError}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
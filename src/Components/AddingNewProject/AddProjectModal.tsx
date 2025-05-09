import React, { useState } from 'react';

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: '',
    status: '',
    startDate: '',
    dueDate: '',
    students: ''
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const studentsArray = project.students
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProject = {
      ...project,
      id: Date.now(),
      students: studentsArray,
      progress:
        project.status === 'Completed'
          ? 100
          : project.status === 'In Progress'
          ? 50
          : 0,
      endDate: project.dueDate
    };

    onAdd(newProject);
    setProject({
      title: '',
      description: '',
      category: '',
      status: '',
      startDate: '',
      dueDate: '',
      students: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
      <div className="bg-[#222] w-full max-w-[600px] rounded-[5px] p-[30px] relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-[20px] right-[20px] bg-none border-none text-white text-[1.5rem] cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-[#4080ff] mb-[20px] text-[1.8rem]">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Project Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-[12px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem]"
              value={project.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Description</label>
            <textarea
              name="description"
              className="w-full p-[12px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem] min-h-[120px] resize-y"
              value={project.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Category</label>
            <input
              type="text"
              name="category"
              className="w-full p-[12px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem]"
              value={project.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Status</label>
            <select
              name="status"
              className="w-full p-[12px] pr-[36px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem] appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
              value={project.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="w-full p-[12px] pr-[36px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
              value={project.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="w-full p-[12px] pr-[36px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
              value={project.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px] max-h-[150px] overflow-y-auto">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Students (one per line)</label>
            <textarea
              name="students"
              className="w-full p-[12px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem] min-h-[120px] resize-y"
              value={project.students}
              onChange={handleChange}
              placeholder="e.g. John Doe&#10;Jane Smith"
            />
          </div>

          <div className="mt-[30px]">
            <button
              type="submit"
              className="w-full p-[12px] text-[1.1rem] font-medium bg-[#5cb85c] text-white border-none rounded-[5px] cursor-pointer transition-colors hover:bg-[#4a994a]"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;

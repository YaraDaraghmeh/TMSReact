import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

// GraphQL query to fetch all students
const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    allStudents {
      id
      name
    }
  }
`;

type Student = {
  id: string;
  name: string;
};

type ProjectState = {
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  selectedStudents: Student[];
};

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: any) => void;
};

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [project, setProject] = useState<ProjectState>({
    title: '',
    description: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
    selectedStudents: []
  });

  // Fetch students using GraphQL
  const { loading, error, data } = useQuery(GET_ALL_STUDENTS);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (data && data.allStudents) {
      setAvailableStudents(data.allStudents);
    }
  }, [data]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => ({
      id: option.value,
      name: option.label
    }));
    setProject({ ...project, selectedStudents: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      students: project.selectedStudents.map(student => student.id),
      progress:
        project.status === 'Completed'
          ? 100
          : project.status === 'In Progress'
          ? 50
          : 0
    };

    onAdd(newProject);
    setProject({
      title: '',
      description: '',
      category: '',
      status: '',
      startDate: '',
      endDate: '',
      selectedStudents: []
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
            <label className="block mb-[8px] text-[1.1rem] font-bold">End Date</label>
            <input
              type="date"
              name="endDate"
              className="w-full p-[12px] pr-[36px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
              value={project.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-[20px]">
            <label className="block mb-[8px] text-[1.1rem] font-bold">Students</label>
            {loading ? (
              <p className="text-[#ccc]">Loading students...</p>
            ) : error ? (
              <p className="text-red-500">Error loading students: {error.message}</p>
            ) : (
              <select
                multiple
                name="students"
                className="w-full p-[12px] bg-[#333] border border-[#666] rounded-[5px] text-white text-[1rem] min-h-[120px]"
                onChange={handleStudentSelect}
                value={project.selectedStudents.map(student => student.id)}
              >
                {availableStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-[#aaa] text-[0.9rem] mt-[5px]">Hold Ctrl/Cmd to select multiple students</p>
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
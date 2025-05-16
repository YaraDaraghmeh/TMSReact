import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import ProjectCard from '../Components/ProjectCard/ProjectCard';
import AddProjectModal from '../Components/AddingNewProject/AddProjectModal';
import ProjectDetailPopup from '../Components/ProjectCard/ProjectDetailPopup';

const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      title
      description
      progress
      status
      startDate
      endDate
      tasks {
        id
        name
        status
        dueDate
      }
    }
  }
`;

 const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      title
      description
      progress
      status
      startDate
      endDate
      students {
        id
        name
      }
    }
  }
`;

const ProjectsOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);
  const [createProject] = useMutation(CREATE_PROJECT);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const closePopup = () => {
    setSelectedProject(null);
  };

  const handleAddProjectClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddProject = async (newProject: any) => {
    try {
      await createProject({
        variables: {
          input: {
            title: newProject.title,
            description: newProject.description,
            category: newProject.category,
            progress: newProject.progress,
            status: newProject.status,
            startDate: newProject.startDate,
            endDate: newProject.endDate,
            students: newProject.students, // array of student IDs
          }
        }
      });
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const getProjectStatus = (project: any) => {
    if (project.progress === 100) return 'Completed';
    if (project.progress > 0) return 'In Progress';
    return 'Not Started';
  };

  const projects = data?.allProjects || [];

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const projectStatus = project.status || getProjectStatus(project);
    const matchesStatus =
      statusFilter === 'All Statuses' || projectStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-white p-5">Loading...</div>;
  if (error) return <div className="text-red-500 p-5">Error: {error.message}</div>;

  return (
    <div className="bg-[#212121] text-white p-5 min-h-screen font-sans">
      <h1 className="text-[#0099ff] text-2xl mb-5">Projects Overview</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <button
          onClick={handleAddProjectClick}
          className="bg-[#0099ff] py-2 px-4 rounded font-bold"
        >
          Add New Project
        </button>

        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 p-2 rounded text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-2 rounded text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))
        ) : (
          <p className="italic text-[#ccc]">No projects match your filters.</p>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailPopup project={selectedProject} onClose={closePopup} />
      )}

      <AddProjectModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddProject}
      />
    </div>
  );
};

export default ProjectsOverview;

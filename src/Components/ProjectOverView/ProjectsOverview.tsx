import React, { useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import { projectsData } from '../../Data/projectsData';
import AddProjectModal from '../AddingNewProject/AddProjectModal';
import ProjectDetailPopup from '../ProjectCard/ProjectDetailPopup';

const ProjectsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
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

  const handleAddProject = (newProject) => {
    console.log('New project added:', newProject);
    handleCloseModal();
  };

  const getProjectStatus = (project) => {
    if (project.progress === 100) return 'Completed';
    if (project.progress > 0) return 'In Progress';
    return 'Not Started';
  };

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const projectStatus = project.status || getProjectStatus(project);
    const matchesStatus =
      statusFilter === 'All Statuses' || projectStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#212121] text-white p-5 min-h-screen font-sans">
      <h1 className="text-[#0099ff] text-2xl mb-5">Projects Overview</h1>

      <div className="flex flex-col md:flex-row gap-[15px] mb-5">
        <button
          className="bg-[#0099ff] text-white border-none py-[10px] px-[15px] rounded-[5px] cursor-pointer font-bold"
          onClick={handleAddProjectClick}
        >
          Add New Project
        </button>

        <input
          type="text"
          placeholder="Search projects by title or description..."
          className="flex-1 p-[10px] rounded-[5px] border-none text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-[10px] rounded-[5px] border-none text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Not Started</option>
        </select>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-[20px]">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))
        ) : (
          <p className="text-[#ccc] italic">No projects match your filters.</p>
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

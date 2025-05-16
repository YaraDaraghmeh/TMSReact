import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS_BY_STUDENT_ID, GET_STUDENT_BY_ID } from '../graphql/projectQueries';
import ProjectCard from '../Components/ProjectCard/ProjectCard';
import ProjectDetailPopup from '../Components/ProjectCard/ProjectDetailPopup';

const StudentProjects = ({ studentId }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  
  const { loading: studentLoading, error: studentError, data: studentData } = useQuery(
    GET_STUDENT_BY_ID,
    { variables: { id: studentId } }
  );

  const { loading: projectsLoading, error: projectsError, data: projectsData } = useQuery(
    GET_PROJECTS_BY_STUDENT_ID,
    { variables: { studentId } }
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closePopup = () => {
    setSelectedProject(null);
  };

  // Loading states
  if (studentLoading || projectsLoading) {
    return <div className="text-white p-5">Loading...</div>;
  }

  // Error states
  if (studentError) {
    return <div className="text-red-500 p-5">Error loading student: {studentError.message}</div>;
  }
  
  if (projectsError) {
    return <div className="text-red-500 p-5">Error loading projects: {projectsError.message}</div>;
  }

  // Get student data
  const student = studentData.studentById;
  const projects = projectsData.projectsByStudentId;

  return (
    <div className="bg-[#212121] text-white p-5 min-h-screen font-sans">
      <h1 className="text-[#0099ff] text-2xl mb-5">Projects for {student.name}</h1>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      ) : (
        <p className="italic text-[#ccc]">No projects assigned to this student.</p>
      )}

      {selectedProject && (
        <ProjectDetailPopup project={selectedProject} onClose={closePopup} />
      )}
    </div>
  );
};

export default StudentProjects;

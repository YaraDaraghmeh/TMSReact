import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ProjectCard from '../Components/ProjectCard/ProjectCard';
import AddProjectModal from '../Components/AddingNewProject/AddProjectModal';
import ProjectDetailPopup from '../Components/ProjectCard/ProjectDetailPopup';
import { GET_PROJECTS, GET_PROJECTS_BY_STUDENT_ID, GET_ALL_STUDENTS, CREATE_PROJECT } from '../graphql/projectQueries';

const ProjectsOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // جلب بيانات المستخدم الحالي
  const currentUserString = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

  // تحقق من نوع المستخدم
  const isAdmin = currentUser?.role?.toLowerCase() === 'administrator';
  const isStudent = currentUser?.role?.toLowerCase() === 'student';

  // جلب كل الطلاب إذا كان المستخدم طالب
  const { data: studentsData, loading: studentsLoading } = useQuery(GET_ALL_STUDENTS, {
    skip: !isStudent,
  });

  // استخراج id الطالب من اسمه (أو username)
  let studentId = null;
  if (isStudent && studentsData?.allStudents) {
    const found = studentsData.allStudents.find(
      (s) => s.name === currentUser.name // أو استخدم username إذا كان عندك
    );
    studentId = found?.id || null;
  }

  // اختر الكويري والمتغيرات حسب نوع المستخدم
  const PROJECTS_QUERY = isAdmin
    ? GET_PROJECTS
    : GET_PROJECTS_BY_STUDENT_ID;

  const queryVariables = isAdmin
    ? {}
    : { studentId };

  // جلب المشاريع
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: queryVariables,
    skip: isStudent && !studentId, // لا تنفذ الكويري حتى تحصل على id الطالب
    fetchPolicy: 'cache-and-network',
  });

  const [createProject] = useMutation(CREATE_PROJECT);

  if (!currentUser) {
    return <div className="text-red-500 p-5">Please log in to view your projects.</div>;
  }

  // تجهيز قائمة المشاريع حسب نوع المستخدم
  const projects = isAdmin
    ? data?.allProjects || []
    : data?.projectsByStudentId || [];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const projectStatus = project.status || (project.progress === 100 ? 'Completed' : project.progress > 0 ? 'In Progress' : 'Not Started');
    const matchesStatus =
      statusFilter === 'All Statuses' || projectStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading || (isStudent && studentsLoading)) return <div className="text-white p-5">Loading...</div>;
  if (error) return <div className="text-red-500 p-5">Error: {error.message}</div>;

  const handleProjectClick = (project) => setSelectedProject(project);
  const closePopup = () => setSelectedProject(null);
  const handleAddProjectClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddProject = async (newProject) => {
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
            students: newProject.students,
          }
        }
      });
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  return (
    <div className="bg-[#212121] text-white p-5 min-h-screen font-sans">
      <h1 className="text-[#0099ff] text-2xl mb-5">
        {isAdmin ? 'Projects Overview' : 'My Assigned Projects'}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-5">
        {isAdmin && (
          <button
            onClick={handleAddProjectClick}
            className="bg-[#0099ff] py-2 px-4 rounded font-bold"
          >
            Add New Project
          </button>
        )}

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
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))
        ) : (
          <p className="italic text-[#ccc]">
            {isAdmin ? 'No projects match your filters.' : 'You have no assigned projects.'}
          </p>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailPopup project={selectedProject} onClose={closePopup} />
      )}

      {isAdmin && (
        <AddProjectModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onAdd={handleAddProject}
        />
      )}
    </div>
  );
};

export default ProjectsOverview;
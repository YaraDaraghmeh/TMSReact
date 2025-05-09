import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 cursor-pointer transition-all duration-200 hover:border-[#5D5CDE] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
      onClick={() => onClick(project)}
    >
      <h2 className="text-[#5D5CDE] text-[1.25rem] font-semibold mb-3">
        {project.title}
      </h2>

      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Description:</span> {project.description}
      </div>

      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Students:</span> {project.students.join(', ')}
      </div>

      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Category:</span> {project.category}
      </div>

      <div className="mt-4">
        <div className="w-full h-[10px] bg-[#333] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3b82f6] rounded-full"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-1 text-[#888] text-[0.8rem]">
          <span>{project.startDate}</span>
          <span>{project.endDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

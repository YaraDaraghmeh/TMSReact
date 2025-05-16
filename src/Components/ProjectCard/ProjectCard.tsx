import React from 'react';

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Check if the timestamp is a number (unix timestamp)
  if (!isNaN(Number(timestamp))) {
    return new Date(Number(timestamp)).toLocaleDateString();
  }
  // Try to parse ISO string
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }
  return timestamp;
};

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      className="bg-[#1e1e1e] border border-[#333] rounded-lg p-5 cursor-pointer transition-all duration-200 hover:border-[#5D5CDE] hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
      onClick={() => onClick(project)}
    >
      <h2 className="text-[#5D5CDE] text-[1.25rem] font-semibold mb-3">
        {project.title}
      </h2>

      {/* Description */}
      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Description:</span>{' '}
        {project.description || 'No description provided.'}
      </div>

      {/* Status */}
      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Status:</span>{' '}
        {project.status || 'N/A'}
      </div>

      {/* Category */}
      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Category:</span>{' '}
        {project.category || 'N/A'}
      </div>

      {/* Students */}
      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Students:</span>{' '}
        {Array.isArray(project.students) && project.students.length > 0
          ? project.students.map((s) => s.name).join(', ')
          : 'No students assigned'}
      </div>

      {/* Dates */}
      <div className="text-[#e0e0e0] mb-2 text-[0.9rem]">
        <span className="font-semibold">Start:</span>{' '}
        {formatDate(project.startDate)}{' '}
        <span className="font-semibold ml-2">End:</span>{' '}
        {formatDate(project.endDate)}
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="w-full h-[10px] bg-[#333] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3b82f6] rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-[#888] text-[0.8rem]">
          <span>{project.progress || 0}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

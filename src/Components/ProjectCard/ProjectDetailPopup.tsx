import React from 'react';

const ProjectDetailPopup = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-[#181818] z-[1000] shadow-[5px_0_15px_rgba(0,0,0,0.3)] overflow-y-auto text-white p-0 border-r border-[#333]">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[#4ecdc4] text-[24px] font-bold m-0">{project.title}</h2>
          <button
            className="bg-none border-none text-[#aaa] text-[28px] cursor-pointer p-0 w-[28px] h-[28px] flex items-center justify-center hover:text-white transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mb-[25px]">
          <div className="mb-2 text-sm leading-[1.5]">
            <span className="font-bold">Description:</span> {project.description}
          </div>
          <div className="mb-2 text-sm leading-[1.5]">
            <span className="font-bold">Category:</span> {project.category}
          </div>
          <div className="mb-2 text-sm leading-[1.5]">
            <span className="font-bold">Students:</span> {project.students.join(', ')}
          </div>
          <div className="mb-2 text-sm leading-[1.5]">
            <span className="font-bold">Start Date:</span> {project.startDate}
          </div>
          <div className="mb-2 text-sm leading-[1.5]">
            <span className="font-bold">End Date:</span> {project.endDate}
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-[#4ecdc4] text-[20px] mb-[15px]">Tasks</h3>

          {project.tasks && project.tasks.length > 0 ? (
            <div className="flex flex-col gap-[15px]">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#222] rounded-[4px] p-[15px] border border-[#333]"
                >
                  <div className="mb-2 text-sm">
                    <span className="font-bold">Task ID:</span> {task.id}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="font-bold">Task Name:</span> {task.name}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="font-bold">Description:</span> {task.description}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="font-bold">Assigned Student:</span>{' '}
                    {task.assignedStudent}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="font-bold">Status:</span>{' '}
                    <span
                      className={`ml-[5px] font-normal ${
                        task.status === 'Completed'
                          ? 'text-[#4CAF50]'
                          : 'text-[#FFC107]'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#888] italic">No tasks for this project.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPopup;

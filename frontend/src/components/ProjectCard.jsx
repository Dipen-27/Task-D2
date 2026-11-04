
function ProjectCard({ project }) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-[1200px]">
      <img
        src={project.image}
        alt={project.name}
        className="w-full md:w-1/2 rounded-lg mr-0 md:mr-4 object-contain"
      />
      <div className="flex flex-col justify-center">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-600">{project.description}</p>
      </div>
    </div>
  );
}

export default ProjectCard;

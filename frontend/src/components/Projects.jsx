import projects from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

function Projects() {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-2xl font-bold text-center mb-8">
        Here's what I've done so far
      </h2>

      <div className="flex flex-col items-center gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;

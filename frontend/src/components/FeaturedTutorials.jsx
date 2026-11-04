import tutorials from "../data/tutorials.js";
import Card from "./Card.jsx";

function FeaturedTutorials() {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Tutorials</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 max-w-6xl mx-auto">
        {tutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            image={tutorial.image}
            name={tutorial.name}
            description={tutorial.description}
            rating={tutorial.rating}
            person={tutorial.username}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-full">
          See all tutorials
        </button>
      </div>
    </section>
  );
}

export default FeaturedTutorials;

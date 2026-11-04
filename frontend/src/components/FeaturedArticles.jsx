import articles from "../data/articles.js";
import Card from "./Card.jsx";

function FeaturedArticles() {
  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 max-w-6xl mx-auto">
        {articles.map((article) => (
          <Card
            key={article.id}
            image={article.image}
            name={article.name}
            description={article.description}
            rating={article.rating}
            person={article.author}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-full">
          See all articles
        </button>
      </div>
    </section>
  );
}

export default FeaturedArticles;

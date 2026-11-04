import { Star } from "lucide-react";


function Card({ image, name, description, rating, person }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-full">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-fill rounded-md mb-3"
      />
      <h3 className="font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <hr className="border-gray-200 mb-2" />
      <div className="flex items-center gap-1 text-sm text-gray-700">
        <Star size={16} className="fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating}</span>
        <span className="ml-2">{person}</span>
      </div>
    </div>
  );
}

export default Card;

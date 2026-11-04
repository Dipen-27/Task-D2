
const photos = [
  { id: 1, src: "/pics_for_website/himmelstraeume-flower-7543035.jpg", alt: "Photo 1" },
  { id: 2, src: "/pics_for_website/trondmyhre4-water-6579313.jpg", alt: "Photo 2" },
  { id: 3, src: "/pics_for_website/vladimir163rus-railway-2818748_1920.jpg", alt: "Photo 3" },
  { id: 4, src: "/pics_for_website/janvanbizar-glacier-7187291.jpg", alt: "Photo 4" },
  { id: 5, src: "/pics_for_website/blackout_photography-fichtelbergbahn-8049565.jpg", alt: "Photo 5" },
];

function Gallery() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">My Photos</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-8">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            className="rounded-lg shadow-md w-full h-56 object-cover"
          />
        ))}
      </div>
    </section>
  );
}

export default Gallery;

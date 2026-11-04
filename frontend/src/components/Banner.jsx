function Banner() {
  return (
    <header className="relative group">
      <img
        src="/pics_for_website/Deakin_College.jpg"
        alt="Banner"
        className="w-full h-[600px] object-cover"
      />
      <div className="absolute bottom-4 left-0 w-full bg-black bg-opacity-70 text-white text-center px-6 py-4 rounded-lg hidden group-hover:block">
        Hey, I'm Dipen
      </div>
    </header>
  );
}

export default Banner;

function About() {
  return (
    <section className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">About Me</h2>

      <div className="flex flex-col items-center">
        <img
          src="/pics_for_website/jcx516-rose-5201410.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
        />
        <p className="mt-4 text-lg">I am a full-stack web developer.</p>
      </div>
    </section>
  );
}

export default About;

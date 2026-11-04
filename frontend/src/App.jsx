import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Banner from "./components/Banner.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Gallery from "./components/Gallery.jsx";
import FeaturedArticles from "./components/FeaturedArticles.jsx";
import FeaturedTutorials from "./components/FeaturedTutorials.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Post from "./pages/Post.jsx";
import Pricing from "./pages/Pricing.jsx";
import BrowsePosts from "./pages/BrowsePosts.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Home() {
  return (
    <>
      <Banner />
      <About />
      <Projects />
      <Gallery />
      <FeaturedArticles />
      <FeaturedTutorials />
    </>
  );
}

function App() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <Navbar />

      <main className="flex flex-1 flex-col w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/browse-posts" element={<BrowsePosts />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import GitHubActivity from "@/components/GitHubActivity";
import BlogPosts from "@/components/BlogPosts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen outline-none">
      <Hero />
      <FeaturedProjects />
      <About />
      <Skills />
      <ExperienceTimeline />
      <GitHubActivity />
      <BlogPosts />
      <Contact />
      <Footer />
    </main>
  );
}

import Hero from "@/components/Hero";
import FeaturedJobs from "@/components/FeaturedJobs";
import Features from "@/components/Features";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-black">
        <Hero />
        <FeaturedJobs />
        <Features />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}

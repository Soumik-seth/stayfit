import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import WhyChoose from "@/components/WhyChoose";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <FeatureHighlights />

        <WhyChoose />

        <Reviews />
      </main>

      <Footer />
    </>
  );
}
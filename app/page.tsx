import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import WhySection from '@/components/WhySection';
import PreviewGallery from '@/components/PreviewGallery';
import Roadmap from '@/components/Roadmap';
import FounderSection from '@/components/FounderSection';
import Footer from '@/components/Footer';

export default async function Page() {
  return (
    <>
      <Nav />
      <main id="home">
        <Hero />
        <StatsBar />
        <WhySection />
        <PreviewGallery />
        <Roadmap />
        <FounderSection />
      </main>
      <Footer />
    </>
  );
}

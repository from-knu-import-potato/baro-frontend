import FeatureSection from '@/features/landing/components/FeatureSection';
import Footer from '@/features/landing/components/Footer';
import HeroSection from '@/features/landing/components/HeroSection';
import Navbar from '@/features/landing/components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        {/* Additional sections like Analytics or Testimonials can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

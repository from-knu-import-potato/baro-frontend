import CTASection from '@/features/landing/components/CTASection';
import FeatureSection from '@/features/landing/components/FeatureSection';
import Footer from '@/features/landing/components/Footer';
import HeroSection from '@/features/landing/components/HeroSection';
import HowItWorksSection from '@/features/landing/components/HowItWorksSection';
import Navbar from '@/features/landing/components/Navbar';
import ProblemSection from '@/features/landing/components/ProblemSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeatureSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

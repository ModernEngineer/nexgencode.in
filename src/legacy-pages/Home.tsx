import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import ServicesGrid from '../components/sections/ServicesGrid';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Process from '../components/sections/Process';
import TechStack from '../components/sections/TechStack';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import Testimonials from '../components/sections/Testimonials';
import CTASection from '../components/sections/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesGrid />
      <WhyChooseUs />
      <Process />
      <TechStack />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}

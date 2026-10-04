import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import ServicesGrid from '../components/sections/ServicesGrid';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import Process from '../components/sections/Process';
import TechStack from '../components/sections/TechStack';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import Testimonials from '../components/sections/Testimonials';
import CTASection from '../components/sections/CTASection';
import { useSeo } from '../hooks/useSeo';

export default function Home() {
  useSeo();

  return (
    <>
      <Hero />
      <Stats />
      <ServicesGrid />
      <TechStack />
      <WhyChooseUs />
      <Process />
      <FeaturedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}

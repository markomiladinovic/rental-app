import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Pricing from "@/components/home/Pricing";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Pricing />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  );
}

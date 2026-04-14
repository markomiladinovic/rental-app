import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Pricing from "@/components/home/Pricing";
import GallerySection from "@/components/home/GallerySection";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import TestimonialForm from "@/components/home/TestimonialForm";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Pricing />
      <GallerySection />
      <HowItWorks />
      <Testimonials />
      <TestimonialForm />
      <CTASection />
    </>
  );
}

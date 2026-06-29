import Hero from "@/components/Hero";
import FastSellingProperties from "@/components/FastSellingProperties";
import Categories from "@/components/Categories";
import UpcomingProjects from "@/components/UpcomingProjects";
import Localities from "@/components/Localities";
import WhyChooseUs from "@/components/WhyChooseUs";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <FastSellingProperties />
      <Categories />
      <UpcomingProjects />
      <Localities />
      <WhyChooseUs />
      <Partners />
      <Testimonials />
      <FAQ />
    </>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FastSellingProperties from "@/components/FastSellingProperties";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <FastSellingProperties />
      </main>
      <Footer />
    </>
  );
}

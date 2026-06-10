import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HajjBanner from "@/components/HajjBanner";
import Destinations from "@/components/Destinations";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header/>
      <Hero />
      <Services />
      <Destinations />
      <HajjBanner />
    </>
  );
}
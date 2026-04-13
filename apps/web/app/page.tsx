import { AboutSection } from "@/components/home/about-section";
import { DetectionModesSection } from "@/components/home/detection-modes-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { SupportedModesSection } from "@/components/home/supported-modes-section";
import { WhyMultimodalSection } from "@/components/home/why-multimodal-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DetectionModesSection />
      <HowItWorksSection />
      <WhyMultimodalSection />
      <SupportedModesSection />
      <AboutSection />
    </>
  );
}

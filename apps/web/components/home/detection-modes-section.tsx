import { Container } from "../layout/container";
import { DetectionModeGrid } from "../detection/detection-mode-grid";
import { MotionReveal } from "../ui/motion-reveal";
import { SectionHeading } from "../ui/section-heading";

export function DetectionModesSection() {
  return (
    <section id="modes" className="section-divider py-20 sm:py-24">
      <Container className="space-y-12">
        <MotionReveal>
          <SectionHeading
            eyebrow="Detection Modes"
            title="Choose the kind of field evidence you have."
            description="BirdLens is structured around two distinct entry points so the experience stays focused, elegant, and intuitive from the first interaction."
          />
        </MotionReveal>
        <DetectionModeGrid />
      </Container>
    </section>
  );
}

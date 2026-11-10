import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BenefitsSection } from "@/components/landing/benefits";
import { CtaSection } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { LocationsSection } from "@/components/landing/locations";
import { ProgrammesSection } from "@/components/landing/programmes";
import { TestimonialsSection } from "@/components/landing/testimonials";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProgrammesSection />
        <LocationsSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

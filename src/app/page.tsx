import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import AnchorScroll from "@/components/AnchorScroll";
import Reveals from "@/components/Reveals";
import SmoothScroll from "@/components/SmoothScroll";

import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Work from "@/components/sections/Work";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

import { SERVICES, CONTACT_EMAIL, WHATSAPP } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "NEXERA",
  description:
    "Modern digital agency for web development, e-commerce, AI automation, marketing and branding.",
  email: CONTACT_EMAIL,
  telephone: WHATSAPP.display.replace(/\s/g, ""),
  url: "https://nexera.agency",
  areaServed: "Worldwide",
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.tagline },
  })),
};

export default function Page() {
  return (
    <>
      {/*
        Everything position:fixed must sit OUTSIDE <SmoothScroll>: the smoother
        transforms its content wrapper, and a transformed ancestor makes
        `position: fixed` resolve against it instead of the viewport.
      */}
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <AnchorScroll />
      <Reveals />

      <SmoothScroll>
        <main id="main">
          <Hero />
          <Ticker />
          <Manifesto />
          <Work />
          <Process />
          <Services />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

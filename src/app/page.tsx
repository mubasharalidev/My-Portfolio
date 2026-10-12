import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Expertise } from "@/components/sections/Expertise";
import { Work } from "@/components/sections/Work";
import { Engine } from "@/components/sections/Engine";
import { Experience } from "@/components/sections/Experience";
import { Lab } from "@/components/sections/Lab";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <Expertise />
      <Work />
      <Engine />
      <Experience />
      <Lab />
      <About />
      <Contact />
    </main>
  );
}

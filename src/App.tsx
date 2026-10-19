import { MotionConfig } from 'motion/react';
import About from './components/sections/About';
import Divisions from './components/sections/Divisions';
import Footer from './components/sections/Footer';
import Hero from './components/sections/Hero';
import Join from './components/sections/Join';
import Projects from './components/sections/Projects';
import VectorBand from './components/sections/VectorBand';

/** Section order from SPEC §0.5: Hero → About → Divisions → band → Projects → Contact → Footer. */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero />
        <About />
        <Divisions />
        <VectorBand />
        <Projects />
        <Join />
      </main>
      <Footer />
    </MotionConfig>
  );
}

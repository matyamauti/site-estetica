import { useLayoutEffect } from 'react';

import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';

import { initMotion } from './lib/motion';

import Header from './components/Header';
import Trilho from './components/Trilho';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import About from './components/About';
import Treatments from './components/Treatments';
import FeaturedTreatment from './components/FeaturedTreatment';
import Results from './components/Results';
import Experience from './components/Experience';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Location from './components/Location';
import Footer from './components/Footer';

export default function App() {
  /* useLayoutEffect, não useEffect: roda antes da primeira pintura.
     É o que deixa o CSS esconder os elementos animáveis sem que eles
     apareçam por um quadro e depois sumam. */
  useLayoutEffect(() => initMotion(), []);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <Header />
      <Trilho />

      <main id="conteudo">
        <Hero />
        <Manifesto />
        <About />
        <Treatments />
        <FeaturedTreatment />
        <Results />
        <Experience />
        <Stats />
        <Testimonials />
        <CTA />
        <Location />
      </main>

      <Footer />
    </>
  );
}

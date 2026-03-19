import { Hero } from '../components/landing/Hero';
import { BrowseAlternatives } from '../components/landing/BrowseAlternatives';
import { Footer } from '../components/landing/Footer';
import { Container, Spacer } from '../components/shared';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Container>
        <Spacer />
        <BrowseAlternatives />
        <Spacer />
        <Footer />
      </Container>
    </>
  );
}
import { Hero } from '../components/landing/Hero';
import { RecentUpdates } from '../components/landing/RecentUpdates';
import { BrowseAlternatives } from '../components/landing/BrowseAlternatives';
import { Footer } from '../components/landing/Footer';
import { Container, Spacer } from '../components/shared';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Container>
        <Spacer />
        <RecentUpdates />
        <BrowseAlternatives />
        <Spacer />
        <Footer />
      </Container>
    </>
  );
}
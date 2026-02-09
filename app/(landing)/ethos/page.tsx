import { Metadata } from 'next';
import { EthosPage } from '@/features/public-site/screens'

export const metadata: Metadata = {
  title: 'Our Ethos',
  description: 'The mission and story behind Opensource.Builders - helping you find and build open source alternatives.',
};

export default function About() {
  return <EthosPage />
}
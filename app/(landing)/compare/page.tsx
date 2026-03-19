import { Metadata } from 'next';
import { ComparisonPageClient } from '@/features/public-site/screens/ComparisonPage';

export const metadata: Metadata = {
  title: 'Compare Applications',
  description: 'Compare features and capabilities between applications.',
};

export default function ComparePage() {
  return <ComparisonPageClient />;
}

import PublicLayout from '@/features/public-site/layouts/public-layout';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  );
}
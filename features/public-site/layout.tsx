import { PublicSiteProvider } from './lib/provider';

interface PublicSiteLayoutProps {
  children: React.ReactNode;
}

export function PublicSiteLayout({ children }: PublicSiteLayoutProps) {
  return (
    <PublicSiteProvider>
      {children}
    </PublicSiteProvider>
  );
}
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/ui/navbar";
import { getAppsData } from "@/actions/getAppsData";
import { CapabilitiesProvider } from "@/hooks/use-capabilities-config";
import { PublicSiteLayout } from '../layout';
import Footer from "@/features/public-site/components/landing/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const appsResponse = await getAppsData();
  const apps = appsResponse.success ? appsResponse.data : [];

  return (
    <PublicSiteLayout>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CapabilitiesProvider>
          <div className="bg-gradient-to-b from-muted/40 to-background">
            {/* Full-width glassy navbar */}
            <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <Navbar apps={apps} />
              </div>
            </div>
            {children}
            <Footer />
          </div>
        </CapabilitiesProvider>
      </ThemeProvider>
    </PublicSiteLayout>
  );
}
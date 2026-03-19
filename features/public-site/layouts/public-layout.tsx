import { ThemeProvider } from "next-themes";
import { CapabilitiesProvider } from "@/hooks/use-capabilities-config";
import { PublicSiteLayout } from '../layout';
import Link from "next/link";
import { Header } from "@/components/header";
import { GlobalDataTableDrawer } from "@/components/GlobalDataTableDrawer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <PublicSiteLayout>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CapabilitiesProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <GlobalDataTableDrawer />
          </div>
        </CapabilitiesProvider>
      </ThemeProvider>
    </PublicSiteLayout>
  );
}
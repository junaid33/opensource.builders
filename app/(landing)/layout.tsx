import Navbar from "@/components/ui/navbar";
import { ThemeProvider } from "next-themes";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
          <Navbar />
        </div>
        {children}
      </div>
    </ThemeProvider>
  );
}
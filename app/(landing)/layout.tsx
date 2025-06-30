import Navbar from "@/components/ui/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Navbar />
      </div>
      {children}
    </>
  );
}
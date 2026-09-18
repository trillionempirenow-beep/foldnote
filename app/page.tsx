import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { UseCases } from "@/components/landing/UseCases";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="paper-texture flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductPreview />
        <FeatureCards />
        <UseCases />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

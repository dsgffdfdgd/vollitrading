import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />

        {/* Risk Disclaimer Section */}
        <section id="risk" className="py-12 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Risk Warning</h3>
            <p className="max-w-4xl mx-auto text-sm text-gray-500 leading-relaxed">
              Trading Forex and CFDs involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. Trading products may not be suitable for everyone. Before trading, please take into consideration your level of experience, investment objectives, and seek independent financial advice if necessary. VOLLIFX does not guarantee profits and past performance is not indicative of future results.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

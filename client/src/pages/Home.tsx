import { Link } from "wouter";
import FormsList from "@/components/FormsList";
import HowItWorks from "@/components/HowItWorks";
import TutorialsList from "@/components/TutorialsList";
import NewsList from "@/components/NewsList";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Compila i tuoi moduli fiscali online</h1>
            <p className="text-lg mb-8">Compila moduli F24 ordinario, F24 semplificato, F24 accise, F24 elide e F23 direttamente online e scaricali in PDF.</p>
            <div className="inline-flex flex-wrap justify-center gap-4">
              <Link href="/moduli" className="bg-black text-white px-6 py-3 rounded shadow hover:bg-gray-900 transition-colors">
                Inizia ora
              </Link>
              <Link href="/tutorial" className="border border-black px-6 py-3 rounded shadow hover:bg-gray-100 transition-colors">
                Guida ai moduli
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Forms List */}
      <FormsList />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Tutorials */}
      <TutorialsList limit={3} />
      
      {/* News */}
      <NewsList limit={3} />
      
      {/* FAQ */}
      <FAQSection />
    </>
  );
}

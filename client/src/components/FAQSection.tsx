import { useState } from "react";
import { Helmet } from "react-helmet";

const faqs = [
  {
    id: 1,
    question: "Come posso pagare un F24 dopo averlo compilato?",
    answer: "Dopo aver compilato e scaricato il modello F24, puoi pagarlo presso qualsiasi sportello bancario, ufficio postale o tramite i servizi di home banking della tua banca. Ricorda di conservare la ricevuta di pagamento."
  },
  {
    id: 2,
    question: "I moduli compilati su questo sito sono validi per la presentazione?",
    answer: "Sì, i moduli generati dal nostro sistema sono conformi ai requisiti ufficiali dell'Agenzia delle Entrate e possono essere utilizzati per la presentazione e il pagamento. Il PDF generato mantiene esattamente il formato ufficiale richiesto."
  },
  {
    id: 3,
    question: "È possibile salvare i dati inseriti per un utilizzo futuro?",
    answer: "Sì, il nostro sistema permette di salvare i moduli compilati sul tuo dispositivo. I dati vengono memorizzati localmente e non vengono condivisi con i nostri server, garantendo così la massima privacy. Potrai accedere ai tuoi moduli salvati in qualsiasi momento."
  }
];

export default function FAQSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  
  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">Domande Frequenti</h2>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <h3 className="font-bold">{faq.question}</h3>
                <span className="material-icons">
                  {openFaqId === faq.id ? "remove" : "add"}
                </span>
              </button>
              <div className={`px-4 pb-4 ${openFaqId === faq.id ? "block" : "hidden"}`}>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

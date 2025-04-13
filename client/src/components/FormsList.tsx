import { Link } from "wouter";

interface FormData {
  id: string;
  title: string;
  description: string;
  imagePlaceholder: string;
  type: string;
}

const formsList: FormData[] = [
  {
    id: "f24-ordinario",
    title: "F24 Ordinario",
    description: "Modello per il pagamento di tributi, imposte, tasse e contributi.",
    imagePlaceholder: "Anteprima F24 Ordinario",
    type: "f24-ordinario"
  },
  {
    id: "f24-semplificato",
    title: "F24 Semplificato",
    description: "Versione semplificata del modello F24 per specifici pagamenti.",
    imagePlaceholder: "Anteprima F24 Semplificato",
    type: "f24-semplificato"
  },
  {
    id: "f24-accise",
    title: "F24 Accise",
    description: "Modello per il pagamento di accise e imposte di consumo.",
    imagePlaceholder: "Anteprima F24 Accise",
    type: "f24-accise"
  },
  {
    id: "f24-elide",
    title: "F24 Elide",
    description: "Modello per il pagamento di imposte su locazioni e registrazioni.",
    imagePlaceholder: "Anteprima F24 Elide",
    type: "f24-elide"
  },
  {
    id: "f23",
    title: "F23",
    description: "Modello per il pagamento di tasse, imposte e sanzioni.",
    imagePlaceholder: "Anteprima F23",
    type: "f23"
  }
];

export default function FormsList() {
  return (
    <section id="moduli" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center">Scegli il modulo da compilare</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formsList.map((form) => (
            <div key={form.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-gray-200 flex items-center justify-center text-center p-4">
                  <span className="font-bold">{form.imagePlaceholder}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{form.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{form.description}</p>
                <Link href={`/moduli/${form.type}`}>
                  <a className="block w-full bg-black text-white text-center py-2 rounded hover:bg-gray-900 transition-colors">
                    Compila
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "wouter";

// Import form images
import f24OrdinarioImage from "@/assets/forms/f24-ordinario.png";
import f24SemplificatoImage from "@/assets/forms/f24-semplificato.png";
import f24AcciseImage from "@/assets/forms/f24-accise.png";
import f24ElideImage from "@/assets/forms/f24-elide.png";
import f23Image from "@/assets/forms/f23.png";

interface FormData {
  id: string;
  title: string;
  description: string;
  image: string;
  type: string;
}

const formsList: FormData[] = [
  {
    id: "f24-ordinario",
    title: "F24 Ordinario",
    description: "Modello per il pagamento di tributi, imposte, tasse e contributi.",
    image: f24OrdinarioImage,
    type: "f24-ordinario"
  },
  {
    id: "f24-semplificato",
    title: "F24 Semplificato",
    description: "Versione semplificata del modello F24 per specifici pagamenti.",
    image: f24SemplificatoImage,
    type: "f24-semplificato"
  },
  {
    id: "f24-accise",
    title: "F24 Accise",
    description: "Modello per il pagamento di accise e imposte di consumo.",
    image: f24AcciseImage,
    type: "f24-accise"
  },
  {
    id: "f24-elide",
    title: "F24 Elide",
    description: "Modello per il pagamento di imposte su locazioni e registrazioni.",
    image: f24ElideImage,
    type: "f24-elide"
  },
  {
    id: "f23",
    title: "F23",
    description: "Modello per il pagamento di tasse, imposte e sanzioni.",
    image: f23Image,
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
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={form.image} 
                  alt={`Modello ${form.title}`} 
                  className="object-contain h-full w-full p-2"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{form.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{form.description}</p>
                <Link href={`/moduli/${form.type}`}>
                  <div className="block w-full bg-black text-white text-center py-2 rounded hover:bg-gray-900 transition-colors cursor-pointer">
                    Compila
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

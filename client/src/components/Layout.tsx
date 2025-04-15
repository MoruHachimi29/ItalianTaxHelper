import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import logoPath from "@/assets/f24-logo-image.png";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white border-b border-gray-700">
        <div className="container mx-auto px-4 py-1">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <Link href="/">
                <a className="flex items-center">
                  <img src={logoPath} alt="F24Editabile" className="h-20 bg-black p-0" />
                </a>
              </Link>
              <span className="ml-2 text-sm bg-white text-black px-2 py-1 rounded">BETA</span>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location === "/" ? "font-bold text-white" : ""}`}>
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location.startsWith("/moduli") ? "font-bold text-white" : ""}`}>
                      Moduli
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/tutorial">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location === "/tutorial" ? "font-bold text-white" : ""}`}>
                      Tutorial
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/notizie">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location === "/notizie" ? "font-bold text-white" : ""}`}>
                      Notizie
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/strumenti">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location === "/strumenti" ? "font-bold text-white" : ""}`}>
                      Strumenti
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contatti">
                    <a className={`text-gray-300 hover:text-white hover:underline ${location === "/contatti" ? "font-bold text-white" : ""}`}>
                      Contatti
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">F24Editabile</h3>
              <p className="text-sm text-gray-400">Il modo più semplice per compilare moduli fiscali italiani online.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Moduli</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/moduli/f24-ordinario">
                    <a className="text-gray-400 hover:text-white">F24 Ordinario</a>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-semplificato">
                    <a className="text-gray-400 hover:text-white">F24 Semplificato</a>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-accise">
                    <a className="text-gray-400 hover:text-white">F24 Accise</a>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-elide">
                    <a className="text-gray-400 hover:text-white">F24 Elide</a>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f23">
                    <a className="text-gray-400 hover:text-white">F23</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Risorse</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/tutorial">
                    <a className="text-gray-400 hover:text-white">Tutorial</a>
                  </Link>
                </li>
                <li>
                  <Link href="/notizie">
                    <a className="text-gray-400 hover:text-white">Notizie</a>
                  </Link>
                </li>
                <li>
                  <Link href="/strumenti">
                    <a className="text-gray-400 hover:text-white">Strumenti</a>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <a className="text-gray-400 hover:text-white">FAQ</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contatti">
                    <a className="text-gray-400 hover:text-white">Contattaci</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legale</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/privacy">
                    <a className="text-gray-400 hover:text-white">Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/termini">
                    <a className="text-gray-400 hover:text-white">Termini di Servizio</a>
                  </Link>
                </li>
                <li>
                  <Link href="/cookie">
                    <a className="text-gray-400 hover:text-white">Cookie Policy</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} F24Editabile. Tutti i diritti riservati. Questo sito non è affiliato all'Agenzia delle Entrate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

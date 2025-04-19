import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import logoPath from "@/assets/f24-logo-latest.png";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-white font-sans text-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black bg-opacity-95 backdrop-blur-sm text-white border-b border-gray-700 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-row justify-between items-center">
            <Link href="/">
              <div className="flex items-center">
                <img src={logoPath} alt="F24Editabile" className="h-12 bg-black p-0" />
                <span className="ml-2 text-xs bg-white text-black px-1.5 py-0.5 rounded">BETA</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block flex-1 ml-10">
              <ul className="flex justify-around">
                <li>
                  <Link href="/">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/" ? "font-bold text-white" : ""}`}>
                      Home
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location.startsWith("/moduli") ? "font-bold text-white" : ""}`}>
                      Moduli
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/tutorial">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/tutorial" ? "font-bold text-white" : ""}`}>
                      Tutorial
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/notizie">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/notizie" ? "font-bold text-white" : ""}`}>
                      Notizie
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/blog" || location.startsWith("/blog/") ? "font-bold text-white" : ""}`}>
                      Blog
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/strumenti">
                    <div 
                      className={`text-gray-300 hover:text-white hover:underline ${location === "/strumenti" || location.startsWith("/strumenti/") ? "font-bold text-white" : ""}`}
                    >
                      Strumenti
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/contatti">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/contatti" ? "font-bold text-white" : ""}`}>
                      Contatti
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} md:hidden py-2 overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/" ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </div>
              </Link>
              <Link href="/moduli">
                <div 
                  className={`block px-3 py-2 rounded-md ${location.startsWith("/moduli") ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Moduli
                </div>
              </Link>
              <Link href="/tutorial">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/tutorial" ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tutorial
                </div>
              </Link>
              <Link href="/notizie">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/notizie" ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notizie
                </div>
              </Link>
              <Link href="/blog">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/blog" || location.startsWith("/blog/") ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </div>
              </Link>
              <Link href="/strumenti">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/strumenti" ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  Strumenti
                </div>
              </Link>
              <Link href="/contatti">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/contatti" ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contatti
                </div>
              </Link>
            </div>
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
              <div className="flex items-center mb-3">
                <img src={logoPath} alt="F24Editabile" className="h-10 bg-black p-0" />
              </div>
              <p className="text-sm text-gray-400">Il modo più semplice per compilare moduli fiscali italiani online.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Moduli</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/moduli/f24-ordinario">
                    <div className="text-gray-400 hover:text-white">F24 Ordinario</div>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-semplificato">
                    <div className="text-gray-400 hover:text-white">F24 Semplificato</div>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-accise">
                    <div className="text-gray-400 hover:text-white">F24 Accise</div>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f24-elide">
                    <div className="text-gray-400 hover:text-white">F24 Elide</div>
                  </Link>
                </li>
                <li>
                  <Link href="/moduli/f23">
                    <div className="text-gray-400 hover:text-white">F23</div>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Risorse</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/tutorial">
                    <div className="text-gray-400 hover:text-white">Tutorial</div>
                  </Link>
                </li>
                <li>
                  <Link href="/notizie">
                    <div className="text-gray-400 hover:text-white">Notizie</div>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <div className="text-gray-400 hover:text-white">Blog</div>
                  </Link>
                </li>
                <li>
                  <Link href="/strumenti">
                    <div 
                      className="text-gray-400 hover:text-white" 
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Strumenti
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <div className="text-gray-400 hover:text-white">FAQ</div>
                  </Link>
                </li>
                <li>
                  <Link href="/contatti">
                    <div className="text-gray-400 hover:text-white">Contattaci</div>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legale</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/privacy">
                    <div className="text-gray-400 hover:text-white">Privacy Policy</div>
                  </Link>
                </li>
                <li>
                  <Link href="/termini">
                    <div className="text-gray-400 hover:text-white">Termini di Servizio</div>
                  </Link>
                </li>
                <li>
                  <Link href="/cookie">
                    <div className="text-gray-400 hover:text-white">Cookie Policy</div>
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

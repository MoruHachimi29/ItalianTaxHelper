import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import logoPath from "@/assets/f24-logo-latest.png";
import { Menu, X, LogIn, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading: isAuthLoading, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
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
                  <Link href="/forum">
                    <div className={`text-gray-300 hover:text-white hover:underline ${location === "/forum" || location.startsWith("/forum/") ? "font-bold text-white" : ""}`}>
                      Forum
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

            {/* Auth buttons */}
            <div className="hidden md:flex items-center ml-4 space-x-2">
              {isAuthLoading ? (
                <div className="w-24 h-8 bg-gray-800 animate-pulse rounded"></div>
              ) : user ? (
                <div className="flex items-center">
                  <Link href="/profilo">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white flex items-center gap-1">
                      <UserCircle size={16} />
                      <span className="max-w-24 truncate">{user.username}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleLogout}>
                    Esci
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white text-black hover:bg-gray-100 border-white">
                    <LogIn size={16} />
                    Accedi
                  </Button>
                </Link>
              )}
            </div>

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

              <Link href="/forum">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/forum" || location.startsWith("/forum/") ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forum
                </div>
              </Link>
              <Link href="/strumenti">
                <div 
                  className={`block px-3 py-2 rounded-md ${location === "/strumenti" || location.startsWith("/strumenti/") ? 
                    "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
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
              
              {/* Auth buttons for mobile */}
              <div className="border-t border-gray-700 mt-4 pt-4">
                {isAuthLoading ? (
                  <div className="px-3 py-2 animate-pulse bg-gray-800 rounded"></div>
                ) : user ? (
                  <>
                    <Link href="/profilo">
                      <div 
                        className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserCircle size={18} className="mr-2" />
                        {user.username}
                      </div>
                    </Link>
                    <div 
                      className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogIn size={18} className="mr-2 rotate-180" />
                      Esci
                    </div>
                  </>
                ) : (
                  <Link href="/auth">
                    <div 
                      className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={18} className="mr-2" />
                      Accedi / Registrati
                    </div>
                  </Link>
                )}
              </div>
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
                  <Link href="/forum">
                    <div className="text-gray-400 hover:text-white">Forum</div>
                  </Link>
                </li>
                <li>
                  <Link href="/strumenti">
                    <div className="text-gray-400 hover:text-white">
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

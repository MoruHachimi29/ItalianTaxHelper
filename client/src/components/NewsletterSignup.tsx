import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulazione invio richiesta
    setTimeout(() => {
      toast({
        title: "Iscrizione completata",
        description: "Grazie per esserti iscritto alla nostra newsletter!",
      });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">Resta aggiornato sulle novità fiscali</h2>
          <p className="text-lg mb-8">Iscriviti alla nostra newsletter per ricevere aggiornamenti sulle ultime normative fiscali, scadenze e consigli utili.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <Input
              type="email"
              placeholder="Il tuo indirizzo email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white"
              required
            />
            <Button 
              type="submit" 
              className="bg-white text-black hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "Iscrizione..." : "Iscriviti"}
            </Button>
          </form>
          
          <p className="text-sm mt-4 text-gray-400">
            Iscrivendoti accetti la nostra <a href="#" className="underline">Privacy Policy</a>. Potrai disiscriverti in qualsiasi momento.
          </p>
        </div>
      </div>
    </section>
  );
}
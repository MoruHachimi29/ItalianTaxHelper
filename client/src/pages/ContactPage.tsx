import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  subject: z.string().min(5, { message: "L'oggetto deve contenere almeno 5 caratteri" }),
  message: z.string().min(10, { message: "Il messaggio deve contenere almeno 10 caratteri" })
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  const onSubmit = (data: ContactForm) => {
    // In a real app, you would send this data to your server
    console.log(data);
    
    toast({
      title: "Messaggio inviato",
      description: "Grazie per averci contattato. Ti risponderemo al più presto.",
    });
    
    form.reset();
  };
  
  return (
    <>
      <Helmet>
        <title>Contatti | ModuliTax</title>
        <meta name="description" content="Contatta il team di ModuliTax per informazioni sui moduli fiscali F24 e F23." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-serif mb-8 text-center">Contattaci</h1>
        
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="mb-6 text-gray-600">
            Hai domande sui nostri servizi o hai bisogno di aiuto con la compilazione dei moduli? 
            Compila il modulo sottostante e ti risponderemo al più presto.
          </p>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">Nome e cognome</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="Il tuo nome"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 p-2 rounded"
                  placeholder="La tua email"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm mb-1">Oggetto</label>
              <input
                type="text"
                className="w-full border border-gray-200 p-2 rounded"
                placeholder="Oggetto del messaggio"
                {...form.register("subject")}
              />
              {form.formState.errors.subject && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm mb-1">Messaggio</label>
              <textarea
                className="w-full border border-gray-200 p-2 rounded h-32"
                placeholder="Scrivi il tuo messaggio qui"
                {...form.register("message")}
              ></textarea>
              {form.formState.errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-900"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Invio in corso..." : "Invia messaggio"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

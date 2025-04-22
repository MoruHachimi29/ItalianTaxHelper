import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SEO from "@/components/SEO";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Schema di validazione per il login
const loginSchema = z.object({
  username: z.string().min(3, "Username deve contenere almeno 3 caratteri"),
  password: z.string().min(6, "Password deve contenere almeno 6 caratteri"),
});

// Schema di validazione per la registrazione
const registerSchema = z.object({
  username: z.string().min(3, "Username deve contenere almeno 3 caratteri"),
  password: z
    .string()
    .min(6, "Password deve contenere almeno 6 caratteri"),
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  fullName: z.string().optional().or(z.literal("")),
});

// Tipi per i form
type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, navigate] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Redirect all'home se l'utente è già loggato
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Form per il login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form per la registrazione
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
    },
  });

  // Handle Login
  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Handle Register
  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  // Se stiamo caricando l'utente, mostra uno spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }

  // Se l'utente è già autenticato, abbiamo l'effetto per il redirect

  return (
    <>
      <SEO
        title="Accedi o Registrati | F24Editabile"
        description="Accedi al tuo account F24Editabile o registrati per salvare i tuoi moduli ed utilizzare tutte le funzionalità della piattaforma."
        canonicalPath="/auth"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            {/* Colonna sinistra: Forms */}
            <div className="w-full lg:w-1/2">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Accedi</TabsTrigger>
                  <TabsTrigger value="register">Registrati</TabsTrigger>
                </TabsList>

                {/* Tab Login */}
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-serif">Accedi</CardTitle>
                      <CardDescription>
                        Inserisci le tue credenziali per accedere al tuo account F24Editabile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Il tuo username"
                                    {...field}
                                    autoComplete="username"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="La tua password"
                                    {...field}
                                    autoComplete="current-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Accedi
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mt-4">
                        Non hai ancora un account?{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => setActiveTab("register")}
                        >
                          Registrati
                        </Button>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Tab Register */}
                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl font-serif">Registrati</CardTitle>
                      <CardDescription>
                        Crea un nuovo account per accedere a tutte le funzionalità
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...registerForm}>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Scegli un username"
                                    {...field}
                                    autoComplete="username"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Scegli una password sicura"
                                    {...field}
                                    autoComplete="new-password"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email (facoltativo)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="La tua email"
                                    {...field}
                                    autoComplete="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome completo (facoltativo)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Il tuo nome e cognome"
                                    {...field}
                                    autoComplete="name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Registrati
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mt-4">
                        Hai già un account?{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => setActiveTab("login")}
                        >
                          Accedi
                        </Button>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Colonna destra: Hero section */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-serif font-bold mb-4">
                  Benvenuto su F24Editabile
                </h2>
                <p className="mb-6 text-gray-700">
                  Registrati gratuitamente per accedere a tutte le funzionalità della piattaforma:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">✓</span>
                    <span>Salva i tuoi moduli F24 e accedi quando vuoi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">✓</span>
                    <span>Partecipa alle discussioni nel forum della community</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">✓</span>
                    <span>Ricevi notifiche per scadenze fiscali e aggiornamenti</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">✓</span>
                    <span>Accedi a strumenti avanzati per la gestione fiscale</span>
                  </li>
                </ul>
                <div className="bg-white p-4 rounded-md border border-gray-200 text-sm">
                  <p className="font-semibold mb-2">Privacy dei tuoi dati</p>
                  <p className="text-gray-600">
                    I tuoi dati personali sono protetti e non saranno mai condivisi con terze parti.
                    La registrazione richiede solo informazioni minime per garantire la tua privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
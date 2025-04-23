import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

// Schema di validazione per il login
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Il nome utente deve contenere almeno 3 caratteri",
  }),
  password: z.string().min(6, {
    message: "La password deve contenere almeno 6 caratteri",
  }),
});

// Schema di validazione per la registrazione
const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Il nome utente deve contenere almeno 3 caratteri",
  }),
  password: z.string().min(6, {
    message: "La password deve contenere almeno 6 caratteri",
  }),
  confirmPassword: z.string().min(1, {
    message: "Conferma la password",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido",
  }).optional().or(z.literal("")),
  fullName: z.string().min(2, {
    message: "Il nome completo deve contenere almeno 2 caratteri",
  }).optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Form di login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form di registrazione
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
    },
  });

  // Gestione submit login
  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Gestione submit registrazione
  const onRegisterSubmit = (data: RegisterFormData) => {
    // Rimuovi confirmPassword prima di inviare
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Reindirizza alla home se l'utente è già autenticato
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Accedi o Registrati | F24Editabile</title>
        <meta name="description" content="Accedi al tuo account o registrati per utilizzare tutte le funzionalità di F24Editabile, incluso il forum della community." />
      </Helmet>

      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Sezione form di autenticazione */}
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Accedi o Registrati</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Accedi al tuo account</CardTitle>
                    <CardDescription>
                      Inserisci le tue credenziali per accedere a F24Editabile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome utente</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome utente" {...field} />
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
                                <Input type="password" placeholder="Password" {...field} />
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
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Accesso in corso...
                            </>
                          ) : (
                            "Accedi"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                      Non hai un account?{" "}
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
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Crea un nuovo account</CardTitle>
                    <CardDescription>
                      Inserisci i tuoi dati per registrarti a F24Editabile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome utente</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome utente" {...field} />
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
                                <Input type="password" placeholder="Password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ripeti password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Ripeti password" {...field} />
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
                              <FormLabel>Email (opzionale)</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Email" {...field} />
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
                              <FormLabel>Nome completo (opzionale)</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome completo" {...field} />
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
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Registrazione in corso...
                            </>
                          ) : (
                            "Registrati"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
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
          
          {/* Sezione informativa */}
          <div className="hidden md:block">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Benvenuto in F24Editabile</h2>
              <p className="mb-4">
                Accedi o registrati per:
              </p>
              <ul className="space-y-2 list-disc pl-5 mb-6">
                <li>Partecipare alle discussioni nel forum della community</li>
                <li>Salvare i moduli F24 compilati nel tuo account</li>
                <li>Ricevere aggiornamenti sulle scadenze fiscali</li>
                <li>Accedere a strumenti esclusivi per gli utenti registrati</li>
              </ul>
              <div className="text-sm text-muted-foreground">
                <p>
                  F24Editabile è lo strumento definitivo per la compilazione dei moduli F24 online,
                  con una piattaforma completa di strumenti utili per gestire gli adempimenti fiscali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
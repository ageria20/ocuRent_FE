import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Registrazione | VR Tours";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Crea un account VR Tours per prenotare esperienze immersive.";
    if (desc) desc.setAttribute("content", content);
  }, []);

  const onSubmit = (data: RegisterFormValues) => {
    toast({ title: "Registrazione completata (demo)", description: "Collega Supabase per abilitare la registrazione reale." });
  };

  const password = watch("password");

  return (
    <Layout>
      <header className="sr-only">
        <h1>Registrazione VR Tours</h1>
        <link rel="canonical" href={window.location.href} />
      </header>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="vr-glass border-white/10">
            <CardHeader>
              <CardTitle>Crea account</CardTitle>
              <CardDescription>Registrati per gestire prenotazioni e dispositivi.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Il tuo nome" {...register("name", { required: true })} />
                  {errors.name && <p className="text-sm text-destructive">Il nome è obbligatorio</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@esempio.com" {...register("email", { required: true })} />
                  {errors.email && <p className="text-sm text-destructive">L'email è obbligatoria</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register("password", { required: true, minLength: 6 })} />
                  {errors.password && <p className="text-sm text-destructive">Minimo 6 caratteri</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Conferma password</Label>
                  <Input id="confirm" type="password" {...register("confirm", { required: true, validate: (v) => v === password })} />
                  {errors.confirm && <p className="text-sm text-destructive">Le password non coincidono</p>}
                </div>
                <Button type="submit" className="w-full" variant="hero">Registrati</Button>
                <p className="text-sm text-muted-foreground text-center">
                  Hai già un account? <Link to="/login" className="underline hover:text-primary transition-smooth">Accedi</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface RegisterFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirm: string;
}

const Register = () => {
     const { register, watch, formState: { errors } } = useForm<RegisterFormValues>();
    const [showPassword, setShwPassword] = useState(false)
    const [isOk, setIsOk] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

const [user, setUser] = useState({
  name: "",
  surname: "",
  telephone: "",
  email: "",
  password: ""
})

  const password = watch("password");
const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
  e.preventDefault()

  try{
    setIsLoading(true)
    const resp = await fetch(`http://localhost:8085/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    if(resp.ok){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      
      setIsOk(true)
      setUser({
        name: "",
        surname: "",
        telephone: "",
        email: "",
        password: ""
      })

    }
  } catch (error) {
    console.log("Errore nella registrazione!")
    console.log(error);
    
  } finally {
    console.log("Registrazione effettuata!")
    setIsLoading(false)
  }
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUser({...user, [e.target.name]: e.target.value})
}
const toggleShowPassword = () => {
    setShwPassword(!showPassword)
}

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input name="name" placeholder="Il tuo nome" value={user.name} onChange={handleChange} required/>
                  
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="name">Cognome</Label>
                  <Input name="surname" placeholder="Il tuo cognome" value={user.surname} onChange={handleChange} required/>
                  {errors.surname && <p className="text-sm text-destructive">Il cognome è obbligatorio</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" type="email" placeholder="tu@esempio.com" required value={user.email} onChange={handleChange} />
                  {errors.email && <p className="text-sm text-destructive">L'email è obbligatoria</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input name="password" type="password" required value={user.password} onChange={handleChange}/>
                  {errors.password && <p className="text-sm text-destructive">Minimo 6 caratteri</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Conferma password</Label>
                  <Input name="confirm" type="password" {...register("confirm", { required: true, validate: (v) => v === password })} />
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

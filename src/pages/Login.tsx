import { motion } from 'framer-motion';
import { FormEvent,useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Headphones } from 'lucide-react';
import { useNavigate} from 'react-router-dom'
import Layout from '@/components/layout/Layout';
import { useAppDispatch } from '../store/store'
import { loginSuccess } from '@/store/slices/authSlice';

const Login = () => {
const [showPassword, setShowPassword] = useState(false)
const [isLoading, setIsLoading] = useState<boolean>(false)
const [token, setToken] = useState("")
const navigate = useNavigate()
const dispatch = useAppDispatch()


const [user, setUser] = useState({
  email: "",
  password: ""
})

const toggleShowPassword = () => {
    setShowPassword(!showPassword)
}

const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
  e.preventDefault()

  try{
    setIsLoading(true)
    const resp = await fetch(`http://localhost:8085/api/auth/user-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
          if(resp.ok){
        const res = await resp.json()
        localStorage.setItem("accessToken", res.accessToken)
        setToken(res.accessToken)
        
        // Salva i dati dell'utente nel Redux store
        dispatch(loginSuccess({ user: res.user, token: res.accessToken }))
        
        // Reindirizza in base al ruolo dell'utente
        if (res.user && res.user.role === 'ADMIN') {
          navigate("/admin")
        } else {
          navigate("/bookings")
        }
      } else {
      if(resp.status === 401){
        navigate("/")
    }
  }
  } catch (error) {
    console.log(error);
    
  } finally{
    setIsLoading(false)
  }
}

   



const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUser({...user, [e.target.name]: e.target.value})
}


  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="vr-glass border-white/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 vr-gradient rounded-full">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                Benvenuto in <span className="vr-gradient bg-clip-text text-transparent">VR Tours</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Accedi al tuo account per continuare l'avventura
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@esempio.com"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="pl-10 vr-glass border-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="La tua password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      className="pl-10 pr-10 vr-glass border-white/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Password dimenticata?
                  </Link>
                </div>

                <Button type="submit" size="lg" variant="hero" className="w-full">
                  Accedi
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O continua con</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Non hai ancora un account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Registrati ora
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Accedendo accetti i nostri{' '}
              <Link to="/terms" className="text-primary hover:underline">Termini di Servizio</Link>
              {' '}e la{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
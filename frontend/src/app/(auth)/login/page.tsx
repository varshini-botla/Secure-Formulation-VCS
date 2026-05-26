'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, FlaskConical } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.status === 'error') {
        setError(data.message);
      } else {
        setAuth(data.user, data.access_token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-white">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/50">
              <FlaskConical className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">SECURE VCS</span>
              <span className="text-xs text-blue-400 font-medium tracking-widest uppercase">Formulation Control</span>
            </div>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white overflow-hidden shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your credentials to access the R&D vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    placeholder="name@pharma.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 pl-10 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 pl-10 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Authorize Access'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-1 text-sm text-zinc-400">
            Don't have an account? <a href="/register" className="text-blue-400 hover:underline">Request access</a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

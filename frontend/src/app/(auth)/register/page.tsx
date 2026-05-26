'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building, FlaskConical, Loader2, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: 'R&D'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10 p-4"
      >
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/10" 
                onClick={() => router.push('/login')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl font-bold">Request Investigator Access</CardTitle>
            </div>
            <CardDescription className="text-zinc-400 pl-10">
              Join the Secure VCS network to collaborate on formulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="firstName"
                      className="bg-white/5 border-white/10 pl-10"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    className="bg-white/5 border-white/10"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    className="bg-white/5 border-white/10 pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <select 
                    className="w-full bg-[#18181b] border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-blue-500"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="R&D">Research & Development</option>
                    <option value="QA">Quality Assurance</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Secret Phrase (Password)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    className="bg-white/5 border-white/10 pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Initialize Account Request'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-zinc-500 text-center">
            By requesting access, you agree to the Automated Audit Trail Agreement and Intellectual Property Compliance standards.
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

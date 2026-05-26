'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Beaker, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data } = await api.get('/ingredients');
      setIngredients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
            <Package className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ingredient Registry</h1>
            <p className="text-zinc-500 mt-1">Chemical catalog and standardized unit management.</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4 mr-2" />
          Import Materials
        </Button>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by code or chemical name..."
            className="bg-black/20 border-white/10 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl"></div>
          ))
        ) : filtered.map((ing) => (
          <motion.div
            key={ing.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
          >
             <div className="absolute -right-4 -bottom-4 opacity-5 bg-blue-500 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-blue-400 font-mono tracking-widest">{ing.code}</span>
                   <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{ing.name}</h3>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                   <Beaker className="w-5 h-5 text-zinc-600" />
                </div>
             </div>
             
             <p className="text-xs text-zinc-500 line-clamp-2 mb-4 relative z-10">
                {ing.description || 'Standardized material used in various formulations.'}
             </p>

             <div className="flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-zinc-400">Unit: {ing.unit}</span>
                <Button variant="ghost" size="sm" className="text-blue-400 group-hover:bg-blue-400/10">
                   View Usage <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

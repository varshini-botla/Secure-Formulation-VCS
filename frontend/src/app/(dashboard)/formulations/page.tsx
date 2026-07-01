'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  History, 
  GitFork,
  ArrowUpDown,
  FlaskConical
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export default function FormulationsPage() {
  const router = useRouter();
  const [formulations, setFormulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFormulations = async () => {
    try {
      const { data } = await api.get('/formulations');
      setFormulations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulations();
  }, []);

  const statusColors: any = {
    DRAFT: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    SUBMITTED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    UNDER_REVIEW: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    APPROVED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    REJECTED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const filtered = formulations.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Formulation Repository</h1>
          <p className="text-muted-foreground mt-1">Manage and track version history of your chemical products.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 text-white" onClick={() => router.push('/formulations/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Formulation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, or ID..."
            className="bg-background border-border pl-10 h-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="hover:bg-muted border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="hover:bg-muted border-border">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-md"
      >
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest pl-6">Product Information</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Category</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Latest Version</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Owner</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Updated At</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell colSpan={7} className="h-16 bg-muted/20"></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <FlaskConical className="w-12 h-12 opacity-30" />
                    <p>No formulations found in the vault.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.map((item) => (
              <TableRow key={item.id} className="border-border hover:bg-muted transition-colors group">
                <TableCell className="pl-6 font-medium">
                  <div className="flex flex-col">
                    <span className="text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {item.id.split('-')[0].toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted border-border text-muted-foreground font-medium">
                    {item.category || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                      v{item.versions[0]?.versionNumber || '1.0'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColors[item.status]} font-bold`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-sm">
                  {item.owner.firstName} {item.owner.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-muted-foreground"
                      onClick={() => window.location.href = `/formulations/${item.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                        <DropdownMenuItem className="hover:bg-muted cursor-pointer">
                          <History className="w-4 h-4 mr-2 text-muted-foreground" /> Version History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-muted cursor-pointer">
                          <GitFork className="w-4 h-4 mr-2 text-muted-foreground" /> Clone Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-destructive/10 hover:text-destructive cursor-pointer text-destructive">
                          Archive Formulation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

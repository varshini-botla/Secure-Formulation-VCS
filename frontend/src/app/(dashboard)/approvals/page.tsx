'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
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
import { ClipboardCheck, Eye, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApprovalsPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const { data } = await api.get('/approvals/queue');
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const statusColors: any = {
    SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <ClipboardCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Assurance Queue</h1>
            <p className="text-zinc-500 mt-1">Review, approve, or reject pending formulation snapshots.</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-4 text-xs font-bold font-mono tracking-widest uppercase">
          QA RELEASE GATE
        </Badge>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden shadow-xl"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-6">Formulation</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Version</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Submitted By</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Reason</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell colSpan={6} className="h-16 bg-white/5"></TableCell>
                </TableRow>
              ))
            ) : queue.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                    <Clock className="w-12 h-12 opacity-20" />
                    <p>Approval queue is currently clear.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : queue.map((item) => {
              const latestVersion = item.versions[0];
              return (
                <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex flex-col">
                      <span className="text-zinc-100 group-hover:text-emerald-400 transition-colors">{item.name}</span>
                      <span className="text-[10px] text-zinc-600 font-mono">ID: {item.id.split('-')[0].toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                      v{latestVersion?.versionNumber || '1.0'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span>{item.owner.firstName} {item.owner.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[item.status]} font-bold`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-sm max-w-xs truncate">
                    {latestVersion?.changeReason || 'No changelog message provided.'}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-emerald-400/10 hover:text-emerald-400"
                      onClick={() => router.push(`/formulations/${item.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

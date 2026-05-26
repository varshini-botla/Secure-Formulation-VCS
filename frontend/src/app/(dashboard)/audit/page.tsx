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
import { Input } from '@/components/ui/input';
import { Search, Shield, History, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/audit-logs');
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.firstName.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <Shield className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Audit Trail</h1>
            <p className="text-zinc-500 mt-1">Immutable record of every interaction with the secure vault.</p>
          </div>
        </div>
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 py-2 px-4 text-xs font-bold font-mono tracking-widest uppercase">
          COMPLIANCE SECURED
        </Badge>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Filter logs by user, action, or entity..."
            className="bg-black/20 border-white/10 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden shadow-xl"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-6">Timestamp</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Authorized User</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Action Performed</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Entity Target</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Record Status</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               Array(8).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell colSpan={6} className="h-14 bg-white/5"></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-zinc-500 italic">No audit records found matching your query.</TableCell>
              </TableRow>
            ) : filtered.map((log) => (
              <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="pl-6 font-mono text-xs text-zinc-500">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[10px] font-bold">
                       {log.user?.firstName[0]}{log.user?.lastName[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{log.user?.firstName} {log.user?.lastName}</span>
                      <span className="text-[10px] text-zinc-600 font-mono italic">{log.metadata?.ip || 'Internal System'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[11px] bg-white/10 text-white px-2 py-1 rounded font-bold">
                    {log.action}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{log.entity}</span>
                    <span className="text-[10px] font-mono text-zinc-600">ID: {log.entityId?.split('-')[0].toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px]">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                    IMMUTABLE
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

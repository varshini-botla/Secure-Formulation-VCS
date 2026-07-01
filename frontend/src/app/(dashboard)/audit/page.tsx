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

  useEffect(() => {
    fetchLogs();
  }, []);

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
            <Shield className="w-8 h-8 text-rose-600 dark:text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">System Audit Trail</h1>
            <p className="text-muted-foreground mt-1">Immutable record of every interaction with the secure vault.</p>
          </div>
        </div>
        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20 py-2 px-4 text-xs font-bold font-mono tracking-widest uppercase">
          COMPLIANCE SECURED
        </Badge>
      </div>

      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter logs by user, action, or entity..."
            className="bg-background border-border pl-10 h-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-md"
      >
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest pl-6">Timestamp</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Authorized User</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Action Performed</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Entity Target</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Record Status</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               Array(8).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell colSpan={6} className="h-14 bg-muted/20"></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">No audit records found matching your query.</TableCell>
              </TableRow>
            ) : filtered.map((log) => (
              <TableRow key={log.id} className="border-border hover:bg-muted transition-colors group">
                <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border text-[10px] font-bold text-foreground">
                       {log.user?.firstName[0]}{log.user?.lastName[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{log.user?.firstName} {log.user?.lastName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono italic">{log.metadata?.ip || 'Internal System'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[11px] bg-muted border border-border text-foreground px-2 py-1 rounded font-bold">
                    {log.action}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-foreground">
                    <span className="text-sm">{log.entity}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {log.entityId?.split('-')[0].toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-mono text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                    IMMUTABLE
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
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

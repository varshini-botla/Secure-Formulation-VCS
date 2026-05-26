'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 18 },
  { name: 'Mar', count: 25 },
  { name: 'Apr', count: 32 },
  { name: 'May', count: 28 },
  { name: 'Jun', count: 35 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 124,
    pending: 12,
    approved: 108,
    risks: 3
  });

  const [recentActivity] = useState([
    { id: 1, user: 'Dr. Marie Curie', action: 'Created Version v1.4', target: 'Aspirin Gold-500', time: '10 mins ago', status: 'DRAFT' },
    { id: 2, user: 'John Doe (QA)', action: 'Approved Version v2.0', target: 'Ethanol Solv-99', time: '2 hours ago', status: 'APPROVED' },
    { id: 3, user: 'Dr. Marie Curie', action: 'Submitted for Review', target: 'Lidocaine Base', time: '5 hours ago', status: 'SUBMITTED' },
    { id: 4, user: 'System', action: 'Auto-locked Version v1.0', target: 'Zinc Oxide Paste', time: '1 day ago', status: 'LOCKED' },
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VCS Intelligence Overview</h1>
          <p className="text-zinc-500 mt-1">Real-time status of formulation lifecycle and compliance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
            <FileText className="w-4 h-4 mr-2" />
            Export Audit
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4 mr-2" />
            New Formulation
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Formulations', val: stats.total, icon: FlaskConical, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending Approval', val: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Approved Versions', val: stats.approved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Compliance Risks', val: stats.risks, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-1 tabular-nums">{stat.val}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-zinc-400">
                  <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                  <span className="text-emerald-500 font-bold">+12%</span>
                  <span className="ml-2 mt-0.5">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Formulation Velocity</CardTitle>
            <CardDescription>New versions created per month</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #ffffff10' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Compliance Feed</CardTitle>
            <CardDescription>Latest system-wide actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((act) => (
                <div key={act.id} className="relative pl-6 pb-2 border-l border-white/10 last:border-0 last:pb-0">
                  <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold">{act.user}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{act.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {act.action} in <span className="text-blue-400 font-medium">#{act.target}</span>
                    </p>
                    <div className="mt-1">
                      <Badge variant="outline" className={`text-[10px] py-0 border-white/10 ${
                        act.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-400/5' : 
                        act.status === 'SUBMITTED' ? 'text-blue-400 bg-blue-400/5' : 
                        'text-zinc-500 bg-zinc-500/5'
                      }`}>
                        {act.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-zinc-500 hover:text-white hover:bg-white/5 text-sm uppercase tracking-widest font-bold">
              View Audit History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

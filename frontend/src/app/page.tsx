'use client';

import { Shield, FlaskConical, GitBranch, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-border backdrop-blur-sm bg-background/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SECURE VCS</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-foreground hover:bg-muted">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-20 px-8 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
            <Shield className="w-3 h-3" /> Enterprise Grade Security
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Precision VCS for <br /> Chemical R&D.
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The industry standard for formulation version control, multi-stage approvals, and comprehensive audit transparency. 
            Secure your innovation pipeline today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-2xl shadow-blue-600/30 group">
                Initialize Vault <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 bg-white/5 hover:bg-white/10 text-lg font-bold">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto pb-32">
        {[
          {
            icon: GitBranch,
            title: "Version Control",
            desc: "Full history of formula modifications with granular diff tracking and change reasoning.",
            color: "text-blue-400"
          },
          {
            icon: Shield,
            title: "Role-Based Access",
            desc: "Enterprise RBAC ensuring only authorized personnel can view or modify sensitive IP.",
            color: "text-purple-400"
          },
          {
            icon: Lock,
            title: "Immutable Audits",
            desc: "Tamper-proof logs tracking every interaction, compliant with international standards.",
            color: "text-emerald-400"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
          >
            <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 border-t border-white/5 text-center text-zinc-600 text-xs tracking-widest uppercase font-bold">
        © 2026 Secure VCS Enterprise · All Rights Protected
      </footer>
    </div>
  );
}

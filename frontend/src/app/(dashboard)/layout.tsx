'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FlaskConical, 
  LayoutDashboard, 
  History, 
  ClipboardCheck, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell,
  Search,
  User,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SCIENTIST', 'QA', 'VIEWER'] },
  { name: 'Formulations', href: '/formulations', icon: FlaskConical, roles: ['ADMIN', 'SCIENTIST', 'QA', 'VIEWER'] },
  { name: 'Approval Queue', href: '/approvals', icon: ClipboardCheck, roles: ['ADMIN', 'QA'] },
  { name: 'Audit Logs', href: '/audit', icon: History, roles: ['ADMIN', 'QA'] },
  { name: 'Ingredients', href: '/ingredients', icon: Package, roles: ['ADMIN', 'SCIENTIST'] },
  { name: 'Team', href: '/team', icon: ShieldCheck, roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col z-50 fixed md:relative h-full"
          >
            <div className="p-6 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">SECURE VCS</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.filter(item => item.roles.includes(user.role)).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    pathname === item.href 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-zinc-500 truncate capitalize">{user.role.toLowerCase()}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:flex hover:bg-white/5"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 w-96 border border-white/5 group focus-within:border-blue-500/50 transition-all">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search formulations, ingredients, or versions..."
                className="bg-transparent border-none focus:ring-0 text-sm px-3 w-full text-zinc-300 placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-white/5">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0a]"></span>
            </Button>
            <div className="h-8 w-px bg-white/5 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium tracking-wide">Enterprise Vault v2.4</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">System Operational</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

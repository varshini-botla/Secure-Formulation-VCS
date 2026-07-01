'use client';

import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
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
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SCIENTIST', 'QA', 'VIEWER'] },
  { name: 'Formulations', href: '/formulations', icon: FlaskConical, roles: ['ADMIN', 'SCIENTIST', 'QA', 'VIEWER'] },
  { name: 'Approval Queue', href: '/approvals', icon: ClipboardCheck, roles: ['ADMIN', 'QA'] },
  { name: 'Audit Logs', href: '/audit', icon: History, roles: ['ADMIN', 'QA'] },
  { name: 'Ingredients', href: '/ingredients', icon: Package, roles: ['ADMIN', 'SCIENTIST'] },
  { name: 'Team', href: '/team', icon: ShieldCheck, roles: ['ADMIN'] },
  { name: 'Departments', href: '/departments', icon: Settings, roles: ['ADMIN'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [router]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-72 border-r border-border bg-card flex flex-col z-50 fixed md:relative h-full animate-in fade-in duration-200"
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
                      ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="bg-muted rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">{user.role.toLowerCase()}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-45">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:flex hover:bg-muted"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="hidden md:flex items-center bg-muted rounded-full px-4 py-2 w-96 border border-border group focus-within:border-blue-500/50 transition-all">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search formulations, ingredients, or versions..."
                className="bg-transparent border-none focus:ring-0 text-sm px-3 w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <ThemeToggle />
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-muted"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold border-2 border-background">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-96 bg-popover border border-border text-popover-foreground rounded-2xl p-4 shadow-2xl z-55 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                      <span className="font-bold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-6">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.isRead && markAsRead(n.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all ${
                              n.isRead ? 'bg-transparent hover:bg-muted' : 'bg-blue-600/10 hover:bg-blue-600/15 border border-blue-600/20'
                            }`}
                          >
                            <p className="text-xs text-foreground">{n.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px border-l border-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium tracking-wide">Enterprise Vault v2.4</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">System Operational</p>
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


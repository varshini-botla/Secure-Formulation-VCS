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
import { Search, Plus, UserCheck, ShieldAlert, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'SCIENTIST',
    departmentId: '',
  });

  const fetchData = async () => {
    try {
      const [usersRes, deptsRes] = await Promise.all([
        api.get('/users'),
        api.get('/departments'),
      ]);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'SCIENTIST',
      departmentId: departments[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Leave blank unless changing
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      departmentId: user.departmentId || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password; // Do not update password if blank
        await api.put(`/users/${editingUser.id}`, payload);
      } else {
        // Create
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is permanent.')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => 
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: any = {
    ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    SCIENTIST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    QA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    VIEWER: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <UserCheck className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Access Control & Team</h1>
            <p className="text-zinc-500 mt-1">Manage user roles, departments, and security permissions.</p>
          </div>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search members by name or email..."
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
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-6">Member</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Email Address</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Department</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">System Role</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell colSpan={5} className="h-16 bg-white/5"></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-zinc-500 italic">No users found.</TableCell>
              </TableRow>
            ) : filtered.map((member) => (
              <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="pl-6 font-medium">
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell className="font-mono text-zinc-400 text-xs">
                  {member.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                    {member.department?.name || 'Unassigned'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${roleColors[member.role]} font-bold`}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-blue-400/10 hover:text-blue-400"
                      onClick={() => openEditModal(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-red-400/10 hover:text-red-400"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold">{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h2>
                <p className="text-xs text-zinc-500 mt-1">Assign roles and configure system accessibility parameters.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">First Name</label>
                    <Input 
                      required
                      className="bg-white/5 border-white/10" 
                      placeholder="Jane" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Last Name</label>
                    <Input 
                      required
                      className="bg-white/5 border-white/10" 
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Email Address</label>
                  <Input 
                    required
                    type="email"
                    className="bg-white/5 border-white/10" 
                    placeholder="jane.doe@company.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Password {editingUser && '(Leave blank to keep current)'}</label>
                  <Input 
                    required={!editingUser}
                    type="password"
                    className="bg-white/5 border-white/10" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Role</label>
                    <select 
                      className="w-full bg-[#18181b] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="SCIENTIST">Scientist</option>
                      <option value="QA">Quality Assurance (QA)</option>
                      <option value="ADMIN">System Admin</option>
                      <option value="VIEWER">Auditor / Viewer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Department</label>
                    <select 
                      className="w-full bg-[#18181b] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                      value={formData.departmentId}
                      onChange={e => setFormData({...formData, departmentId: e.target.value})}
                    >
                      <option value="">No Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">Save Member</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

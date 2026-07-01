'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users, FlaskConical, Edit, Trash2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [newDeptName, setNewDeptName] = useState('');

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, { name: newDeptName });
      } else {
        await api.post('/departments', { name: newDeptName });
      }
      setIsModalOpen(false);
      setNewDeptName('');
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department? Users and formulations in it will remain, but their department relation will be cleared.')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingDept(null);
    setNewDeptName('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept: any) => {
    setEditingDept(dept);
    setNewDeptName(dept.name);
    setIsModalOpen(true);
  };

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-600/20">
            <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Departments</h1>
            <p className="text-muted-foreground mt-1">Configure company divisions and assign research teams.</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Create Department
        </Button>
      </div>

      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full bg-background border border-border rounded-md py-2 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl border border-border"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground italic">No departments registered.</div>
        ) : filtered.map((dept) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-all group relative overflow-hidden flex flex-col justify-between h-44 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{dept.name}</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-muted-foreground"
                    onClick={() => openEditModal(dept)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                    onClick={() => handleDelete(dept.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">ID: {dept.id.split('-')[0].toUpperCase()}</p>
            </div>

            <div className="flex gap-6 pt-4 border-t border-border text-muted-foreground text-xs">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{dept._count?.users ?? 0} Members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-muted-foreground" />
                <span>{dept._count?.formulations ?? 0} Formulations</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-foreground"
            >
              <div>
                <h2 className="text-xl font-bold">{editingDept ? 'Modify Department' : 'Create Department'}</h2>
                <p className="text-xs text-muted-foreground mt-1">Assign a unique label for this organizational group.</p>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Department Name</label>
                  <Input 
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500" 
                    placeholder="e.g. Therapeutics & Biologics" 
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="hover:bg-muted text-foreground">Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10">Save Department</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  FlaskConical, 
  History, 
  ClipboardCheck, 
  Printer, 
  Edit,
  GitCommit,
  Check,
  X,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FormulationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [formulation, setFormulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormulation();
  }, [id]);

  const fetchFormulation = async () => {
    try {
      const { data } = await api.get(`/formulations/${id}`);
      setFormulation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: string) => {
    try {
      await api.post(`/approvals/review/${formulation.versions[0].id}`, { status, comments: 'Approved via dashboard' });
      fetchFormulation();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!formulation) return <div>Not found</div>;

  const currentVersion = formulation.versions[0];

  return (
    <div className="space-y-8 pb-12">
      {/* breadcrumb / Back */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="hover:bg-white/10" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <FlaskConical className="w-48 h-48" />
        </div>
        <div className="space-y-4 z-10">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">v{currentVersion.versionNumber}</Badge>
            <Badge variant="outline" className="border-white/20 text-zinc-400">{formulation.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{formulation.name}</h1>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span>Owner: {formulation.owner.firstName} {formulation.owner.lastName}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-zinc-500" />
              <span>Status: <span className="font-bold text-blue-400">{formulation.status}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <Button variant="outline" className="bg-white/5 border-white/10">
            <Printer className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          {(user?.role === 'QA' || user?.role === 'ADMIN') && formulation.status === 'SUBMITTED' && (
            <>
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => handleApprove('REJECTED')}>
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove('APPROVED')}>
                <Check className="w-4 h-4 mr-2" /> Approve Release
              </Button>
            </>
          )}
          {(user?.role === 'SCIENTIST' || user?.role === 'ADMIN') && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" /> Draft New Version
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Tabs */}
        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="composition" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
              <TabsTrigger value="composition" className="rounded-lg data-[state=active]:bg-blue-600">Composition</TabsTrigger>
              <TabsTrigger value="process" className="rounded-lg data-[state=active]:bg-blue-600">Process Steps</TabsTrigger>
              <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-blue-600">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="composition" className="mt-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Ingredient Matrix</CardTitle>
                    <CardDescription>Exact weights and percentages for this version.</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Total Batch Size</p>
                    <p className="text-lg font-bold">{formulation.batchSize} {formulation.unit}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead className="text-left text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10">
                      <tr>
                        <th className="pb-4 pt-2">Ingredient Code</th>
                        <th className="pb-4 pt-2">Name</th>
                        <th className="pb-4 pt-2 text-right">Weight</th>
                        <th className="pb-4 pt-2 text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentVersion.ingredients.map((ing: any) => (
                        <tr key={ing.id} className="text-sm">
                          <td className="py-4 font-mono text-blue-400">{ing.ingredient.code}</td>
                          <td className="py-4">{ing.ingredient.name}</td>
                          <td className="py-4 text-right tabular-nums">{ing.weight} {ing.unit}</td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="tabular-nums">{ing.percentage}%</span>
                              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${ing.percentage}%` }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process" className="mt-6 space-y-4">
              {currentVersion.processSteps.map((step: any) => (
                <Card key={step.id} className="bg-white/5 border-white/10 transition-all hover:border-blue-500/30">
                  <CardContent className="p-6 flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20 flex-shrink-0">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className="text-zinc-200">{step.description}</p>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Temperature</p>
                          <p className="text-sm font-bold">{step.temperature ?? '--'} °C</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Pressure</p>
                          <p className="text-sm font-bold">{step.pressure ?? '--'} bar</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Mixing Time</p>
                          <p className="text-sm font-bold">{step.mixingTime ?? '--'} min</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">pH Level</p>
                          <p className="text-sm font-bold">{step.phLevel ?? '--'}</p>
                        </div>
                      </div>
                      {step.notes && (
                        <div className="text-xs text-zinc-500 italic bg-white/5 p-2 rounded-md">
                          Note: {step.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar History */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm sticky top-28">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-lg">Version Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {formulation.versions.map((v: any, i: number) => (
                  <div key={v.id} className={`p-4 transition-colors cursor-pointer hover:bg-white/5 ${i === 0 ? 'bg-blue-600/5 border-l-2 border-blue-500' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold ${i === 0 ? 'text-blue-400' : 'text-zinc-300'}`}>Version v{v.versionNumber}</span>
                      {v.isApproved && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{v.changeReason || 'No commit message'}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-600">
                      <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-bold">
                        <GitCommit className="w-3 h-3" /> SNAPSHOT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full p-4 rounded-none rounded-b-xl border-t border-white/5 text-zinc-500 hover:text-white" onClick={() => router.push(`/compare?id=${id}`)}>
                 View Comparison Engine
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

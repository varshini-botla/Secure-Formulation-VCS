'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FlaskConical, Hash, Minus, Plus, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  
  const [v1, setV1] = useState<any>(null);
  const [v2, setV2] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchVersions = async () => {
    try {
      const { data } = await api.get(`/formulations/${id}`);
      setV2(data.versions[0]);
      setV1(data.versions[1] || data.versions[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchVersions();
  }, [id]);

  if (loading) return <div>Analyzing snapshots...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Version Comparison Engine</h1>
        </div>
        <div className="flex items-center gap-4 bg-card px-6 py-3 rounded-2xl border border-border shadow-md">
           <div className="flex flex-col text-right">
             <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Base</span>
             <span className="font-bold text-blue-600 dark:text-blue-400">v{v1.versionNumber}</span>
           </div>
           <ArrowRight className="w-4 h-4 text-muted-foreground" />
           <div className="flex flex-col">
             <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Target</span>
             <span className="font-bold text-emerald-600 dark:text-emerald-400">v{v2.versionNumber}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Ingredient Differences */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
             <FlaskConical className="w-5 h-5 text-blue-500" />
             <h2 className="text-xl font-bold tracking-tight uppercase text-muted-foreground text-sm tracking-[0.2em]">Molecular Composition Changes</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
             {/* Left: Base Version */}
             <div className="space-y-4">
                {v1.ingredients.map((ing: any) => (
                  <Card key={ing.id} className="bg-card border-border opacity-70">
                    <CardContent className="p-4 flex justify-between items-center">
                       <div className="flex flex-col">
                         <span className="text-xs font-mono text-muted-foreground">{ing.ingredient.code}</span>
                         <span className="font-bold text-foreground">{ing.ingredient.name}</span>
                       </div>
                       <div className="text-right">
                         <span className="block font-bold text-foreground">{ing.weight} {ing.unit}</span>
                         <span className="text-xs text-muted-foreground">{ing.percentage}%</span>
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>

             {/* Right: Target Version with Diffs */}
             <div className="space-y-4">
                {v2.ingredients.map((ing: any) => {
                  const prev = v1.ingredients.find((i: any) => i.ingredientId === ing.ingredientId);
                  const weightDiff = prev ? ing.weight - prev.weight : ing.weight;
                  const percDiff = prev ? ing.percentage - prev.percentage : ing.percentage;

                  return (
                    <motion.div 
                      key={ing.id} 
                      initial={{ x: 20, opacity: 0 }} 
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={`border-border transition-all ${
                        !prev ? 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/30' : 
                        weightDiff !== 0 ? 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/30' : 
                        'bg-card border-border'
                      }`}>
                        <CardContent className="p-4 flex justify-between items-center relative overflow-hidden">
                           {!prev && <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-emerald-600 text-white text-[8px] uppercase tracking-widest font-bold">NEWLY ADDED</Badge>}
                           
                           <div className="flex flex-col">
                             <span className={`text-xs font-mono ${!prev ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>{ing.ingredient.code}</span>
                             <span className="font-bold text-foreground">{ing.ingredient.name}</span>
                           </div>
                           
                           <div className="text-right">
                             <div className="flex items-center justify-end gap-2 text-foreground">
                                <span className="font-bold">{ing.weight} {ing.unit}</span>
                                {weightDiff !== 0 && (
                                  <span className={`text-xs font-bold px-1 rounded flex items-center ${weightDiff > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'}`}>
                                    {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(2)}
                                  </span>
                                )}
                             </div>
                             <div className="flex items-center justify-end gap-2 text-xs">
                                <span className="text-muted-foreground">{ing.percentage}%</span>
                                {percDiff !== 0 && (
                                  <span className={`font-bold ${percDiff > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    ({percDiff > 0 ? '+' : ''}{percDiff.toFixed(1)}%)
                                  </span>
                                )}
                             </div>
                           </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
             </div>
          </div>
        </section>

        {/* Process Steps Comparison */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold tracking-tight uppercase text-muted-foreground text-sm tracking-[0.2em]">Operational Dynamics Comparison</h2>
           </div>

           <div className="space-y-6">
              {v2.processSteps.map((step: any, idx: number) => {
                const prevStep = v1.processSteps[idx];
                const hasChanged = prevStep && (
                  step.temperature !== prevStep.temperature ||
                  step.pressure !== prevStep.pressure ||
                  step.mixingTime !== prevStep.mixingTime
                );

                return (
                  <div key={step.id} className="grid grid-cols-2 gap-8 relative">
                    <Card className="bg-card border-border opacity-55 grayscale">
                       <CardContent className="p-4 flex gap-4">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground">{prevStep?.stepNumber ?? '?'}</div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{prevStep?.description ?? 'No corresponding step in base version'}</p>
                       </CardContent>
                    </Card>
                    
                    {/* The connector */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                       <div className={`p-2 rounded-full backdrop-blur-xl border ${hasChanged ? 'border-amber-500/50 bg-amber-500/20' : 'border-emerald-500/50 bg-emerald-500/20'}`}>
                          {hasChanged ? <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" /> : <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />}
                       </div>
                    </div>

                    <Card className={`border-border ${hasChanged ? 'bg-amber-500/5 border-amber-500/20' : 'bg-card border-border'}`}>
                       <CardContent className="p-4 flex flex-col gap-4">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-blue-600/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-600/20">{step.stepNumber}</div>
                            <p className="text-sm text-foreground">{step.description}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                             {[
                               { label: 'TEMP', val: step.temperature, old: prevStep?.temperature, unit: '°C' },
                               { label: 'PRESS', val: step.pressure, old: prevStep?.pressure, unit: 'bar' },
                               { label: 'TIME', val: step.mixingTime, old: prevStep?.mixingTime, unit: 'min' },
                             ].map((param, i) => (
                               <div key={i} className="bg-muted p-2 rounded border border-border">
                                 <p className="text-[9px] text-muted-foreground font-bold tracking-widest">{param.label}</p>
                                 <div className="flex items-baseline gap-1 text-foreground">
                                   <span className="text-sm font-bold tabular-nums">{param.val}</span>
                                   <span className="text-[10px] text-muted-foreground">{param.unit}</span>
                                   {param.old !== param.val && param.old !== undefined && (
                                     <span className={`text-[10px] font-bold ${param.val > param.old ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                       ({param.val > param.old ? '↑' : '↓'})
                                     </span>
                                   )}
                                 </div>
                               </div>
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                );
              })}
           </div>
        </section>
      </div>
    </div>
  );
}

const AlertTriangle = ({className}: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
)

const Check = ({className}: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

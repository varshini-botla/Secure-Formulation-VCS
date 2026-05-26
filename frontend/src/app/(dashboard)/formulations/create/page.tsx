'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Beaker, FlaskConical, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateFormulationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pharmaceutical',
    batchSize: 100,
    unit: 'kg',
    ingredients: [] as any[],
    processSteps: [] as any[],
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data } = await api.get('/ingredients');
      setAvailableIngredients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredientId: '', weight: 0, percentage: 0, unit: 'kg' }]
    });
  };

  const removeIngredient = (index: number) => {
    const newIngs = [...formData.ingredients];
    newIngs.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngs });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      processSteps: [...formData.processSteps, { description: '', temperature: 25, pressure: 1, mixingTime: 30 }]
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/formulations', formData);
      router.push('/formulations');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="ghost" onClick={() => router.back()}>
             <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
           </Button>
           <h1 className="text-3xl font-bold">New Formulation Entry</h1>
        </div>
        <div className="flex items-center gap-2">
           {[1, 2, 3].map((s) => (
             <div key={s} className={`w-3 h-3 rounded-full ${s === step ? 'bg-blue-600' : 'bg-white/10'}`}></div>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>Setup the core details of the pharmaceutical product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input 
                      className="bg-black/20 border-white/10"
                      placeholder="e.g. Paracetamol Extra"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      className="w-full bg-[#18181b] border border-white/10 rounded-md px-3 py-2 text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Pharmaceutical">Pharmaceutical</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Research">Research Extra</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Batch Size</Label>
                    <Input 
                      type="number"
                      className="bg-black/20 border-white/10"
                      value={formData.batchSize}
                      onChange={(e) => setFormData({...formData, batchSize: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Unit</Label>
                    <Input 
                      className="bg-black/20 border-white/10"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-6 flex justify-end">
                   <Button className="bg-blue-600" onClick={() => setStep(2)}>
                     Continue to Composition <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Molecular Composition</CardTitle>
                  <CardDescription>Add ingredients and define their weight distribution.</CardDescription>
                </div>
                <Button variant="outline" className="bg-white/5 border-white/10" onClick={addIngredient}>
                  <Plus className="w-4 h-4 mr-2" /> Add Ingredient
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex-1 space-y-2">
                      <Label>Ingredient</Label>
                      <select 
                        className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm"
                        value={ing.ingredientId}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].ingredientId = e.target.value;
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      >
                        <option value="">Select Material...</option>
                        {availableIngredients.map(i => (
                          <option key={i.id} value={i.id}>{i.name} ({i.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Weight</Label>
                      <Input 
                        type="number"
                        className="bg-black/20 border-white/10"
                        value={ing.weight}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].weight = Number(e.target.value);
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Percentage</Label>
                      <Input 
                        type="number"
                        className="bg-black/20 border-white/10"
                        value={ing.percentage}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].percentage = Number(e.target.value);
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      />
                    </div>
                    <Button variant="ghost" className="text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => removeIngredient(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {formData.ingredients.length === 0 && (
                  <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                     <Beaker className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                     <p className="text-zinc-500">Add the first ingredient to start the composition.</p>
                  </div>
                )}

                <div className="pt-6 flex justify-between">
                   <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                   <Button className="bg-blue-600" onClick={() => setStep(3)}>
                     Continue to Process <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manufacturing Process</CardTitle>
                  <CardDescription>Define chronological steps and operational parameters.</CardDescription>
                </div>
                <Button variant="outline" className="bg-white/5 border-white/10" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.processSteps.map((stepData, idx) => (
                  <div key={idx} className="bg-black/20 p-6 rounded-xl border border-white/5 space-y-4 relative">
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
                       {idx + 1}
                    </div>
                    <div className="pl-10 space-y-2">
                       <Label>Step Description</Label>
                       <Input 
                         className="bg-white/5" 
                         placeholder="e.g. Mix Ethanol with Water for 15 minutes at high speed"
                         value={stepData.description}
                         onChange={(e) => {
                           const newSteps = [...formData.processSteps];
                           newSteps[idx].description = e.target.value;
                           setFormData({...formData, processSteps: newSteps});
                         }}
                       />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pl-10">
                       <div className="space-y-2">
                          <Label>Temp (°C)</Label>
                          <Input type="number" className="bg-white/5" value={stepData.temperature} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].temperature = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                       <div className="space-y-2">
                          <Label>Pressure (Bar)</Label>
                          <Input type="number" className="bg-white/5" value={stepData.pressure} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].pressure = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                       <div className="space-y-2">
                          <Label>Time (min)</Label>
                          <Input type="number" className="bg-white/5" value={stepData.mixingTime} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].mixingTime = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 flex justify-between">
                   <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                   <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
                     Save & Create Version v1.0 <Check className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </CardContent>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Check = ({className}: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

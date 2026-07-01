'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Beaker, FlaskConical, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateFormulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forkId = searchParams.get('fork');
  const [step, setStep] = useState(1);
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pharmaceutical',
    batchSize: 100,
    unit: 'kg',
    ingredients: [] as any[],
    processSteps: [] as any[],
    changeReason: '',
    isMajor: false,
  });

  const fetchIngredients = async () => {
    try {
      const { data } = await api.get('/ingredients');
      setAvailableIngredients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFormulationForFork = async (id: string) => {
    try {
      const { data } = await api.get(`/formulations/${id}`);
      const latestVersion = data.versions[0];
      setFormData({
        name: data.name,
        category: data.category || 'Pharmaceutical',
        batchSize: data.batchSize || 100,
        unit: data.unit || 'kg',
        ingredients: latestVersion.ingredients.map((ing: any) => ({
          ingredientId: ing.ingredientId,
          weight: ing.weight,
          percentage: ing.percentage,
          unit: ing.unit,
        })),
        processSteps: latestVersion.processSteps.map((step: any) => ({
          description: step.description,
          temperature: step.temperature,
          pressure: step.pressure,
          mixingTime: step.mixingTime,
        })),
        changeReason: '',
        isMajor: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIngredients();
    if (forkId) {
      fetchFormulationForFork(forkId);
    }
  }, [forkId]);

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
    const cleanedIngredients = formData.ingredients.filter(ing => ing.ingredientId !== '');
    try {
      if (forkId) {
        await api.post(`/formulations/${forkId}/version`, {
          changeReason: formData.changeReason || 'Updated formulation parameters',
          ingredients: cleanedIngredients,
          processSteps: formData.processSteps,
          isMajor: formData.isMajor
        });
        router.push(`/formulations/${forkId}`);
      } else {
        await api.post('/formulations', {
          ...formData,
          ingredients: cleanedIngredients
        });
        router.push('/formulations');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted text-foreground">
             <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
           </Button>
           <h1 className="text-3xl font-bold text-foreground">{forkId ? 'Draft Formulation Version' : 'New Formulation Entry'}</h1>
        </div>
        <div className="flex items-center gap-2">
           {[1, 2, 3].map((s) => (
             <div key={s} className={`w-3 h-3 rounded-full ${s === step ? 'bg-blue-600' : 'bg-muted border border-border'}`}></div>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{forkId ? 'New Version Metadata' : 'Basic Configuration'}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {forkId ? 'Define parameters and document changes for the new formulation version.' : 'Setup the core details of the pharmaceutical product.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {forkId ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-foreground">Formulation Name</Label>
                        <Input 
                          className="bg-muted/50 border-border opacity-70 text-foreground"
                          value={formData.name}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Version Bump Type</Label>
                        <select 
                          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={formData.isMajor ? 'true' : 'false'}
                          onChange={(e) => setFormData({...formData, isMajor: e.target.value === 'true'})}
                        >
                          <option value="false" className="bg-card text-foreground">Minor Update (e.g. 1.0 to 1.1)</option>
                          <option value="true" className="bg-card text-foreground">Major Release (e.g. 1.0 to 2.0)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Change Reason / Commit Message</Label>
                      <Input 
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500"
                        placeholder="e.g. Optimized ethanol ratio to reduce mixing time"
                        value={formData.changeReason}
                        onChange={(e) => setFormData({...formData, changeReason: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-foreground">Product Name</Label>
                        <Input 
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500"
                          placeholder="e.g. Paracetamol Extra"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Category</Label>
                        <select 
                          className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="Pharmaceutical" className="bg-card text-foreground">Pharmaceutical</option>
                          <option value="Chemical" className="bg-card text-foreground">Chemical</option>
                          <option value="Research" className="bg-card text-foreground">Research Extra</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-foreground">Default Batch Size</Label>
                        <Input 
                          type="number"
                          className="bg-background border-border text-foreground focus-visible:ring-blue-500"
                          value={formData.batchSize}
                          onChange={(e) => setFormData({...formData, batchSize: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Primary Unit</Label>
                        <Input 
                          className="bg-background border-border text-foreground focus-visible:ring-blue-500"
                          value={formData.unit}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="pt-6 flex justify-end">
                  <Button 
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10" 
                    onClick={() => setStep(2)}
                    disabled={!!(forkId && !formData.changeReason)}
                  >
                    Continue to Composition <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Molecular Composition</CardTitle>
                  <CardDescription className="text-muted-foreground">Add ingredients and define their weight distribution.</CardDescription>
                </div>
                <Button variant="outline" className="hover:bg-muted border-border text-foreground" onClick={addIngredient}>
                  <Plus className="w-4 h-4 mr-2" /> Add Ingredient
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-muted/50 p-4 rounded-xl border border-border">
                    <div className="flex-1 space-y-2">
                      <Label className="text-foreground">Ingredient</Label>
                      <select 
                        className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={ing.ingredientId}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].ingredientId = e.target.value;
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      >
                        <option value="" className="bg-card text-foreground">Select Material...</option>
                        {availableIngredients.map(i => (
                          <option key={i.id} value={i.id} className="bg-card text-foreground">{i.name} ({i.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-foreground">Weight</Label>
                      <Input 
                        type="number"
                        className="bg-background border-border text-foreground focus-visible:ring-blue-500"
                        value={ing.weight}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].weight = Number(e.target.value);
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-foreground">Percentage</Label>
                      <Input 
                        type="number"
                        className="bg-background border-border text-foreground focus-visible:ring-blue-500"
                        value={ing.percentage}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].percentage = Number(e.target.value);
                          setFormData({...formData, ingredients: newIngs});
                        }}
                      />
                    </div>
                    <Button variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeIngredient(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {formData.ingredients.length === 0 && (
                  <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
                     <Beaker className="w-12 h-12 text-muted-foreground opacity-55 mx-auto mb-4" />
                     <p className="text-muted-foreground">Add the first ingredient to start the composition.</p>
                  </div>
                )}

                <div className="pt-6 flex justify-between">
                   <Button variant="ghost" onClick={() => setStep(1)} className="hover:bg-muted text-foreground">Back</Button>
                   <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10" onClick={() => setStep(3)}>
                     Continue to Process <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Manufacturing Process</CardTitle>
                  <CardDescription className="text-muted-foreground">Define chronological steps and operational parameters.</CardDescription>
                </div>
                <Button variant="outline" className="hover:bg-muted border-border text-foreground" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.processSteps.map((stepData, idx) => (
                  <div key={idx} className="bg-muted/50 p-6 rounded-xl border border-border space-y-4 relative">
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-600/20">
                       {idx + 1}
                    </div>
                    <div className="pl-10 space-y-2">
                       <Label className="text-foreground">Step Description</Label>
                       <Input 
                         className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500" 
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
                          <Label className="text-foreground">Temp (°C)</Label>
                          <Input type="number" className="bg-background border-border text-foreground focus-visible:ring-blue-500" value={stepData.temperature} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].temperature = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-foreground">Pressure (Bar)</Label>
                          <Input type="number" className="bg-background border-border text-foreground focus-visible:ring-blue-500" value={stepData.pressure} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].pressure = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-foreground">Time (min)</Label>
                          <Input type="number" className="bg-background border-border text-foreground focus-visible:ring-blue-500" value={stepData.mixingTime} onChange={(e) => {
                             const newSteps = [...formData.processSteps];
                             newSteps[idx].mixingTime = Number(e.target.value);
                             setFormData({...formData, processSteps: newSteps});
                          }} />
                       </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 flex justify-between">
                   <Button variant="ghost" onClick={() => setStep(2)} className="hover:bg-muted text-foreground">Back</Button>
                   <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10" onClick={handleSubmit}>
                     Save & Create Version {forkId ? 'Update' : 'v1.0'} <Check className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </CardContent>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );;
}

const Check = ({className}: {className?: string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)


import React from 'react';
import { ProposalData, Milestone, Resource } from '../types';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar as CalendarIcon, Link as LinkIcon, Lock, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ProposalEditorProps {
  data: ProposalData;
  onUpdate: (data: ProposalData) => void;
}

export const ProposalEditor: React.FC<ProposalEditorProps> = ({ data, onUpdate }) => {
  
  const handleInputChange = (field: keyof ProposalData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleValueBulletChange = (index: number, value: string) => {
    const newBullets = [...(data.valueBullets || [])];
    newBullets[index] = value;
    onUpdate({ ...data, valueBullets: newBullets });
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: any) => {
    const newMilestones = [...data.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    onUpdate({ ...data, milestones: newMilestones });
  };

  const addMilestone = () => {
    if (data.milestones.length >= 5) return;
    const newMilestone: Milestone = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      title: "New Milestone",
      description: "Description",
      owner: "prospect",
      completed: false
    };
    onUpdate({ ...data, milestones: [...data.milestones, newMilestone] });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = data.milestones.filter((_, i) => i !== index);
    onUpdate({ ...data, milestones: newMilestones });
  };

  const handleResourceChange = (index: number, field: keyof Resource, value: string) => {
    const newResources = [...(data.resources || [])];
    newResources[index] = { ...newResources[index], [field]: value };
    onUpdate({ ...data, resources: newResources });
  };

  const addResource = () => {
    if ((data.resources || []).length >= 3) return;
    const newResource: Resource = { title: "New Resource", url: "https://" };
    onUpdate({ ...data, resources: [...(data.resources || []), newResource] });
  };

  const removeResource = (index: number) => {
    const newResources = (data.resources || []).filter((_, i) => i !== index);
    onUpdate({ ...data, resources: newResources });
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white border-r border-gray-200">
      <h2 className="text-lg font-bold mb-6 text-gray-900">Customize Proposal</h2>
      
      <div className="space-y-6">
        {/* General Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-500">Deal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prospectName">Prospect Name</Label>
              <Input 
                id="prospectName" 
                value={data.prospectName} 
                onChange={(e) => handleInputChange('prospectName', e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerLogo">Customer Logo</Label>
              <div className="flex gap-2">
                 <Input 
                   id="customerLogo" 
                   value={data.customerLogoUrl || ''} 
                   onChange={(e) => handleInputChange('customerLogoUrl', e.target.value)} 
                   placeholder="https://... or upload"
                 />
                 <div className="relative w-10 overflow-hidden">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 500000) {
                             alert("File is too large. Please use a smaller image or a URL to prevent share link errors.");
                             return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleInputChange('customerLogoUrl', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button variant="outline" size="icon" className="w-full">
                       <Upload className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
              <p className="text-[10px] text-gray-400">
                 Use a public URL or upload a small image (max 500KB).
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseFee">License Fee</Label>
              <Input 
                id="licenseFee" 
                type="number" 
                value={data.licenseFee} 
                onChange={(e) => handleInputChange('licenseFee', Number(e.target.value))} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelType">Model Type</Label>
              <Input 
                id="modelType" 
                value={data.modelType || ''} 
                onChange={(e) => handleInputChange('modelType', e.target.value)}
                placeholder="e.g. Llama 3 70B"
              />
            </div>

            <div className="space-y-2">
              <Label>Activation Milestones (Upper Right Box)</Label>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <Input 
                    key={i}
                    value={data.valueBullets?.[i] || ''}
                    onChange={(e) => handleValueBulletChange(i, e.target.value)}
                    placeholder={`Bullet Point ${i + 1}`}
                  />
                ))}
              </div>
            </div>
 
             <div className="space-y-2">
              <Label htmlFor="repName">Rep Name</Label>
              <Input 
                id="repName" 
                value={data.repName} 
                onChange={(e) => handleInputChange('repName', e.target.value)} 
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="repEmail">Rep Email</Label>
              <Input 
                id="repEmail" 
                value={data.repEmail} 
                onChange={(e) => handleInputChange('repEmail', e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendlyUrl">Calendly / Meeting URL</Label>
              <Input 
                id="calendlyUrl" 
                value={data.calendlyUrl || ''} 
                onChange={(e) => handleInputChange('calendlyUrl', e.target.value)}
                placeholder="https://calendly.com/your-link"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader className="pb-3">
             <CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-500">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             {/* Expiration Date */}
             <div className="space-y-2">
               <Label htmlFor="validUntil">Offer Valid Until</Label>
               <Input 
                 type="date" 
                 id="validUntil"
                 value={data.validUntil ? format(data.validUntil, 'yyyy-MM-dd') : ''}
                 onChange={(e) => handleInputChange('validUntil', new Date(e.target.value))} 
               />
             </div>

             {/* Password Protection */}
             <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                   <Lock className="w-4 h-4 text-gray-500" />
                   <Label htmlFor="password-mode" className="font-medium cursor-pointer">Password Protection</Label>
                </div>
                <Switch 
                  id="password-mode"
                  checked={data.passwordProtection}
                  onCheckedChange={(checked) => handleInputChange('passwordProtection', checked)}
                />
             </div>
             {data.passwordProtection && (
                <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                   When enabled, visitors must enter "{data.prospectName}" to view the proposal.
                </p>
             )}

             {/* Resources */}
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <Label>Resources (Below Hero)</Label>
                   <span className="text-xs text-gray-400">{(data.resources || []).length}/3</span>
                </div>
                
                {(data.resources || []).map((resource, index) => (
                   <div key={index} className="space-y-2 p-3 border rounded-lg bg-gray-50 relative">
                       <button 
                         onClick={() => removeResource(index)}
                         className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                       <Input 
                         value={resource.title}
                         onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                         placeholder="Resource Title"
                         className="h-8 text-sm"
                       />
                       <Input 
                         value={resource.url}
                         onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                         placeholder="https://..."
                         className="h-8 text-sm text-gray-500"
                       />
                   </div>
                ))}

                {(data.resources || []).length < 3 && (
                   <Button onClick={addResource} variant="outline" size="sm" className="w-full">
                      <Plus className="w-3 h-3 mr-2" /> Add Resource
                   </Button>
                )}
             </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-gray-500">Timeline</CardTitle>
            <span className="text-xs text-gray-400">{data.milestones.length}/5</span>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative pl-4 border-l-2 border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Step {index + 1}</span>
                  <button 
                    onClick={() => removeMilestone(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <Input 
                    value={milestone.title} 
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    className="font-semibold"
                    placeholder="Milestone Title"
                  />
                  <Input 
                    value={milestone.description} 
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    className="text-sm text-gray-500"
                    placeholder="Description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Date</Label>
                    <Input 
                      type="date" 
                      value={format(milestone.date, 'yyyy-MM-dd')}
                      onChange={(e) => handleMilestoneChange(index, 'date', new Date(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-xs text-gray-500">Owner</Label>
                     <Select 
                      value={milestone.owner} 
                      onValueChange={(val: 'protopia' | 'prospect') => handleMilestoneChange(index, 'owner', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="protopia">Protopia</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            {data.milestones.length < 5 && (
              <Button 
                onClick={addMilestone} 
                variant="outline" 
                className="w-full border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Milestone
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

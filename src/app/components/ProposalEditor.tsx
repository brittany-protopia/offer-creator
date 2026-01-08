
import React from 'react';
import { ProposalData, Milestone } from '../types';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
              <Label>Value Highlights (Upper Right Box)</Label>
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


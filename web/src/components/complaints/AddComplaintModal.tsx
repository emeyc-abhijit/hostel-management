import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Wrench, Zap, Droplets, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplaintFormData {
  category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  roomNumber: string;
}

interface AddComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (complaint: ComplaintFormData) => void;
  studentName: string;
  defaultRoom?: string;
}

const categoryIcons = {
  maintenance: Wrench,
  electrical: Zap,
  plumbing: Droplets,
  cleanliness: Sparkles,
  other: MessageSquare,
};

const categoryColors = {
  maintenance: 'text-primary border-primary',
  electrical: 'text-warning border-warning',
  plumbing: 'text-info border-info',
  cleanliness: 'text-success border-success',
  other: 'text-muted-foreground border-muted-foreground',
};

export function AddComplaintModal({ open, onOpenChange, onAdd, studentName, defaultRoom }: AddComplaintModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: 'maintenance',
    subject: '',
    description: '',
    priority: 'medium',
    roomNumber: defaultRoom || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description || !formData.roomNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onAdd(formData);
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been registered. We'll look into it soon.",
    });
    onOpenChange(false);
    
    // Reset form
    setFormData({
      category: 'maintenance',
      subject: '',
      description: '',
      priority: 'medium',
      roomNumber: defaultRoom || '',
    });
  };

  const CategoryIcon = categoryIcons[formData.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Submit New Complaint
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="grid grid-cols-5 gap-2">
              {(['maintenance', 'electrical', 'plumbing', 'cleanliness', 'other'] as const).map((cat) => {
                const Icon = categoryIcons[cat];
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                      isSelected 
                        ? cn("bg-primary/10", categoryColors[cat])
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isSelected ? categoryColors[cat].split(' ')[0] : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-xs font-medium capitalize",
                      isSelected ? "text-card-foreground" : "text-muted-foreground"
                    )}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Number */}
          <div className="space-y-2">
            <Label htmlFor="roomNumber">Room Number *</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              placeholder="e.g., 204"
              required
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about the issue..."
              rows={4}
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all capitalize",
                    formData.priority === priority
                      ? priority === 'high' 
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : priority === 'medium'
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-muted-foreground bg-muted text-muted-foreground"
                      : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.priority === 'high' && "Urgent issues requiring immediate attention"}
              {formData.priority === 'medium' && "Issues that need to be resolved within a few days"}
              {formData.priority === 'low' && "Minor issues that can be addressed during routine maintenance"}
            </p>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                formData.category === 'electrical' ? 'bg-warning/10' 
                : formData.category === 'plumbing' ? 'bg-info/10'
                : formData.category === 'cleanliness' ? 'bg-success/10'
                : 'bg-primary/10'
              )}>
                <CategoryIcon className={cn("h-5 w-5", categoryColors[formData.category].split(' ')[0])} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-card-foreground">{formData.subject || 'Issue Subject'}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Room {formData.roomNumber || '---'} • {studentName}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              <Plus className="h-4 w-4" />
              Submit Complaint
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Bell, AlertTriangle, Info, PartyPopper, Wrench } from 'lucide-react';

interface NoticeFormData {
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
  targetAudience: 'all' | 'boys' | 'girls' | 'specific';
  targetHostel?: string;
  hasExpiry: boolean;
  expiresAt?: string;
  isPinned: boolean;
}

interface AddNoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (notice: NoticeFormData) => void;
  hostels: string[];
  postedBy: string;
}

const categoryIcons = {
  general: Info,
  urgent: AlertTriangle,
  event: PartyPopper,
  maintenance: Wrench,
};

export function AddNoticeModal({ open, onOpenChange, onAdd, hostels, postedBy }: AddNoticeModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    content: '',
    category: 'general',
    targetAudience: 'all',
    hasExpiry: false,
    isPinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in the title and content.",
        variant: "destructive",
      });
      return;
    }

    if (formData.hasExpiry && !formData.expiresAt) {
      toast({
        title: "Validation Error",
        description: "Please set an expiry date.",
        variant: "destructive",
      });
      return;
    }

    onAdd(formData);
    toast({
      title: "Notice Posted",
      description: "Your notice has been published successfully.",
    });
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      content: '',
      category: 'general',
      targetAudience: 'all',
      hasExpiry: false,
      isPinned: false,
    });
  };

  const CategoryIcon = categoryIcons[formData.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Post New Notice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notice title"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="grid grid-cols-4 gap-2">
              {(['general', 'urgent', 'event', 'maintenance'] as const).map((cat) => {
                const Icon = categoryIcons[cat];
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? cat === 'urgent' ? 'border-destructive bg-destructive/10' 
                        : cat === 'event' ? 'border-success bg-success/10'
                        : cat === 'maintenance' ? 'border-warning bg-warning/10'
                        : 'border-info bg-info/10'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      isSelected
                        ? cat === 'urgent' ? 'text-destructive'
                        : cat === 'event' ? 'text-success'
                        : cat === 'maintenance' ? 'text-warning'
                        : 'text-info'
                        : 'text-muted-foreground'
                    }`} />
                    <span className={`text-xs font-medium capitalize ${isSelected ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your notice content here..."
              rows={5}
              required
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Select 
              value={formData.targetAudience} 
              onValueChange={(value: 'all' | 'boys' | 'girls' | 'specific') => 
                setFormData({ ...formData, targetAudience: value, targetHostel: undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hostels</SelectItem>
                <SelectItem value="boys">Boys Hostels Only</SelectItem>
                <SelectItem value="girls">Girls Hostels Only</SelectItem>
                <SelectItem value="specific">Specific Hostel</SelectItem>
              </SelectContent>
            </Select>
            {formData.targetAudience === 'specific' && (
              <Select 
                value={formData.targetHostel} 
                onValueChange={(value) => setFormData({ ...formData, targetHostel: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select hostel" />
                </SelectTrigger>
                <SelectContent>
                  {hostels.map((hostel) => (
                    <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hasExpiry">Set Expiry Date</Label>
                <p className="text-xs text-muted-foreground">Notice will be hidden after expiry</p>
              </div>
              <Switch
                id="hasExpiry"
                checked={formData.hasExpiry}
                onCheckedChange={(checked) => setFormData({ ...formData, hasExpiry: checked, expiresAt: undefined })}
              />
            </div>
            {formData.hasExpiry && (
              <Input
                type="date"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            )}
          </div>

          {/* Pin Notice */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div>
              <Label htmlFor="isPinned" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Pin this Notice
              </Label>
              <p className="text-xs text-muted-foreground">Pinned notices appear at the top</p>
            </div>
            <Switch
              id="isPinned"
              checked={formData.isPinned}
              onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
            />
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                formData.category === 'urgent' ? 'bg-destructive/10' 
                : formData.category === 'event' ? 'bg-success/10'
                : formData.category === 'maintenance' ? 'bg-warning/10'
                : 'bg-info/10'
              }`}>
                <CategoryIcon className={`h-5 w-5 ${
                  formData.category === 'urgent' ? 'text-destructive'
                  : formData.category === 'event' ? 'text-success'
                  : formData.category === 'maintenance' ? 'text-warning'
                  : 'text-info'
                }`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-card-foreground">{formData.title || 'Notice Title'}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {formData.content || 'Notice content will appear here...'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  By: {postedBy}
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
              Post Notice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

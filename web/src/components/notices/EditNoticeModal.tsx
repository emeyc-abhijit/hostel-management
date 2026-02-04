import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, AlertTriangle, Info, PartyPopper, Wrench } from 'lucide-react';

interface NoticeData {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
  targetAudience: 'all' | 'boys' | 'girls' | 'specific';
  targetHostel?: string;
  postedBy: string;
  postedAt: string;
  expiresAt?: string;
  isPinned: boolean;
}

interface EditNoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: NoticeData | null;
  onUpdate: (notice: NoticeData) => void;
  onDelete: (noticeId: string) => void;
  hostels: string[];
}

const categoryIcons = {
  general: Info,
  urgent: AlertTriangle,
  event: PartyPopper,
  maintenance: Wrench,
};

export function EditNoticeModal({ open, onOpenChange, notice, onUpdate, onDelete, hostels }: EditNoticeModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NoticeData | null>(null);

  useEffect(() => {
    if (notice) {
      setFormData({ ...notice });
    }
  }, [notice]);

  if (!formData) return null;

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

    onUpdate(formData);
    toast({
      title: "Notice Updated",
      description: "Your notice has been updated successfully.",
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(formData.id);
    toast({
      title: "Notice Deleted",
      description: "The notice has been removed.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Edit Notice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
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
            <Label htmlFor="edit-content">Content *</Label>
            <Textarea
              id="edit-content"
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
                <Label htmlFor="edit-hasExpiry">Set Expiry Date</Label>
                <p className="text-xs text-muted-foreground">Notice will be hidden after expiry</p>
              </div>
              <Switch
                id="edit-hasExpiry"
                checked={!!formData.expiresAt}
                onCheckedChange={(checked) => setFormData({ ...formData, expiresAt: checked ? '' : undefined })}
              />
            </div>
            {formData.expiresAt !== undefined && (
              <Input
                type="date"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            )}
          </div>

          {/* Pin Notice */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div>
              <Label htmlFor="edit-isPinned">Pin this Notice</Label>
              <p className="text-xs text-muted-foreground">Pinned notices appear at the top</p>
            </div>
            <Switch
              id="edit-isPinned"
              checked={formData.isPinned}
              onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked })}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this notice. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Notice
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              <Edit className="h-4 w-4" />
              Update Notice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

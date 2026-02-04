import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, User } from 'lucide-react';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintId: string;
  complaintSubject: string;
  onAdd: (complaintId: string, note: string, assignTo?: string) => void;
  staffMembers: string[];
  currentAssignee?: string;
}

export function AddNoteModal({ 
  open, 
  onOpenChange, 
  complaintId, 
  complaintSubject,
  onAdd,
  staffMembers,
  currentAssignee
}: AddNoteModalProps) {
  const { toast } = useToast();
  const [note, setNote] = useState('');
  const [assignTo, setAssignTo] = useState(currentAssignee || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note.",
        variant: "destructive",
      });
      return;
    }

    onAdd(complaintId, note, assignTo || undefined);
    toast({
      title: "Note Added",
      description: "Your note has been added to the complaint.",
    });
    onOpenChange(false);
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Add Note
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Complaint Reference */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground">Complaint</p>
            <p className="font-medium text-card-foreground mt-1">{complaintSubject}</p>
            <p className="text-xs text-muted-foreground mt-1">Ticket #{complaintId.padStart(4, '0')}</p>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note *</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an update, action taken, or any relevant information..."
              rows={4}
              required
            />
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Assign To (Optional)
            </Label>
            <Select value={assignTo} onValueChange={setAssignTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              <MessageSquare className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ApplicationData {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  preferredHostel: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

interface RejectApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationData | null;
  onReject: (applicationId: string, reason: string, notes: string) => void;
}

const rejectionReasons = [
  'Incomplete documentation',
  'Invalid student credentials',
  'No available rooms',
  'Academic standing not met',
  'Outstanding fee dues',
  'Disciplinary issues',
  'Duplicate application',
  'Other',
];

export function RejectApplicationModal({ 
  open, 
  onOpenChange, 
  application, 
  onReject 
}: RejectApplicationModalProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!application) return null;

  const handleReject = () => {
    if (!reason) {
      toast({
        title: "Reason Required",
        description: "Please select a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    onReject(application.id, reason, notes);
    toast({
      title: "Application Rejected",
      description: `${application.studentName}'s application has been rejected.`,
    });
    onOpenChange(false);
    setReason('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <X className="h-5 w-5" />
            Reject Application
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">
                This action cannot be undone
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The student will be notified of the rejection and the reason provided.
              </p>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <Avatar className="h-12 w-12 border-2 border-destructive/20">
              <AvatarFallback className="bg-destructive/10 text-destructive font-semibold">
                {application.studentName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{application.studentName}</h3>
              <p className="text-sm text-muted-foreground">
                {application.course} • Year {application.year}
              </p>
            </div>
          </div>

          {/* Rejection Reason */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Rejection Reason *
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason for rejection" />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="reject-notes">Additional Notes (Optional)</Label>
            <Textarea
              id="reject-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide additional details about the rejection..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} className="flex-1">
              <X className="h-4 w-4" />
              Reject Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

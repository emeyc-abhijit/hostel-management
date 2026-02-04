import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Calendar,
  Clock,
  User,
  BedDouble,
  AlertCircle,
  CheckCircle,
  Wrench,
  Zap,
  Droplets,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplaintNote {
  id: string;
  text: string;
  addedBy: string;
  addedAt: string;
}

interface ComplaintData {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  roomNumber: string;
  hostel?: string;
  category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  notes?: ComplaintNote[];
}

interface ComplaintDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: ComplaintData | null;
  onUpdateStatus: (status: 'open' | 'in-progress' | 'resolved' | 'closed') => void;
  onAddNote: () => void;
  canManage: boolean;
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border', icon: CheckCircle },
};

const categoryConfig = {
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'bg-primary/10 text-primary' },
  electrical: { label: 'Electrical', icon: Zap, color: 'bg-warning/10 text-warning' },
  plumbing: { label: 'Plumbing', icon: Droplets, color: 'bg-info/10 text-info' },
  cleanliness: { label: 'Cleanliness', icon: Sparkles, color: 'bg-success/10 text-success' },
  other: { label: 'Other', icon: MessageSquare, color: 'bg-muted text-muted-foreground' },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground border-border' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning border-warning/20' },
  high: { label: 'High', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export function ComplaintDetailsModal({ 
  open, 
  onOpenChange, 
  complaint, 
  onUpdateStatus,
  onAddNote,
  canManage 
}: ComplaintDetailsModalProps) {
  if (!complaint) return null;

  const StatusIcon = statusConfig[complaint.status].icon;
  const CategoryIcon = categoryConfig[complaint.category].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Complaint Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Status Banner */}
          <div className={cn(
            "flex items-center justify-between p-4 rounded-lg border",
            complaint.status === 'open' && "bg-destructive/5 border-destructive/20",
            complaint.status === 'in-progress' && "bg-warning/5 border-warning/20",
            complaint.status === 'resolved' && "bg-success/5 border-success/20",
            complaint.status === 'closed' && "bg-muted border-border"
          )}>
            <div className="flex items-center gap-3">
              <StatusIcon className={cn(
                "h-6 w-6",
                complaint.status === 'open' && "text-destructive",
                complaint.status === 'in-progress' && "text-warning",
                complaint.status === 'resolved' && "text-success",
                complaint.status === 'closed' && "text-muted-foreground"
              )} />
              <div>
                <p className="font-medium text-card-foreground">
                  {statusConfig[complaint.status].label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ticket #{complaint.id.padStart(4, '0')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={cn(categoryConfig[complaint.category].color)}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {categoryConfig[complaint.category].label}
              </Badge>
              <Badge className={cn(priorityConfig[complaint.priority].color)}>
                {priorityConfig[complaint.priority].label}
              </Badge>
            </div>
          </div>

          {/* Subject & Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-card-foreground">{complaint.subject}</h3>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Student & Location Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Reported By
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {complaint.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-card-foreground">{complaint.studentName}</p>
                  {complaint.studentEmail && (
                    <p className="text-xs text-muted-foreground">{complaint.studentEmail}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BedDouble className="h-4 w-4" />
                Location
              </div>
              <div>
                <p className="font-medium text-card-foreground">Room {complaint.roomNumber}</p>
                {complaint.hostel && (
                  <p className="text-sm text-muted-foreground">{complaint.hostel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                Reported On
              </div>
              <p className="font-medium text-card-foreground">
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {complaint.resolvedAt && (
              <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                <div className="flex items-center gap-2 text-sm text-success mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Resolved On
                </div>
                <p className="font-medium text-card-foreground">
                  {new Date(complaint.resolvedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Assigned To */}
          {complaint.assignedTo && (
            <div className="p-4 rounded-lg border bg-info/5 border-info/20">
              <div className="flex items-center gap-2 text-sm text-info mb-2">
                <User className="h-4 w-4" />
                Assigned To
              </div>
              <p className="font-medium text-card-foreground">{complaint.assignedTo}</p>
            </div>
          )}

          {/* Notes */}
          {complaint.notes && complaint.notes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Activity Notes
              </h4>
              <div className="space-y-2">
                {complaint.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border bg-muted/30">
                    <p className="text-sm text-card-foreground">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {note.addedBy} • {new Date(note.addedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {canManage && complaint.status !== 'closed' && (
              <>
                {complaint.status === 'open' && (
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateStatus('in-progress')}
                    className="flex-1"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Mark In Progress
                  </Button>
                )}
                {complaint.status === 'in-progress' && (
                  <Button 
                    variant="success" 
                    onClick={() => onUpdateStatus('resolved')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Resolved
                  </Button>
                )}
                {complaint.status === 'resolved' && (
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateStatus('closed')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Close Ticket
                  </Button>
                )}
                <Button variant="ghost" onClick={onAddNote}>
                  <MessageSquare className="h-4 w-4" />
                  Add Note
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} className={cn(!canManage && "w-full")}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

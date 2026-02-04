import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  BedDouble,
  FileText,
  Clock,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationData {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  preferredHostel: string;
  alternateHostel?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  notes?: string;
  documents?: string[];
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  reason?: string;
}

interface ApplicationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationData | null;
  onApprove: () => void;
  onReject: () => void;
}

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-success/10 text-success border-success/20', icon: Check },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: X },
};

export function ApplicationDetailsModal({ 
  open, 
  onOpenChange, 
  application, 
  onApprove, 
  onReject 
}: ApplicationDetailsModalProps) {
  if (!application) return null;

  const StatusIcon = statusConfig[application.status].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Application Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Status Banner */}
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-lg border",
            application.status === 'pending' && "bg-warning/5 border-warning/20",
            application.status === 'approved' && "bg-success/5 border-success/20",
            application.status === 'rejected' && "bg-destructive/5 border-destructive/20"
          )}>
            <StatusIcon className={cn(
              "h-6 w-6",
              application.status === 'pending' && "text-warning",
              application.status === 'approved' && "text-success",
              application.status === 'rejected' && "text-destructive"
            )} />
            <div className="flex-1">
              <p className="font-medium text-card-foreground">
                {statusConfig[application.status].label}
              </p>
              <p className="text-sm text-muted-foreground">
                Applied on {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
            </div>
            <Badge className={cn(statusConfig[application.status].color)}>
              {statusConfig[application.status].label}
            </Badge>
          </div>

          {/* Applicant Information */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
            <Avatar className="h-16 w-16 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {application.studentName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground">{application.studentName}</h3>
              <p className="text-sm text-muted-foreground">
                {application.course} • Year {application.year}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Application ID: APP-{application.id.padStart(4, '0')}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-card">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {application.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {application.phone}
                </p>
              </div>
              {application.address && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{application.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Academic Information
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-card">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Course</p>
                <p className="text-sm font-medium">{application.course}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Year</p>
                <p className="text-sm font-medium">Year {application.year}</p>
              </div>
            </div>
          </div>

          {/* Hostel Preferences */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              Hostel Preferences
            </h4>
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-card">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Preferred Hostel</p>
                <p className="text-sm font-medium">{application.preferredHostel}</p>
              </div>
              {application.alternateHostel && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Alternate Hostel</p>
                  <p className="text-sm">{application.alternateHostel}</p>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          {(application.guardianName || application.guardianPhone) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Guardian Information
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-card">
                {application.guardianName && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Guardian Name</p>
                    <p className="text-sm">{application.guardianName}</p>
                  </div>
                )}
                {application.guardianPhone && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Guardian Phone</p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {application.guardianPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Reason */}
          {application.reason && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Reason for Application
              </h4>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">{application.reason}</p>
              </div>
            </div>
          )}

          {/* Admin Notes (if rejected) */}
          {application.notes && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Admin Notes
              </h4>
              <div className="p-4 rounded-lg border bg-destructive/5 border-destructive/20">
                <p className="text-sm text-destructive">{application.notes}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            {application.status === 'pending' ? (
              <>
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={onReject}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="success" 
                  className="flex-1"
                  onClick={onApprove}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Complaint } from '@/types';
import { ComplaintWorkflow } from './ComplaintWorkflow';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';

interface ComplaintDetailDialogProps {
  complaint: Complaint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDetailDialog({ complaint, open, onOpenChange }: ComplaintDetailDialogProps) {
  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'open':
        return 'bg-destructive text-destructive-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-destructive text-destructive';
      case 'high':
        return 'border-warning text-warning';
      case 'medium':
        return 'border-info text-info';
      case 'low':
        return 'border-muted-foreground text-muted-foreground';
      default:
        return 'border-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{complaint.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
              {complaint.priority}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {complaint.category}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Submitted by</p>
                <p className="font-medium">{complaint.studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Created on</p>
                <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {complaint.assignedTo && (
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Assigned to</p>
                  <p className="font-medium">{complaint.assignedTo}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-medium">{new Date(complaint.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{complaint.description}</p>
          </div>

          <div className="border-t pt-4">
            <ComplaintWorkflow complaint={complaint} />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">Complaint Created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {complaint.wardenReviewedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="text-sm font-medium">Reviewed by Warden</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.wardenReviewedBy} • {new Date(complaint.wardenReviewedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {complaint.adminReviewedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="text-sm font-medium">Reviewed by Admin</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.adminReviewedBy} • {new Date(complaint.adminReviewedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {complaint.higherManagementReviewedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="text-sm font-medium">Reviewed by Higher Management</p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.higherManagementReviewedBy} • {new Date(complaint.higherManagementReviewedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

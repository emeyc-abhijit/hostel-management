import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Calendar,
  User,
  Clock,
  Pin,
  Users,
  AlertTriangle,
  Info,
  PartyPopper,
  Wrench,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface NoticeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: NoticeData | null;
  onEdit: () => void;
  canEdit: boolean;
}

const categoryConfig = {
  general: { label: 'General', icon: Info, color: 'bg-info/10 text-info border-info/20', bgColor: 'bg-info/5' },
  urgent: { label: 'Urgent', icon: AlertTriangle, color: 'bg-destructive/10 text-destructive border-destructive/20', bgColor: 'bg-destructive/5' },
  event: { label: 'Event', icon: PartyPopper, color: 'bg-success/10 text-success border-success/20', bgColor: 'bg-success/5' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'bg-warning/10 text-warning border-warning/20', bgColor: 'bg-warning/5' },
};

const audienceLabels = {
  all: 'All Hostels',
  boys: 'Boys Hostels Only',
  girls: 'Girls Hostels Only',
  specific: 'Specific Hostel',
};

export function NoticeDetailsModal({ open, onOpenChange, notice, onEdit, canEdit }: NoticeDetailsModalProps) {
  if (!notice) return null;

  const config = categoryConfig[notice.category];
  const CategoryIcon = config.icon;
  const isExpired = notice.expiresAt && new Date(notice.expiresAt) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notice Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Header with Category */}
          <div className={cn("p-4 rounded-xl", config.bgColor)}>
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                notice.category === 'urgent' && 'bg-destructive/20',
                notice.category === 'event' && 'bg-success/20',
                notice.category === 'maintenance' && 'bg-warning/20',
                notice.category === 'general' && 'bg-info/20'
              )}>
                <CategoryIcon className={cn(
                  "h-7 w-7",
                  notice.category === 'urgent' && 'text-destructive',
                  notice.category === 'event' && 'text-success',
                  notice.category === 'maintenance' && 'text-warning',
                  notice.category === 'general' && 'text-info'
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn(config.color)}>
                    {config.label}
                  </Badge>
                  {notice.isPinned && (
                    <Badge variant="outline" className="gap-1">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mt-2">
                  {notice.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-card-foreground">Notice Content</h4>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {notice.content}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Posted by:</span>
              </div>
              <p className="font-medium text-card-foreground">{notice.postedBy}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Posted on:</span>
              </div>
              <p className="font-medium text-card-foreground">
                {new Date(notice.postedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Target Audience:</span>
              </div>
              <p className="font-medium text-card-foreground">
                {notice.targetAudience === 'specific' && notice.targetHostel 
                  ? notice.targetHostel 
                  : audienceLabels[notice.targetAudience]}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
              </div>
              <p className={cn(
                "font-medium",
                isExpired ? "text-destructive" : "text-card-foreground"
              )}>
                {notice.expiresAt 
                  ? new Date(notice.expiresAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No expiry date'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {canEdit && (
              <Button variant="hero" onClick={onEdit}>
                <Edit className="h-4 w-4" />
                Edit Notice
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

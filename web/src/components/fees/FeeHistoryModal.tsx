import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeeHistoryEntry {
  id: string;
  action: 'added' | 'edited' | 'deleted';
  category: string;
  previousAmount?: number;
  newAmount?: number;
  changedBy: string;
  changedAt: string;
  details?: string;
}

interface FeeHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: FeeHistoryEntry[];
}

const actionConfig = {
  added: { 
    label: 'Added', 
    color: 'bg-success/10 text-success border-success/20', 
    icon: Plus 
  },
  edited: { 
    label: 'Edited', 
    color: 'bg-primary/10 text-primary border-primary/20', 
    icon: Pencil 
  },
  deleted: { 
    label: 'Deleted', 
    color: 'bg-destructive/10 text-destructive border-destructive/20', 
    icon: Trash2 
  },
};

export function FeeHistoryModal({ open, onOpenChange, history }: FeeHistoryModalProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Fee Structure Change History
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No changes recorded yet</p>
              <p className="text-sm">Changes to the fee structure will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => {
                const ActionIcon = actionConfig[entry.action].icon;
                return (
                  <div 
                    key={entry.id} 
                    className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      "rounded-lg p-2 h-fit",
                      entry.action === 'added' && "bg-success/10",
                      entry.action === 'edited' && "bg-primary/10",
                      entry.action === 'deleted' && "bg-destructive/10"
                    )}>
                      <ActionIcon className={cn(
                        "h-4 w-4",
                        entry.action === 'added' && "text-success",
                        entry.action === 'edited' && "text-primary",
                        entry.action === 'deleted' && "text-destructive"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{entry.category}</span>
                        <Badge className={cn('text-xs', actionConfig[entry.action].color)}>
                          {actionConfig[entry.action].label}
                        </Badge>
                      </div>
                      
                      {entry.action === 'edited' && entry.previousAmount !== undefined && entry.newAmount !== undefined && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Amount changed from{' '}
                          <span className="font-medium text-foreground">₹{entry.previousAmount.toLocaleString()}</span>
                          {' → '}
                          <span className="font-medium text-foreground">₹{entry.newAmount.toLocaleString()}</span>
                        </p>
                      )}
                      
                      {entry.action === 'added' && entry.newAmount !== undefined && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Added with amount{' '}
                          <span className="font-medium text-foreground">₹{entry.newAmount.toLocaleString()}</span>
                        </p>
                      )}
                      
                      {entry.action === 'deleted' && entry.previousAmount !== undefined && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Removed (was{' '}
                          <span className="font-medium text-foreground">₹{entry.previousAmount.toLocaleString()}</span>)
                        </p>
                      )}

                      {entry.details && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>by {entry.changedBy}</span>
                        <span>•</span>
                        <span>{formatDate(entry.changedAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

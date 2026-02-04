import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface DeleteFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: FeeStructure | null;
  onConfirm: (feeId: string) => void;
}

export function DeleteFeeModal({ open, onOpenChange, fee, onConfirm }: DeleteFeeModalProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    if (fee) {
      onConfirm(fee.id);
      onOpenChange(false);
      toast({
        title: 'Fee Category Deleted',
        description: `${fee.category} has been removed from the fee structure.`,
        variant: 'destructive',
      });
    }
  };

  if (!fee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Fee Category
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{fee.category}</span> (₹{fee.amount.toLocaleString()}) from the fee structure?
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

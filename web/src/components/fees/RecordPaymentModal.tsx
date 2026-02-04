import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, IndianRupee, Calendar, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  semester: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  transactionId?: string;
  paymentMethod?: string;
}

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
  onSubmit: (data: {
    paymentId: string;
    transactionId: string;
    paymentMethod: string;
    paidAmount: number;
    paidDate: string;
    notes: string;
  }) => void;
}

export function RecordPaymentModal({ open, onOpenChange, payment, onSubmit }: RecordPaymentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    transactionId: '',
    paymentMethod: '',
    paidAmount: payment?.amount.toString() || '',
    paidDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.transactionId.trim()) {
      toast({ title: 'Error', description: 'Transaction ID is required', variant: 'destructive' });
      return;
    }
    if (!formData.paymentMethod) {
      toast({ title: 'Error', description: 'Payment method is required', variant: 'destructive' });
      return;
    }
    if (!formData.paidAmount || parseFloat(formData.paidAmount) <= 0) {
      toast({ title: 'Error', description: 'Valid amount is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({
      paymentId: payment?.id || '',
      transactionId: formData.transactionId,
      paymentMethod: formData.paymentMethod,
      paidAmount: parseFloat(formData.paidAmount),
      paidDate: formData.paidDate,
      notes: formData.notes,
    });

    toast({ title: 'Success', description: 'Payment recorded successfully' });
    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({
      transactionId: '',
      paymentMethod: '',
      paidAmount: '',
      paidDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Info */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="font-semibold">{payment.studentName}</p>
            <p className="text-sm text-muted-foreground">{payment.semester}</p>
            <p className="text-lg font-bold text-primary">₹{payment.amount.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Transaction ID *
            </Label>
            <Input
              id="transactionId"
              placeholder="Enter transaction ID"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method *
            </Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer (NEFT/RTGS)</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paidAmount" className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Amount (₹) *
              </Label>
              <Input
                id="paidAmount"
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payment Date *
              </Label>
              <Input
                id="paidDate"
                type="date"
                value={formData.paidDate}
                onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

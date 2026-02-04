import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Receipt, 
  Download, 
  Printer, 
  CheckCircle, 
  Building2, 
  User, 
  Calendar,
  Hash,
  CreditCard,
  IndianRupee
} from 'lucide-react';
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

interface PaymentReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
}

export function PaymentReceiptModal({ open, onOpenChange, payment }: PaymentReceiptModalProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: 'Downloading Receipt',
      description: 'Receipt PDF is being generated...',
    });
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: 'Receipt has been downloaded successfully.',
      });
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!payment || payment.status !== 'paid') return null;

  const receiptNumber = `RCP-${payment.id.padStart(6, '0')}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>

        {/* Receipt Content */}
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Medhavi Hostel</h2>
                <p className="text-xs text-muted-foreground">Hostel Management System</p>
              </div>
            </div>
            <Badge className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Payment Confirmed
            </Badge>
          </div>

          <Separator />

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Receipt No.
              </p>
              <p className="font-semibold">{receiptNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date
              </p>
              <p className="font-semibold">
                {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }) : '-'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Student Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              Student Details
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="font-semibold">{payment.studentName}</p>
              <p className="text-sm text-muted-foreground">ID: {payment.studentId}</p>
              <p className="text-sm text-muted-foreground">Semester: {payment.semester}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Payment Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{payment.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{payment.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <span>{new Date(payment.dueDate).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Amount */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                Total Amount Paid
              </span>
              <span className="text-2xl font-bold text-primary">
                ₹{payment.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>For queries, contact: accounts@medhavi.edu | +91 1234567890</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

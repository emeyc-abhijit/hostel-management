import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Receipt, 
  Download, 
  User, 
  Calendar,
  Hash,
  CreditCard,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
  onRecordPayment?: () => void;
  onSendReminder?: () => void;
  onViewReceipt?: () => void;
  isStudent?: boolean;
}

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
};

export function PaymentDetailsModal({ 
  open, 
  onOpenChange, 
  payment,
  onRecordPayment,
  onSendReminder,
  onViewReceipt,
  isStudent = false,
}: PaymentDetailsModalProps) {
  if (!payment) return null;

  const StatusIcon = statusConfig[payment.status].icon;
  const daysOverdue = payment.status === 'overdue' 
    ? Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  const lateFee = daysOverdue > 0 ? daysOverdue * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={cn('text-sm py-1 px-3 gap-1.5', statusConfig[payment.status].color)}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig[payment.status].label}
              {daysOverdue > 0 && ` (${daysOverdue} days)`}
            </Badge>
          </div>

          {/* Student Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              Student Information
            </h4>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-semibold">{payment.studentName}</p>
              <p className="text-sm text-muted-foreground">ID: {payment.studentId}</p>
            </div>
          </div>

          {/* Fee Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              Fee Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Semester</span>
                <span className="font-medium">{payment.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Amount</span>
                <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
              </div>
              {lateFee > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Late Fee ({daysOverdue} days × ₹100)</span>
                  <span className="font-medium">₹{lateFee.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">₹{(payment.amount + lateFee).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Dates
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <p className="text-muted-foreground text-xs">Due Date</p>
                <p className="font-medium">
                  {new Date(payment.dueDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <p className="text-muted-foreground text-xs">Paid Date</p>
                <p className="font-medium">
                  {payment.paidDate 
                    ? new Date(payment.paidDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details (if paid) */}
          {payment.status === 'paid' && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Transaction Details
              </h4>
              <div className="space-y-2 text-sm bg-success/5 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Transaction ID
                  </span>
                  <span className="font-mono">{payment.transactionId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{payment.paymentMethod || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {payment.status === 'paid' ? (
            <Button onClick={onViewReceipt} className="w-full sm:w-auto">
              <Receipt className="h-4 w-4" />
              View Receipt
            </Button>
          ) : (
            <>
              {!isStudent && onSendReminder && (
                <Button variant="outline" onClick={onSendReminder} className="w-full sm:w-auto">
                  <Bell className="h-4 w-4" />
                  Send Reminder
                </Button>
              )}
              <Button onClick={onRecordPayment} className="w-full sm:w-auto">
                <CreditCard className="h-4 w-4" />
                {isStudent ? 'Pay Now' : 'Record Payment'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

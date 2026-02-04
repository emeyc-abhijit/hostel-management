import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, AlertTriangle, Send } from 'lucide-react';
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

interface SendReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
  onSend: (data: { paymentId: string; channels: string[]; message: string }) => void;
}

export function SendReminderModal({ open, onOpenChange, payment, onSend }: SendReminderModalProps) {
  const { toast } = useToast();
  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    inApp: true,
  });
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const daysOverdue = payment ? Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const lateFee = daysOverdue > 0 ? daysOverdue * 100 : 0;

  const defaultMessage = payment ? `Dear ${payment.studentName},

This is a reminder that your hostel fee payment of ₹${payment.amount.toLocaleString()} for ${payment.semester} is ${payment.status === 'overdue' ? `overdue by ${daysOverdue} days` : 'pending'}.

${lateFee > 0 ? `Late fee accumulated: ₹${lateFee.toLocaleString()}\nTotal due: ₹${(payment.amount + lateFee).toLocaleString()}\n\n` : ''}Please make the payment at your earliest convenience to avoid further penalties.

For any queries, please contact the accounts office.

Regards,
Hostel Administration` : '';

  const handleToggleChannel = (channel: keyof typeof channels) => {
    setChannels({ ...channels, [channel]: !channels[channel] });
  };

  const handleSend = async () => {
    const selectedChannels = Object.entries(channels)
      .filter(([_, selected]) => selected)
      .map(([channel]) => channel);

    if (selectedChannels.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one notification channel', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    onSend({
      paymentId: payment?.id || '',
      channels: selectedChannels,
      message: customMessage || defaultMessage,
    });

    toast({
      title: 'Reminder Sent',
      description: `Payment reminder sent to ${payment?.studentName} via ${selectedChannels.join(', ')}`,
    });

    setIsSending(false);
    onOpenChange(false);
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-warning" />
            Send Payment Reminder
          </DialogTitle>
          <DialogDescription>
            Send a reminder notification to the student about their pending payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student & Payment Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{payment.studentName}</p>
                <p className="text-sm text-muted-foreground">{payment.semester}</p>
              </div>
              <Badge variant={payment.status === 'overdue' ? 'destructive' : 'secondary'} className="gap-1">
                {payment.status === 'overdue' && <AlertTriangle className="h-3 w-3" />}
                {payment.status === 'overdue' ? `${daysOverdue} days overdue` : 'Pending'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Amount Due</p>
                <p className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</p>
              </div>
              {lateFee > 0 && (
                <div>
                  <p className="text-muted-foreground">Late Fee</p>
                  <p className="font-semibold text-destructive">+ ₹{lateFee.toLocaleString()}</p>
                </div>
              )}
            </div>
            {lateFee > 0 && (
              <div className="bg-destructive/10 rounded-lg p-2 text-center">
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="font-bold text-destructive text-xl">₹{(payment.amount + lateFee).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Notification Channels */}
          <div className="space-y-3">
            <Label>Send Via</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={channels.email}
                  onCheckedChange={() => handleToggleChannel('email')}
                />
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={channels.sms}
                  onCheckedChange={() => handleToggleChannel('sms')}
                />
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">SMS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={channels.inApp}
                  onCheckedChange={() => handleToggleChannel('inApp')}
                />
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">In-App</span>
              </label>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Message (Optional - leave blank for default)</Label>
            <Textarea
              id="customMessage"
              placeholder="Enter custom message or leave blank to use default reminder..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Default message includes student name, amount, and due date.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending} className="gap-2">
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Reminder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

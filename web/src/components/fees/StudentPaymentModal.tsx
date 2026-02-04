import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Building, Wallet, IndianRupee, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface StudentPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
  onSuccess: (transactionId: string, paymentMethod: string) => void;
}

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, description: 'All major banks' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Paytm, Amazon Pay' },
];

export function StudentPaymentModal({ open, onOpenChange, payment, onSuccess }: StudentPaymentModalProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'process' | 'success'>('select');

  const daysOverdue = payment && payment.status === 'overdue'
    ? Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const lateFee = daysOverdue > 0 ? daysOverdue * 100 : 0;
  const totalAmount = (payment?.amount || 0) + lateFee;

  const handleProceed = () => {
    if (selectedMethod === 'upi' && !upiId.trim()) {
      toast({ title: 'Error', description: 'Please enter your UPI ID', variant: 'destructive' });
      return;
    }
    setStep('process');
    processPayment();
  };

  const processPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transactionId = `TXN${Date.now().toString().slice(-10)}`;
    const method = paymentMethods.find(m => m.id === selectedMethod)?.label || 'UPI';
    
    setIsProcessing(false);
    setStep('success');
    
    setTimeout(() => {
      onSuccess(transactionId, method);
      toast({
        title: 'Payment Successful!',
        description: `Transaction ID: ${transactionId}`,
      });
      onOpenChange(false);
      setStep('select');
      setUpiId('');
    }, 1500);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      setStep('select');
      setUpiId('');
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {step === 'success' ? 'Payment Successful' : 'Make Payment'}
          </DialogTitle>
          {step === 'select' && (
            <DialogDescription>
              Choose your preferred payment method to complete the transaction.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            {/* Amount Summary */}
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Semester</span>
                <span className="font-medium">{payment.semester}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee Amount</span>
                <span>₹{payment.amount.toLocaleString()}</span>
              </div>
              {lateFee > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Late Fee
                  </span>
                  <span>₹{lateFee.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  Total Payable
                </span>
                <span className="text-lg text-primary">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <RadioGroupItem value={method.id} />
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* UPI ID Input */}
            {selectedMethod === 'upi' && (
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
              <Shield className="h-4 w-4" />
              <span>Your payment is secured with 256-bit encryption</span>
            </div>
          </div>
        )}

        {step === 'process' && (
          <div className="py-8 text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto" />
            <div>
              <p className="font-semibold">Processing Payment...</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your transaction</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="rounded-full bg-success/10 p-4 w-fit mx-auto">
              <svg className="h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-lg">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your payment has been processed successfully</p>
              <p className="text-primary font-semibold mt-2">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {step === 'select' && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleProceed}>
              Pay ₹{totalAmount.toLocaleString()}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

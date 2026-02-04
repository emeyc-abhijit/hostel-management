import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertCircle, CheckCircle, Clock, ArrowRight, Wallet } from 'lucide-react';

const feeData = {
  totalDue: 45000,
  totalPaid: 30000,
  pending: 15000,
  dueDate: '2024-02-15',
  status: 'partial',
  breakdown: [
    { name: 'Hostel Fee', amount: 25000, paid: 25000, status: 'paid' },
    { name: 'Mess Fee', amount: 15000, paid: 5000, status: 'partial' },
    { name: 'Maintenance', amount: 5000, paid: 0, status: 'pending' },
  ],
};

const statusConfig = {
  paid: { label: 'Fully Paid', icon: CheckCircle, variant: 'default' as const, color: 'text-success', bg: 'bg-success/10' },
  partial: { label: 'Partially Paid', icon: Clock, variant: 'secondary' as const, color: 'text-warning', bg: 'bg-warning/10' },
  pending: { label: 'Payment Due', icon: AlertCircle, variant: 'outline' as const, color: 'text-muted-foreground', bg: 'bg-muted' },
  overdue: { label: 'Overdue', icon: AlertCircle, variant: 'destructive' as const, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function StudentFeesWidget() {
  const config = statusConfig[feeData.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;
  const paidPercentage = (feeData.totalPaid / feeData.totalDue) * 100;
  
  const daysUntilDue = Math.ceil(
    (new Date(feeData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
      {/* Decorative top gradient */}
      <div className="h-1 bg-gradient-to-r from-warning via-warning/50 to-transparent" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span>Fee Status</span>
          </CardTitle>
          <Badge variant={config.variant} className="rounded-full px-3 font-medium gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Amount Display */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pending Amount</p>
              <p className="text-4xl font-bold text-foreground mt-1">
                ₹{feeData.pending.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium">Due Date</p>
              <p className={`font-semibold mt-1 ${daysUntilDue < 7 ? 'text-destructive' : 'text-foreground'}`}>
                {new Date(feeData.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              {daysUntilDue > 0 && daysUntilDue < 14 && (
                <Badge variant="outline" className="mt-1 text-warning border-warning/30 bg-warning/10">
                  {daysUntilDue} days left
                </Badge>
              )}
            </div>
          </div>
          
          {/* Decorative circle */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Payment Progress</span>
            <span className="font-bold text-foreground">{paidPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Paid: ₹{feeData.totalPaid.toLocaleString()}</span>
            <span>Total: ₹{feeData.totalDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Fee Breakdown</p>
          <div className="space-y-2">
            {feeData.breakdown.map((fee, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group/fee"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-transform group-hover/fee:scale-125 ${
                    fee.status === 'paid' ? 'bg-success shadow-lg shadow-success/30' : 
                    fee.status === 'partial' ? 'bg-warning shadow-lg shadow-warning/30' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium">{fee.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">
                    ₹{fee.paid.toLocaleString()}
                    <span className="text-muted-foreground font-normal">/{fee.amount.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link to="/fees">
          <Button 
            className={`w-full rounded-xl h-11 font-semibold transition-all duration-200 ${
              feeData.pending > 0 
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25' 
                : ''
            }`}
            variant={feeData.pending > 0 ? 'default' : 'outline'}
          >
            {feeData.pending > 0 ? 'Pay Now' : 'View Details'}
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

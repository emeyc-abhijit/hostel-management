import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'bg-primary/10 text-primary',
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'h-1.5 w-1.5 rounded-full',
                changeType === 'positive' && 'bg-success',
                changeType === 'negative' && 'bg-destructive',
                changeType === 'neutral' && 'bg-muted-foreground/50'
              )} />
              <p
                className={cn(
                  'text-sm font-medium',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                {change}
              </p>
            </div>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3 transition-transform duration-300 group-hover:scale-110',
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-full bg-primary/3 transition-transform duration-500 group-hover:scale-125" />
    </div>
  );
}

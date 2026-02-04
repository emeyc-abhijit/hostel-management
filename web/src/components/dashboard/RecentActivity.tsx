import { MessageSquare, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'application' | 'complaint' | 'approval' | 'alert';
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Hostel Application',
    description: 'Rahul Sharma applied for Boys Hostel A',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'complaint',
    title: 'Maintenance Request',
    description: 'Room 204 - Electrical issue reported',
    time: '3 hours ago',
  },
  {
    id: '3',
    type: 'approval',
    title: 'Application Approved',
    description: 'Sneha Patel allocated to Room 105',
    time: '5 hours ago',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Fee Reminder',
    description: '15 students have pending hostel fees',
    time: '1 day ago',
  },
];

const iconMap = {
  application: UserPlus,
  complaint: MessageSquare,
  approval: CheckCircle,
  alert: AlertCircle,
};

const colorMap = {
  application: 'bg-info/10 text-info',
  complaint: 'bg-warning/10 text-warning',
  approval: 'bg-success/10 text-success',
  alert: 'bg-destructive/10 text-destructive',
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className={cn('rounded-lg p-2', colorMap[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-card-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

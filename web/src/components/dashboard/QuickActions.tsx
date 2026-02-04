import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, BedDouble, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  roles: Array<'admin' | 'warden' | 'student'>;
}

const quickActions: QuickAction[] = [
  {
    label: 'New Application',
    href: '/applications',
    icon: UserPlus,
    color: 'bg-info/10 text-info hover:bg-info/20',
    roles: ['admin', 'warden'],
  },
  {
    label: 'Manage Rooms',
    href: '/rooms',
    icon: BedDouble,
    color: 'bg-success/10 text-success hover:bg-success/20',
    roles: ['admin', 'warden'],
  },
  {
    label: 'Post Notice',
    href: '/notices',
    icon: FileText,
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
    roles: ['admin', 'warden'],
  },
  {
    label: 'View Complaints',
    href: '/complaints',
    icon: MessageSquare,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
    roles: ['admin', 'warden'],
  },
  {
    label: 'Apply for Hostel',
    href: '/apply',
    icon: FileText,
    color: 'bg-info/10 text-info hover:bg-info/20',
    roles: ['student'],
  },
  {
    label: 'Submit Complaint',
    href: '/complaints',
    icon: MessageSquare,
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
    roles: ['student'],
  },
];

export function QuickActions() {
  const { user } = useAuth();

  const filteredActions = quickActions.filter(
    action => user && action.roles.includes(user.role)
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {filteredActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href + action.label} to={action.href}>
              <Button
                variant="ghost"
                className={`h-auto w-full flex-col gap-2 p-4 ${action.color}`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

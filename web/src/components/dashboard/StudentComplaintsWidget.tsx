import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Wrench, ArrowRight } from 'lucide-react';

const complaintsData = {
  total: 5,
  pending: 1,
  inProgress: 1,
  resolved: 3,
  recent: [
    {
      id: 'C001',
      title: 'Water leakage in bathroom',
      category: 'Plumbing',
      status: 'in_progress',
      date: '2024-01-10',
      priority: 'high',
    },
    {
      id: 'C002',
      title: 'AC not working properly',
      category: 'Electrical',
      status: 'pending',
      date: '2024-01-08',
      priority: 'medium',
    },
    {
      id: 'C003',
      title: 'Broken window lock',
      category: 'Maintenance',
      status: 'resolved',
      date: '2024-01-05',
      priority: 'low',
    },
  ],
};

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-warning', bg: 'bg-warning/10', ring: 'ring-warning/20' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-info', bg: 'bg-info/10', ring: 'ring-info/20' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', ring: 'ring-success/20' },
  rejected: { label: 'Rejected', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', ring: 'ring-destructive/20' },
};

const priorityConfig = {
  high: { color: 'text-destructive', dot: 'bg-destructive', glow: 'shadow-destructive/50' },
  medium: { color: 'text-warning', dot: 'bg-warning', glow: 'shadow-warning/50' },
  low: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', glow: '' },
};

export function StudentComplaintsWidget() {
  return (
    <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
      {/* Decorative top gradient */}
      <div className="h-1 bg-gradient-to-r from-info via-info/50 to-transparent" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <span>My Complaints</span>
          </CardTitle>
          <Link to="/complaints">
            <Button size="sm" variant="outline" className="rounded-full gap-1 hover:bg-primary hover:text-primary-foreground transition-all">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', value: complaintsData.pending, color: 'warning' },
            { label: 'In Progress', value: complaintsData.inProgress, color: 'info' },
            { label: 'Resolved', value: complaintsData.resolved, color: 'success' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className={`relative text-center p-3 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 overflow-hidden hover:scale-105 transition-transform duration-200`}
            >
              <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Complaints */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Recent Complaints</p>
          <div className="space-y-2">
            {complaintsData.recent.map((complaint) => {
              const status = statusConfig[complaint.status as keyof typeof statusConfig];
              const priority = priorityConfig[complaint.priority as keyof typeof priorityConfig];
              const StatusIcon = status.icon;
              
              return (
                <div 
                  key={complaint.id} 
                  className="group/item p-4 rounded-xl border border-border/50 bg-gradient-to-r from-transparent to-muted/20 hover:border-primary/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priority.dot} shadow-lg ${priority.glow}`} />
                        <p className="text-sm font-semibold truncate group-hover/item:text-primary transition-colors">
                          {complaint.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs rounded-full font-medium">
                          {complaint.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${status.bg} ring-1 ${status.ring}`}>
                      <StatusIcon className={`h-3 w-3 ${status.color}`} />
                      <span className={status.color}>{status.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Link */}
        <Link to="/complaints">
          <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 rounded-xl">
            View All Complaints
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

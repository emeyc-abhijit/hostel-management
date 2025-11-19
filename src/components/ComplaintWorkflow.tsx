import { Check, Clock } from 'lucide-react';
import { Complaint } from '@/types';

interface ComplaintWorkflowProps {
  complaint: Complaint;
}

export function ComplaintWorkflow({ complaint }: ComplaintWorkflowProps) {
  const stages = [
    {
      name: 'Warden Review',
      completed: !!complaint.wardenReviewedAt,
      reviewedBy: complaint.wardenReviewedBy,
      reviewedAt: complaint.wardenReviewedAt,
      deadline: 24,
    },
    {
      name: 'Admin Review',
      completed: !!complaint.adminReviewedAt,
      reviewedBy: complaint.adminReviewedBy,
      reviewedAt: complaint.adminReviewedAt,
      deadline: 48,
    },
    {
      name: 'Higher Management',
      completed: !!complaint.higherManagementReviewedAt,
      reviewedBy: complaint.higherManagementReviewedBy,
      reviewedAt: complaint.higherManagementReviewedAt,
      deadline: null,
    },
  ];

  const getStageStatus = (stage: typeof stages[0], index: number) => {
    if (stage.completed) return 'completed';
    
    // Check if previous stages are completed
    const previousCompleted = index === 0 || stages.slice(0, index).every(s => s.completed);
    if (!previousCompleted) return 'locked';
    
    // Check if deadline passed
    if (stage.deadline) {
      const createdTime = new Date(complaint.createdAt).getTime();
      const now = Date.now();
      const hoursPassed = (now - createdTime) / (1000 * 60 * 60);
      if (hoursPassed > stage.deadline) return 'overdue';
    }
    
    return 'pending';
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Review Progress</h4>
      <div className="flex items-center gap-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage, index);
          
          return (
            <div key={stage.name} className="flex items-center gap-2 flex-1">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                ${status === 'completed' 
                  ? 'bg-success border-success text-success-foreground' 
                  : status === 'overdue'
                  ? 'bg-destructive border-destructive text-destructive-foreground animate-pulse'
                  : status === 'pending'
                  ? 'bg-warning border-warning text-warning-foreground'
                  : 'bg-muted border-muted-foreground text-muted-foreground'
                }
              `}>
                {status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">{stage.name}</p>
                {stage.completed && stage.reviewedAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(stage.reviewedAt).toLocaleDateString()}
                  </p>
                )}
                {status === 'pending' && stage.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Within {stage.deadline}h
                  </p>
                )}
                {status === 'overdue' && (
                  <p className="text-xs text-destructive">
                    Escalated
                  </p>
                )}
              </div>
              {index < stages.length - 1 && (
                <div className={`h-0.5 w-8 transition-colors ${
                  stages[index + 1].completed ? 'bg-success' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

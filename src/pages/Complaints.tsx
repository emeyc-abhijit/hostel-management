import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Complaint } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ComplaintWorkflow } from '@/components/ComplaintWorkflow';
import { ComplaintDetailDialog } from '@/components/ComplaintDetailDialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Complaints() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Mock data
  const complaints: Complaint[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Rahul Kumar',
      title: 'AC not working',
      description: 'The air conditioner in room A-204 has stopped working.',
      category: 'maintenance',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Priya Sharma',
      title: 'Poor food quality',
      description: 'The food served in the mess yesterday was not fresh.',
      category: 'food',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      assignedTo: 'Mess Warden',
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'Amit Patel',
      title: 'Unclean washroom',
      description: 'The common washroom on floor 3 needs cleaning.',
      category: 'cleanliness',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-13T08:15:00Z',
      updatedAt: '2024-01-14T16:00:00Z',
      assignedTo: 'Cleaning Staff',
    },
  ];

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'open':
        return 'bg-destructive text-destructive-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      case 'closed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-destructive text-destructive';
      case 'high':
        return 'border-warning text-warning';
      case 'medium':
        return 'border-info text-info';
      case 'low':
        return 'border-muted-foreground text-muted-foreground';
      default:
        return 'border-muted text-muted-foreground';
    }
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailDialogOpen(true);
  };

  const handleAssign = (complaint: Complaint) => {
    // Determine next stage
    let nextStage = '';
    if (!complaint.wardenReviewedAt) {
      nextStage = 'Warden';
    } else if (!complaint.adminReviewedAt) {
      nextStage = 'Admin';
    } else if (!complaint.higherManagementReviewedAt) {
      nextStage = 'Higher Management';
    }

    toast({
      title: 'Complaint assigned',
      description: `Complaint has been forwarded to ${nextStage} for review.`,
    });
  };

  const handleMarkResolved = (complaintId: string) => {
    toast({
      title: 'Complaint resolved',
      description: 'The complaint has been marked as resolved.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">Manage student complaints and issues</p>
        </div>
        <Button onClick={() => navigate('/complaints/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filed by {complaint.studentName} • {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComplaintWorkflow complaint={complaint} />
              <p className="text-sm">{complaint.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="capitalize">
                  {complaint.category}
                </Badge>
                {complaint.assignedTo && (
                  <span className="text-muted-foreground">
                    Assigned to: {complaint.assignedTo}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint)}>
                  View Details
                </Button>
                {complaint.status === 'open' && (
                  <Button variant="outline" size="sm" onClick={() => handleAssign(complaint)}>
                    Assign
                  </Button>
                )}
                {complaint.status === 'in-progress' && (
                  <Button size="sm" onClick={() => handleMarkResolved(complaint.id)}>
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ComplaintDetailDialog 
        complaint={selectedComplaint!}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}

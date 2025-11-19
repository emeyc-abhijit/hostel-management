import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockComplaints } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { ComplaintWorkflow } from '@/components/ComplaintWorkflow';

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.id;
  const complaints = mockComplaints.filter((c) => c.studentId === studentId);

  const getStatusColor = (status: typeof mockComplaints[number]['status']) => {
    switch (status) {
      case 'open':
        return 'bg-destructive text-destructive-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground">View and track complaints you've filed</p>
        </div>
        <Button onClick={() => navigate('/complaints/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Complaint
        </Button>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No complaints found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You haven't filed any complaints yet.</p>
            </CardContent>
          </Card>
        )}

        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Filed on {new Date(complaint.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ComplaintWorkflow complaint={complaint} />
              <p className="text-sm text-muted-foreground mt-4">{complaint.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

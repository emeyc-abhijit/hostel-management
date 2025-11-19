import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockEntryExitRequests } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function MyEntryExit() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.id;
  const requests = mockEntryExitRequests.filter((r) => r.studentId === studentId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Entry/Exit Requests</h1>
          <p className="text-muted-foreground">Track your entry and exit permission requests</p>
        </div>
        <Button onClick={() => navigate('/entry-exit/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="space-y-4">
        {requests.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No requests found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You haven't submitted any entry/exit requests yet.</p>
            </CardContent>
          </Card>
        )}

        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg capitalize">{request.requestType} Permission</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requested on {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Start Date:</span> {new Date(request.startDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">End Date:</span> {new Date(request.endDate).toLocaleDateString()}
                </div>
                {request.destination && (
                  <div className="col-span-2">
                    <span className="font-medium">Destination:</span> {request.destination}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">Purpose:</span> {request.purpose}</p>
              </div>
              {request.approvedBy && (
                <p className="text-sm text-muted-foreground">
                  {request.status === 'approved' ? 'Approved' : 'Reviewed'} by {request.approvedBy}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

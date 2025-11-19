import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEntryExitRequests } from '@/lib/mockData';

export default function EntryExitApplications() {
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
      <div>
        <h1 className="text-3xl font-bold">Entry/Exit Applications</h1>
        <p className="text-muted-foreground">Review and manage student entry/exit permission requests</p>
      </div>

      <div className="space-y-4">
        {mockEntryExitRequests.map((request) => (
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
                    Requested by {request.studentName} • {new Date(request.createdAt).toLocaleDateString()}
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
                {request.contactDuringAbsence && (
                  <div className="col-span-2">
                    <span className="font-medium">Contact:</span> {request.contactDuringAbsence}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm"><span className="font-medium">Purpose:</span> {request.purpose}</p>
              </div>
              {request.remarks && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">Remarks:</span> {request.remarks}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {request.status === 'pending' && (
                  <>
                    <Button size="sm">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

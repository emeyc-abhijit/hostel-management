import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye } from 'lucide-react';
import { mockAdmissions } from '@/lib/mockData';
import { useState } from 'react';
import { HostelAdmission } from '@/types';
import { AdmissionFormPrint } from '@/components/AdmissionFormPrint';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function HostelAdmissions() {
  const [selectedAdmission, setSelectedAdmission] = useState<HostelAdmission | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrint = (admission: HostelAdmission) => {
    setSelectedAdmission(admission);
    setIsPrintDialogOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleView = (admission: HostelAdmission) => {
    setSelectedAdmission(admission);
    setIsPrintDialogOpen(true);
  };

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
        <h1 className="text-3xl font-bold">Hostel Admissions</h1>
        <p className="text-muted-foreground">Review and manage hostel admission applications</p>
      </div>

      <div className="space-y-4">
        {mockAdmissions.map((admission) => (
          <Card key={admission.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{admission.studentName}</CardTitle>
                    <Badge className={getStatusColor(admission.status)}>
                      {admission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applied on {new Date(admission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {admission.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {admission.phone}
                </div>
                <div>
                  <span className="font-medium">Course:</span> {admission.course}
                </div>
                <div>
                  <span className="font-medium">Year:</span> {admission.year}
                </div>
                <div>
                  <span className="font-medium">Preferred Hostel:</span> {admission.preferredHostel}
                </div>
                <div>
                  <span className="font-medium">Room Type:</span> {admission.roomType}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Guardian:</span> {admission.guardianName} ({admission.guardianPhone})
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleView(admission)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePrint(admission)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Print Form
                </Button>
                {admission.status === 'pending' && (
                  <>
                    <Button size="sm" variant="default">
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

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAdmission && <AdmissionFormPrint admission={selectedAdmission} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

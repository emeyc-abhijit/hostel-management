import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockAdmissions } from '@/lib/mockData';
import { useState } from 'react';
import { ViewAdmissionDialog } from '@/components/ViewAdmissionDialog';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function EntryApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock: Find student's admission form (in real app, would fetch by student ID)
  const studentAdmission = mockAdmissions.find(a => a.email === user?.email);

  if (!studentAdmission) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>No Admission Form Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have an admission form on file. Please contact the hostel administration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Entry Permission - View Admission Form</h1>
        <p className="text-muted-foreground">Your hostel admission form details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Hostel Admission Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-medium">{studentAdmission.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{studentAdmission.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{studentAdmission.course}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{studentAdmission.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferred Hostel</p>
              <p className="font-medium">{studentAdmission.preferredHostel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium capitalize">{studentAdmission.roomType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{studentAdmission.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted Date</p>
              <p className="font-medium">{new Date(studentAdmission.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Button onClick={() => setIsDialogOpen(true)}>
            View Full Admission Form
          </Button>
        </CardContent>
      </Card>

      <ViewAdmissionDialog 
        admission={studentAdmission}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

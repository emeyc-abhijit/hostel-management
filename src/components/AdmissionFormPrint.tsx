import { HostelAdmission } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AdmissionFormPrintProps {
  admission: HostelAdmission;
}

export function AdmissionFormPrint({ admission }: AdmissionFormPrintProps) {
  return (
    <div className="print-content max-w-4xl mx-auto p-8 bg-background">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold mb-2">HOSTEL ADMISSION FORM</h1>
        <p className="text-sm text-muted-foreground">Academic Year 2024-25</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3 bg-muted px-3 py-2 rounded">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4 px-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{admission.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{admission.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{admission.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application Date</p>
              <p className="font-medium">{new Date(admission.submittedAt).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{admission.address}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 bg-muted px-3 py-2 rounded">Academic Details</h2>
          <div className="grid grid-cols-2 gap-4 px-3">
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{admission.course}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{admission.year}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 bg-muted px-3 py-2 rounded">Guardian Information</h2>
          <div className="grid grid-cols-2 gap-4 px-3">
            <div>
              <p className="text-sm text-muted-foreground">Guardian Name</p>
              <p className="font-medium">{admission.guardianName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guardian Phone</p>
              <p className="font-medium">{admission.guardianPhone}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 bg-muted px-3 py-2 rounded">Hostel Preferences</h2>
          <div className="grid grid-cols-2 gap-4 px-3">
            <div>
              <p className="text-sm text-muted-foreground">Preferred Hostel</p>
              <p className="font-medium">{admission.preferredHostel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium capitalize">{admission.roomType}</p>
            </div>
          </div>
        </div>

        {admission.reviewedBy && (
          <div>
            <h2 className="text-lg font-semibold mb-3 bg-muted px-3 py-2 rounded">Review Status</h2>
            <div className="grid grid-cols-2 gap-4 px-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{admission.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reviewed By</p>
                <p className="font-medium">{admission.reviewedBy}</p>
              </div>
              {admission.reviewedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Review Date</p>
                  <p className="font-medium">{new Date(admission.reviewedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-16">
          <div>
            <p className="text-sm text-muted-foreground mb-8">Student's Signature</p>
            <div className="border-b border-foreground w-48"></div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-8">Warden's Signature</p>
            <div className="border-b border-foreground w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

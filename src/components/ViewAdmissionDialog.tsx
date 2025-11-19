import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HostelAdmission } from '@/types';
import { AdmissionFormPrint } from './AdmissionFormPrint';

interface ViewAdmissionDialogProps {
  admission: HostelAdmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewAdmissionDialog({ admission, open, onOpenChange }: ViewAdmissionDialogProps) {
  if (!admission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hostel Admission Form</DialogTitle>
        </DialogHeader>
        <AdmissionFormPrint admission={admission} />
      </DialogContent>
    </Dialog>
  );
}

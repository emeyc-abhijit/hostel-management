import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  hostel: string;
  roomNumber: string;
  admissionDate: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  status: 'active' | 'inactive' | 'graduated';
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
}

interface EditStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentData | null;
  onUpdate: (student: StudentData) => void;
  onDelete: (studentId: string) => void;
  hostels: string[];
}

const courses = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech EE', 'B.Tech ME', 'B.Tech IT', 
  'B.Tech Civil', 'MBA', 'MCA', 'M.Tech', 'BBA', 'BCA'
];

export function EditStudentModal({ open, onOpenChange, student, onUpdate, onDelete, hostels }: EditStudentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    }
  }, [student]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.course) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onUpdate(formData);
    toast({
      title: "Student Updated",
      description: `${formData.name}'s profile has been updated.`,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(formData.id);
    toast({
      title: "Student Removed",
      description: `${formData.name} has been removed from the system.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Edit Student
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@medhavi.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Academic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course">Course *</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year *</Label>
                <Select value={formData.year.toString()} onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-admissionDate">Admission Date</Label>
                <Input
                  id="edit-admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'graduated') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Hostel Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Hostel Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hostel">Hostel</Label>
                <Select value={formData.hostel} onValueChange={(value) => setFormData({ ...formData, hostel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-roomNumber">Room Number</Label>
                <Input
                  id="edit-roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g., 204"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-feeStatus">Fee Status</Label>
                <Select value={formData.feeStatus} onValueChange={(value: 'paid' | 'pending' | 'overdue') => setFormData({ ...formData, feeStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Guardian Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-guardianName">Guardian Name</Label>
                <Input
                  id="edit-guardianName"
                  value={formData.guardianName || ''}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Parent/Guardian name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-guardianPhone">Guardian Phone</Label>
                <Input
                  id="edit-guardianPhone"
                  value={formData.guardianPhone || ''}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Student?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {formData.name} from the hostel management system. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Remove Student
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              <Edit className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

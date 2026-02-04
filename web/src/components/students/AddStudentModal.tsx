import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

interface StudentFormData {
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
  guardianName: string;
  guardianPhone: string;
  address: string;
}

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (student: StudentFormData) => void;
  hostels: string[];
}

const courses = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Tech EE', 'B.Tech ME', 'B.Tech IT', 
  'B.Tech Civil', 'MBA', 'MCA', 'M.Tech', 'BBA', 'BCA'
];

export function AddStudentModal({ open, onOpenChange, onAdd, hostels }: AddStudentModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    course: '',
    year: 1,
    hostel: '',
    roomNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    feeStatus: 'pending',
    status: 'active',
    guardianName: '',
    guardianPhone: '',
    address: '',
  });

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

    onAdd(formData);
    toast({
      title: "Student Added",
      description: `${formData.name} has been added successfully.`,
    });
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      year: 1,
      hostel: '',
      roomNumber: '',
      admissionDate: new Date().toISOString().split('T')[0],
      feeStatus: 'pending',
      status: 'active',
      guardianName: '',
      guardianPhone: '',
      address: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Student
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@medhavi.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
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
                <Label htmlFor="course">Course *</Label>
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
                <Label htmlFor="year">Year *</Label>
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
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
                <Label htmlFor="hostel">Hostel</Label>
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
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g., 204"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="feeStatus">Fee Status</Label>
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
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Parent/Guardian name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

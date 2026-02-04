import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Hostel {
  id: string;
  name: string;
  type: 'boys' | 'girls';
  totalRooms: number;
  occupiedRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  warden: {
    name: string;
    phone: string;
    email: string;
  };
  location: string;
  facilities: string[];
  status: 'active' | 'maintenance' | 'closed';
}

interface EditHostelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostel: Hostel | null;
  onUpdateHostel: (hostel: Hostel) => void;
  onDeleteHostel: (hostelId: string) => void;
}

const availableFacilities = [
  'WiFi', 'Parking', 'Mess', 'Security', 'Hot Water', 'Power Backup', '24x7 Guard', 'Laundry', 'Gym', 'Common Room', 'Study Room', 'Medical Room'
];

export function EditHostelModal({ open, onOpenChange, hostel, onUpdateHostel, onDeleteHostel }: EditHostelModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'boys' | 'girls' | '',
    totalRooms: '',
    totalBeds: '',
    wardenName: '',
    wardenPhone: '',
    wardenEmail: '',
    location: '',
    facilities: [] as string[],
    status: 'active' as 'active' | 'maintenance' | 'closed',
  });

  useEffect(() => {
    if (hostel) {
      setFormData({
        name: hostel.name,
        type: hostel.type,
        totalRooms: hostel.totalRooms.toString(),
        totalBeds: hostel.totalBeds.toString(),
        wardenName: hostel.warden.name,
        wardenPhone: hostel.warden.phone,
        wardenEmail: hostel.warden.email,
        location: hostel.location,
        facilities: hostel.facilities,
        status: hostel.status,
      });
    }
  }, [hostel]);

  if (!hostel) return null;

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.totalRooms || !formData.totalBeds || !formData.location) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newTotalBeds = parseInt(formData.totalBeds);
    if (newTotalBeds < hostel.occupiedBeds) {
      toast({
        title: 'Invalid Capacity',
        description: `Total beds cannot be less than current occupancy (${hostel.occupiedBeds}).`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    onUpdateHostel({
      ...hostel,
      name: formData.name,
      type: formData.type as 'boys' | 'girls',
      totalRooms: parseInt(formData.totalRooms),
      totalBeds: newTotalBeds,
      warden: {
        name: formData.wardenName || 'TBA',
        phone: formData.wardenPhone || '-',
        email: formData.wardenEmail || '-',
      },
      location: formData.location,
      facilities: formData.facilities,
      status: formData.status,
    });

    toast({
      title: 'Hostel Updated',
      description: `${formData.name} has been updated successfully.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (hostel.occupiedBeds > 0) {
      toast({
        title: 'Cannot Delete Hostel',
        description: 'Relocate all students before deleting this hostel.',
        variant: 'destructive',
      });
      setShowDeleteDialog(false);
      return;
    }

    onDeleteHostel(hostel.id);
    toast({
      title: 'Hostel Deleted',
      description: `${hostel.name} has been deleted.`,
    });
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Edit className="h-5 w-5 text-primary" />
              </div>
              Edit {hostel.name}
            </DialogTitle>
            <DialogDescription>
              Update hostel details and settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="name">Hostel Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Boys Hostel A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'boys' | 'girls' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boys">Boys Hostel</SelectItem>
                    <SelectItem value="girls">Girls Hostel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRooms">Total Rooms *</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={formData.totalRooms}
                  onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBeds">Total Beds *</Label>
                <Input
                  id="totalBeds"
                  type="number"
                  min={hostel.occupiedBeds}
                  placeholder="e.g., 300"
                  value={formData.totalBeds}
                  onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                />
                {hostel.occupiedBeds > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Min: {hostel.occupiedBeds} (current occupancy)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., North Campus, Block A"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'maintenance' | 'closed' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>Warden Information</Label>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Warden Name"
                  value={formData.wardenName}
                  onChange={(e) => setFormData({ ...formData, wardenName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Phone Number"
                    value={formData.wardenPhone}
                    onChange={(e) => setFormData({ ...formData, wardenPhone: e.target.value })}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={formData.wardenEmail}
                    onChange={(e) => setFormData({ ...formData, wardenEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>Facilities</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableFacilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${facility}`}
                      checked={formData.facilities.includes(facility)}
                      onCheckedChange={() => toggleFacility(facility)}
                    />
                    <label htmlFor={`edit-${facility}`} className="text-sm cursor-pointer">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="sm:mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {hostel.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hostel and all associated data.
              {hostel.occupiedBeds > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This hostel has {hostel.occupiedBeds} occupant(s). Relocate them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Hostel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

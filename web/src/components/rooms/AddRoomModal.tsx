import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';
import { BedDouble, Plus } from 'lucide-react';

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  hostels: { id: string; name: string }[];
}

export function AddRoomModal({ open, onOpenChange, onAddRoom, hostels }: AddRoomModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hostelId: '',
    roomNumber: '',
    floor: '',
    capacity: '',
    type: '' as 'single' | 'double' | 'triple' | '',
  });

  const resetForm = () => {
    setFormData({
      hostelId: '',
      roomNumber: '',
      floor: '',
      capacity: '',
      type: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hostelId || !formData.roomNumber || !formData.floor || !formData.capacity || !formData.type) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    onAddRoom({
      hostelId: formData.hostelId,
      roomNumber: formData.roomNumber,
      floor: parseInt(formData.floor),
      capacity: parseInt(formData.capacity),
      occupied: 0,
      type: formData.type as 'single' | 'double' | 'triple',
      status: 'available',
    });

    toast({
      title: 'Room Added',
      description: `Room ${formData.roomNumber} has been created successfully.`,
    });

    resetForm();
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) resetForm(); onOpenChange(open); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Add New Room
          </DialogTitle>
          <DialogDescription>
            Create a new room in the hostel management system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hostel">Hostel *</Label>
            <Select
              value={formData.hostelId}
              onValueChange={(value) => setFormData({ ...formData, hostelId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id}>
                    {hostel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number *</Label>
              <Input
                id="roomNumber"
                placeholder="e.g., 101"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                placeholder="e.g., 1"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  const capacity = value === 'single' ? '1' : value === 'double' ? '2' : '3';
                  setFormData({ ...formData, type: value as 'single' | 'double' | 'triple', capacity });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single (1 bed)</SelectItem>
                  <SelectItem value="double">Double (2 beds)</SelectItem>
                  <SelectItem value="triple">Triple (3 beds)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="6"
                placeholder="e.g., 2"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <BedDouble className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

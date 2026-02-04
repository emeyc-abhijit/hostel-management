import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';
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

interface EditRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  hostels: { id: string; name: string }[];
}

export function EditRoomModal({ open, onOpenChange, room, onUpdateRoom, onDeleteRoom, hostels }: EditRoomModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    hostelId: '',
    roomNumber: '',
    floor: '',
    capacity: '',
    type: '' as 'single' | 'double' | 'triple' | '',
    status: '' as 'available' | 'full' | 'maintenance' | '',
  });

  useEffect(() => {
    if (room) {
      setFormData({
        hostelId: room.hostelId,
        roomNumber: room.roomNumber,
        floor: room.floor.toString(),
        capacity: room.capacity.toString(),
        type: room.type,
        status: room.status,
      });
    }
  }, [room]);

  if (!room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomNumber || !formData.floor || !formData.capacity || !formData.type) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newCapacity = parseInt(formData.capacity);
    if (newCapacity < room.occupied) {
      toast({
        title: 'Invalid Capacity',
        description: `Capacity cannot be less than current occupancy (${room.occupied}).`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedRoom: Room = {
      ...room,
      hostelId: formData.hostelId,
      roomNumber: formData.roomNumber,
      floor: parseInt(formData.floor),
      capacity: newCapacity,
      type: formData.type as 'single' | 'double' | 'triple',
      status: formData.status as 'available' | 'full' | 'maintenance',
    };

    // Auto-update status based on occupancy
    if (updatedRoom.status !== 'maintenance') {
      if (updatedRoom.occupied >= updatedRoom.capacity) {
        updatedRoom.status = 'full';
      } else {
        updatedRoom.status = 'available';
      }
    }

    onUpdateRoom(updatedRoom);

    toast({
      title: 'Room Updated',
      description: `Room ${formData.roomNumber} has been updated successfully.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (room.occupied > 0) {
      toast({
        title: 'Cannot Delete Room',
        description: 'Remove all occupants before deleting this room.',
        variant: 'destructive',
      });
      setShowDeleteDialog(false);
      return;
    }

    onDeleteRoom(room.id);
    toast({
      title: 'Room Deleted',
      description: `Room ${room.roomNumber} has been deleted.`,
    });
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Edit className="h-5 w-5 text-primary" />
              </div>
              Edit Room {room.roomNumber}
            </DialogTitle>
            <DialogDescription>
              Update room details and settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
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
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., 101"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
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
                <Label htmlFor="type">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'single' | 'double' | 'triple' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={room.occupied}
                  max="6"
                  placeholder="e.g., 2"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
                {room.occupied > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Min: {room.occupied} (current occupancy)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'available' | 'full' | 'maintenance' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
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
            <AlertDialogTitle>Delete Room {room.roomNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room from the system.
              {room.occupied > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This room has {room.occupied} occupant(s). Remove them first.
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
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

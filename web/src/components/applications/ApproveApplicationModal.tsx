import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check, BedDouble, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ApplicationData {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  preferredHostel: string;
  alternateHostel?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  notes?: string;
}

interface RoomData {
  id: string;
  roomNumber: string;
  hostel: string;
  capacity: number;
  occupied: number;
  floor: number;
}

interface ApproveApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationData | null;
  availableRooms: RoomData[];
  onApprove: (applicationId: string, roomId: string, notes: string) => void;
}

export function ApproveApplicationModal({ 
  open, 
  onOpenChange, 
  application, 
  availableRooms,
  onApprove 
}: ApproveApplicationModalProps) {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [notes, setNotes] = useState('');

  if (!application) return null;

  // Filter rooms by preferred hostel first
  const preferredRooms = availableRooms.filter(
    room => room.hostel === application.preferredHostel && room.occupied < room.capacity
  );
  const alternateRooms = application.alternateHostel 
    ? availableRooms.filter(
        room => room.hostel === application.alternateHostel && room.occupied < room.capacity
      )
    : [];
  const otherRooms = availableRooms.filter(
    room => room.hostel !== application.preferredHostel && 
           room.hostel !== application.alternateHostel && 
           room.occupied < room.capacity
  );

  const handleApprove = () => {
    if (!selectedRoom) {
      toast({
        title: "Room Required",
        description: "Please select a room to assign to the student.",
        variant: "destructive",
      });
      return;
    }

    onApprove(application.id, selectedRoom, notes);
    toast({
      title: "Application Approved",
      description: `${application.studentName}'s application has been approved and room assigned.`,
    });
    onOpenChange(false);
    setSelectedRoom('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            Approve Application
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Applicant Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {application.studentName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">{application.studentName}</h3>
              <p className="text-sm text-muted-foreground">
                {application.course} • Year {application.year}
              </p>
            </div>
          </div>

          {/* Room Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              Assign Room *
            </Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room to assign" />
              </SelectTrigger>
              <SelectContent>
                {preferredRooms.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                      Preferred: {application.preferredHostel}
                    </div>
                    {preferredRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex items-center gap-2">
                          <span>Room {room.roomNumber} - Floor {room.floor}</span>
                          <span className="text-xs text-muted-foreground">
                            ({room.occupied}/{room.capacity} occupied)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {alternateRooms.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted mt-2">
                      Alternate: {application.alternateHostel}
                    </div>
                    {alternateRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex items-center gap-2">
                          <span>Room {room.roomNumber} - Floor {room.floor}</span>
                          <span className="text-xs text-muted-foreground">
                            ({room.occupied}/{room.capacity} occupied)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {otherRooms.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted mt-2">
                      Other Available Rooms
                    </div>
                    {otherRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex items-center gap-2">
                          <span>{room.hostel} - Room {room.roomNumber}</span>
                          <span className="text-xs text-muted-foreground">
                            ({room.occupied}/{room.capacity} occupied)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
                {preferredRooms.length === 0 && alternateRooms.length === 0 && otherRooms.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No available rooms
                  </div>
                )}
              </SelectContent>
            </Select>
            {preferredRooms.length === 0 && (
              <p className="text-xs text-warning">
                No rooms available in preferred hostel. Consider alternate options.
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="approve-notes">Notes (Optional)</Label>
            <Textarea
              id="approve-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this approval..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="success" onClick={handleApprove} className="flex-1">
              <Check className="h-4 w-4" />
              Approve & Assign Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

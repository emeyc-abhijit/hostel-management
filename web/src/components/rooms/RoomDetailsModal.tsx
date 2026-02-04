import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Room } from '@/types';
import { BedDouble, Users, Layers, Wifi, Wind, Droplets, Zap, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrentOccupant {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  joinedDate: string;
}

interface RoomDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-success/10 text-success border-success/20' },
  full: { label: 'Full', color: 'bg-primary/10 text-primary border-primary/20' },
  maintenance: { label: 'Maintenance', color: 'bg-warning/10 text-warning border-warning/20' },
};

// Mock occupant data
const mockOccupants: Record<string, CurrentOccupant[]> = {
  '1': [
    { id: 'o1', name: 'Meera Iyer', email: 'meera.i@medhavi.edu', phone: '+91 98765 43210', course: 'B.Tech CSE', year: 2, joinedDate: '2023-08-15' },
    { id: 'o2', name: 'Divya Krishnan', email: 'divya.k@medhavi.edu', phone: '+91 98765 43211', course: 'B.Tech IT', year: 2, joinedDate: '2023-08-15' },
    { id: 'o3', name: 'Lakshmi Menon', email: 'lakshmi.m@medhavi.edu', phone: '+91 98765 43212', course: 'B.Tech ECE', year: 2, joinedDate: '2023-08-15' },
  ],
  '2': [
    { id: 'o4', name: 'Arun Prakash', email: 'arun.p@medhavi.edu', phone: '+91 98765 43213', course: 'B.Tech ME', year: 3, joinedDate: '2022-08-20' },
  ],
  '6': [
    { id: 'o5', name: 'Neha Sharma', email: 'neha.s@medhavi.edu', phone: '+91 98765 43214', course: 'B.Tech CSE', year: 1, joinedDate: '2024-08-10' },
    { id: 'o6', name: 'Pooja Reddy', email: 'pooja.r@medhavi.edu', phone: '+91 98765 43215', course: 'B.Tech IT', year: 1, joinedDate: '2024-08-10' },
  ],
};

const roomFacilities = [
  { icon: Wifi, label: 'Wi-Fi' },
  { icon: Wind, label: 'AC' },
  { icon: Droplets, label: 'Attached Bath' },
  { icon: Zap, label: 'Power Backup' },
];

export function RoomDetailsModal({ open, onOpenChange, room }: RoomDetailsModalProps) {
  if (!room) return null;

  const occupants = mockOccupants[room.id] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              room.status === 'available' && 'bg-success/10',
              room.status === 'full' && 'bg-primary/10',
              room.status === 'maintenance' && 'bg-warning/10'
            )}>
              <BedDouble className={cn(
                'h-6 w-6',
                room.status === 'available' && 'text-success',
                room.status === 'full' && 'text-primary',
                room.status === 'maintenance' && 'text-warning'
              )} />
            </div>
            <div>
              <span>Room {room.roomNumber}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusConfig[room.status].color}>
                  {statusConfig[room.status].label}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Room Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Layers className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium">Floor {room.floor}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <BedDouble className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium capitalize">{room.type}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium">{room.occupied}/{room.capacity}</p>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {roomFacilities.map((facility) => (
                <Badge key={facility.label} variant="outline" className="gap-1">
                  <facility.icon className="h-3 w-3" />
                  {facility.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Occupants */}
          <div>
            <h4 className="text-sm font-medium mb-3">Current Occupants</h4>
            {occupants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No occupants assigned
              </p>
            ) : (
              <div className="space-y-3">
                {occupants.map((occupant) => (
                  <div key={occupant.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {occupant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{occupant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {occupant.course} • Year {occupant.year}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {occupant.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

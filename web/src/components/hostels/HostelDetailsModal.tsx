import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  BedDouble, 
  Phone, 
  Mail,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Shield,
  Droplets,
  Zap,
  Dumbbell,
  Shirt,
  BookOpen,
  Heart,
  Coffee,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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

interface HostelDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostel: Hostel | null;
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/10 text-success border-success/20' },
  maintenance: { label: 'Under Maintenance', color: 'bg-warning/10 text-warning border-warning/20' },
  closed: { label: 'Closed', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Mess': Utensils,
  'Security': Shield,
  'Hot Water': Droplets,
  'Power Backup': Zap,
  '24x7 Guard': Shield,
  'Laundry': Shirt,
  'Gym': Dumbbell,
  'Common Room': Coffee,
  'Study Room': BookOpen,
  'Medical Room': Heart,
};

export function HostelDetailsModal({ open, onOpenChange, hostel }: HostelDetailsModalProps) {
  if (!hostel) return null;

  const occupancyPercent = Math.round((hostel.occupiedBeds / hostel.totalBeds) * 100);
  const availableBeds = hostel.totalBeds - hostel.occupiedBeds;
  const availableRooms = hostel.totalRooms - hostel.occupiedRooms;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              hostel.type === 'boys' ? 'bg-info/10' : 'bg-pink-500/10'
            )}>
              <Building2 className={cn(
                'h-6 w-6',
                hostel.type === 'boys' ? 'text-info' : 'text-pink-500'
              )} />
            </div>
            <div>
              <span>{hostel.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusConfig[hostel.status].color}>
                  {statusConfig[hostel.status].label}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {hostel.type} Hostel
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{hostel.location}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <BedDouble className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{hostel.totalRooms}</p>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{hostel.totalBeds}</p>
              <p className="text-xs text-muted-foreground">Total Beds</p>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <Users className="h-5 w-5 mx-auto text-success mb-1" />
              <p className="text-lg font-bold text-success">{hostel.occupiedBeds}</p>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <BedDouble className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold text-primary">{availableBeds}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Occupancy Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Occupancy Rate</span>
              <span className="font-semibold">{occupancyPercent}%</span>
            </div>
            <Progress value={occupancyPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{hostel.occupiedBeds} / {hostel.totalBeds} beds filled</span>
              <span>{availableRooms} rooms available</span>
            </div>
          </div>

          <Separator />

          {/* Warden Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Warden Information</h4>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="font-medium">{hostel.warden.name}</p>
              {hostel.warden.phone !== '-' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${hostel.warden.phone}`} className="hover:text-primary transition-colors">
                    {hostel.warden.phone}
                  </a>
                </div>
              )}
              {hostel.warden.email !== '-' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${hostel.warden.email}`} className="hover:text-primary transition-colors">
                    {hostel.warden.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Facilities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Facilities ({hostel.facilities.length})</h4>
            {hostel.facilities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No facilities listed</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hostel.facilities.map((facility) => {
                  const Icon = facilityIcons[facility] || Shield;
                  return (
                    <Badge key={facility} variant="outline" className="gap-1.5 px-2.5 py-1">
                      <Icon className="h-3.5 w-3.5" />
                      {facility}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link to={`/rooms?hostel=${hostel.id}`}>
                <BedDouble className="h-4 w-4 mr-2" />
                View Rooms
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to={`/students?hostel=${hostel.id}`}>
                <Users className="h-4 w-4 mr-2" />
                View Students
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

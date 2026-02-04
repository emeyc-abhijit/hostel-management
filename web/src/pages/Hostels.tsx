import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  Users, 
  BedDouble, 
  Phone, 
  MapPin,
  Wifi,
  Car,
  Utensils,
  Shield,
  Droplets,
  Zap,
  Plus,
  Settings,
  Eye,
  Edit,
  MoreVertical,
  Trash2,
  Search,
  Dumbbell,
  Shirt,
  BookOpen,
  Heart,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AddHostelModal } from '@/components/hostels/AddHostelModal';
import { EditHostelModal } from '@/components/hostels/EditHostelModal';
import { HostelDetailsModal } from '@/components/hostels/HostelDetailsModal';

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

const initialHostels: Hostel[] = [
  {
    id: '1',
    name: 'Boys Hostel A',
    type: 'boys',
    totalRooms: 100,
    occupiedRooms: 92,
    totalBeds: 300,
    occupiedBeds: 276,
    warden: { name: 'Mr. Suresh Sharma', phone: '+91 98765 43210', email: 'suresh.sharma@medhavi.edu' },
    location: 'North Campus, Block A',
    facilities: ['WiFi', 'Parking', 'Mess', 'Security', 'Hot Water', 'Power Backup'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Boys Hostel B',
    type: 'boys',
    totalRooms: 80,
    occupiedRooms: 75,
    totalBeds: 240,
    occupiedBeds: 225,
    warden: { name: 'Mr. Rajesh Kumar', phone: '+91 98765 43211', email: 'rajesh.kumar@medhavi.edu' },
    location: 'North Campus, Block B',
    facilities: ['WiFi', 'Parking', 'Mess', 'Security', 'Power Backup'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Boys Hostel C',
    type: 'boys',
    totalRooms: 60,
    occupiedRooms: 45,
    totalBeds: 180,
    occupiedBeds: 135,
    warden: { name: 'Mr. Anil Verma', phone: '+91 98765 43212', email: 'anil.verma@medhavi.edu' },
    location: 'East Campus, Block C',
    facilities: ['WiFi', 'Mess', 'Security', 'Power Backup'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Girls Hostel A',
    type: 'girls',
    totalRooms: 90,
    occupiedRooms: 88,
    totalBeds: 270,
    occupiedBeds: 264,
    warden: { name: 'Mrs. Priya Patel', phone: '+91 98765 43213', email: 'priya.patel@medhavi.edu' },
    location: 'South Campus, Block A',
    facilities: ['WiFi', 'Mess', 'Security', 'Hot Water', 'Power Backup', '24x7 Guard'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Girls Hostel B',
    type: 'girls',
    totalRooms: 70,
    occupiedRooms: 65,
    totalBeds: 210,
    occupiedBeds: 195,
    warden: { name: 'Mrs. Kavita Singh', phone: '+91 98765 43214', email: 'kavita.singh@medhavi.edu' },
    location: 'South Campus, Block B',
    facilities: ['WiFi', 'Mess', 'Security', 'Hot Water', 'Power Backup'],
    status: 'active'
  },
  {
    id: '6',
    name: 'PG Hostel',
    type: 'boys',
    totalRooms: 40,
    occupiedRooms: 0,
    totalBeds: 80,
    occupiedBeds: 0,
    warden: { name: 'TBA', phone: '-', email: '-' },
    location: 'West Campus',
    facilities: ['WiFi', 'Parking', 'Security'],
    status: 'maintenance'
  },
];

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

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/10 text-success border-success/20' },
  maintenance: { label: 'Under Maintenance', color: 'bg-warning/10 text-warning border-warning/20' },
  closed: { label: 'Closed', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function Hostels() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hostels, setHostels] = useState<Hostel[]>(initialHostels);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch = hostel.name.toLowerCase().includes(search.toLowerCase()) ||
                          hostel.location.toLowerCase().includes(search.toLowerCase()) ||
                          hostel.warden.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || hostel.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || hostel.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const boysHostels = filteredHostels.filter(h => h.type === 'boys');
  const girlsHostels = filteredHostels.filter(h => h.type === 'girls');

  const totalStats = hostels.reduce((acc, hostel) => ({
    totalRooms: acc.totalRooms + hostel.totalRooms,
    occupiedRooms: acc.occupiedRooms + hostel.occupiedRooms,
    totalBeds: acc.totalBeds + hostel.totalBeds,
    occupiedBeds: acc.occupiedBeds + hostel.occupiedBeds,
  }), { totalRooms: 0, occupiedRooms: 0, totalBeds: 0, occupiedBeds: 0 });

  const overallOccupancy = totalStats.totalBeds > 0 
    ? Math.round((totalStats.occupiedBeds / totalStats.totalBeds) * 100) 
    : 0;

  const handleAddHostel = (newHostel: Omit<Hostel, 'id' | 'occupiedRooms' | 'occupiedBeds'>) => {
    const id = (Math.max(...hostels.map(h => parseInt(h.id))) + 1).toString();
    setHostels([...hostels, { ...newHostel, id, occupiedRooms: 0, occupiedBeds: 0 }]);
  };

  const handleUpdateHostel = (updatedHostel: Hostel) => {
    setHostels(hostels.map(h => h.id === updatedHostel.id ? updatedHostel : h));
  };

  const handleDeleteHostel = (hostelId: string) => {
    setHostels(hostels.filter(h => h.id !== hostelId));
  };

  const openDetailsModal = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setDetailsModalOpen(true);
  };

  const openEditModal = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setEditModalOpen(true);
  };

  return (
    <DashboardLayout 
      title="Hostels Management" 
      subtitle={`Managing ${hostels.length} hostel buildings across campus`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{hostels.length}</p>
                  <p className="text-xs text-muted-foreground">Total Hostels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-2.5">
                  <BedDouble className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{totalStats.totalRooms}</p>
                  <p className="text-xs text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2.5">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{totalStats.occupiedBeds}</p>
                  <p className="text-xs text-muted-foreground">Current Occupancy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{overallOccupancy}%</p>
                  <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                </div>
                <div className="h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90 transform">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeDasharray={`${(overallOccupancy / 100) * 125.6} 125.6`}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4">
          {/* Search and Add Button Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hostels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {isAdmin && (
              <Button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Hostel
              </Button>
            )}
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full xs:w-[130px] sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="boys">Boys</SelectItem>
                <SelectItem value="girls">Girls</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full xs:w-[140px] sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Boys Hostels */}
        {boysHostels.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-info"></div>
              <h2 className="text-lg font-semibold">Boys Hostels ({boysHostels.length})</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {boysHostels.map((hostel) => (
                <HostelCard 
                  key={hostel.id} 
                  hostel={hostel} 
                  isAdmin={isAdmin}
                  onView={openDetailsModal}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Girls Hostels */}
        {girlsHostels.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-pink-500"></div>
              <h2 className="text-lg font-semibold">Girls Hostels ({girlsHostels.length})</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {girlsHostels.map((hostel) => (
                <HostelCard 
                  key={hostel.id} 
                  hostel={hostel}
                  isAdmin={isAdmin}
                  onView={openDetailsModal}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          </div>
        )}

        {filteredHostels.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-medium text-foreground">No hostels found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddHostelModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddHostel={handleAddHostel}
      />

      <EditHostelModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        hostel={selectedHostel}
        onUpdateHostel={handleUpdateHostel}
        onDeleteHostel={handleDeleteHostel}
      />

      <HostelDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        hostel={selectedHostel}
      />
    </DashboardLayout>
  );
}

interface HostelCardProps {
  hostel: Hostel;
  isAdmin: boolean;
  onView: (hostel: Hostel) => void;
  onEdit: (hostel: Hostel) => void;
}

function HostelCard({ hostel, isAdmin, onView, onEdit }: HostelCardProps) {
  const occupancyPercent = hostel.totalBeds > 0 
    ? Math.round((hostel.occupiedBeds / hostel.totalBeds) * 100) 
    : 0;
  const availableBeds = hostel.totalBeds - hostel.occupiedBeds;

  return (
    <Card className="group shadow-card transition-all duration-300 hover:shadow-card-hover overflow-hidden">
      {/* Header */}
      <div className={cn(
        'p-4 relative',
        hostel.type === 'boys' ? 'bg-info/5' : 'bg-pink-500/5'
      )}>
        {/* Dropdown Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(hostel)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(hostel)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Hostel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start gap-3">
          <div className={cn(
            'rounded-lg p-2.5',
            hostel.type === 'boys' ? 'bg-info/10' : 'bg-pink-500/10'
          )}>
            <Building2 className={cn(
              'h-6 w-6',
              hostel.type === 'boys' ? 'text-info' : 'text-pink-500'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">{hostel.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {hostel.location}
            </p>
          </div>
          <Badge className={cn(statusConfig[hostel.status].color, 'flex-shrink-0')}>
            {statusConfig[hostel.status].label}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Capacity Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-lg font-bold text-card-foreground">{hostel.totalRooms}</p>
            <p className="text-[10px] text-muted-foreground">Rooms</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-lg font-bold text-success">{hostel.occupiedBeds}</p>
            <p className="text-[10px] text-muted-foreground">Occupied</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-lg font-bold text-primary">{availableBeds}</p>
            <p className="text-[10px] text-muted-foreground">Available</p>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-medium">{occupancyPercent}%</span>
          </div>
          <Progress value={occupancyPercent} className="h-2" />
        </div>

        {/* Warden Info */}
        <div className="rounded-lg bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Warden</p>
          <p className="text-sm font-medium truncate">{hostel.warden.name}</p>
          {hostel.warden.phone !== '-' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {hostel.warden.phone}
            </div>
          )}
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1.5">
          {hostel.facilities.slice(0, 4).map((facility) => {
            const Icon = facilityIcons[facility] || Shield;
            return (
              <Badge key={facility} variant="outline" className="text-[10px] gap-1 px-1.5 py-0.5">
                <Icon className="h-2.5 w-2.5" />
                {facility}
              </Badge>
            );
          })}
          {hostel.facilities.length > 4 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
              +{hostel.facilities.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(hostel)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {isAdmin ? (
            <Button variant="default" size="sm" className="flex-1" onClick={() => onEdit(hostel)}>
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          ) : (
            <Button variant="default" size="sm" className="flex-1" onClick={() => onView(hostel)}>
              <BedDouble className="h-4 w-4 mr-1" />
              Rooms
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

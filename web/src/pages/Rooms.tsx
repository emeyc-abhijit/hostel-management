import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BedDouble, Plus, Search, Users, Wrench, UserPlus, Eye, MoreVertical, Edit, Trash2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import { RoomAllocationModal } from '@/components/rooms/RoomAllocationModal';
import { RoomDetailsModal } from '@/components/rooms/RoomDetailsModal';
import { AddRoomModal } from '@/components/rooms/AddRoomModal';
import { EditRoomModal } from '@/components/rooms/EditRoomModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const mockHostels = [
  { id: '1', name: 'Saraswati Bhawan (Girls)' },
  { id: '2', name: 'Vivekananda Bhawan (Boys)' },
  { id: '3', name: 'Tagore Bhawan (Girls)' },
  { id: '4', name: 'Nehru Bhawan (Boys)' },
];

const initialRooms: Room[] = [
  { id: '1', hostelId: '1', roomNumber: '101', floor: 1, capacity: 3, occupied: 3, type: 'triple', status: 'full' },
  { id: '2', hostelId: '1', roomNumber: '102', floor: 1, capacity: 2, occupied: 1, type: 'double', status: 'available' },
  { id: '3', hostelId: '1', roomNumber: '103', floor: 1, capacity: 1, occupied: 0, type: 'single', status: 'available' },
  { id: '4', hostelId: '1', roomNumber: '104', floor: 1, capacity: 3, occupied: 3, type: 'triple', status: 'full' },
  { id: '5', hostelId: '1', roomNumber: '105', floor: 1, capacity: 2, occupied: 0, type: 'double', status: 'maintenance' },
  { id: '6', hostelId: '2', roomNumber: '201', floor: 2, capacity: 3, occupied: 2, type: 'triple', status: 'available' },
  { id: '7', hostelId: '2', roomNumber: '202', floor: 2, capacity: 2, occupied: 2, type: 'double', status: 'full' },
  { id: '8', hostelId: '2', roomNumber: '203', floor: 2, capacity: 1, occupied: 1, type: 'single', status: 'full' },
  { id: '9', hostelId: '3', roomNumber: '204', floor: 2, capacity: 3, occupied: 1, type: 'triple', status: 'available' },
  { id: '10', hostelId: '3', roomNumber: '205', floor: 2, capacity: 2, occupied: 0, type: 'double', status: 'available' },
  { id: '11', hostelId: '4', roomNumber: '301', floor: 3, capacity: 3, occupied: 3, type: 'triple', status: 'full' },
  { id: '12', hostelId: '4', roomNumber: '302', floor: 3, capacity: 2, occupied: 1, type: 'double', status: 'available' },
];

const statusConfig = {
  available: { label: 'Available', color: 'bg-success/10 text-success border-success/20' },
  full: { label: 'Full', color: 'bg-primary/10 text-primary border-primary/20' },
  maintenance: { label: 'Maintenance', color: 'bg-warning/10 text-warning border-warning/20' },
};

export default function Rooms() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Modal states
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    const matchesHostel = hostelFilter === 'all' || room.hostelId === hostelFilter;
    return matchesSearch && matchesStatus && matchesFloor && matchesHostel;
  });

  const floors = [...new Set(rooms.map((room) => room.floor))].sort();

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    full: rooms.filter(r => r.status === 'full').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    totalBeds: rooms.reduce((sum, r) => sum + r.capacity, 0),
    occupiedBeds: rooms.reduce((sum, r) => sum + r.occupied, 0),
  };

  const handleAllocate = (roomId: string, studentIds: string[]) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          const newOccupied = room.occupied + studentIds.length;
          return {
            ...room,
            occupied: newOccupied,
            status: newOccupied >= room.capacity ? 'full' : 'available',
          };
        }
        return room;
      })
    );
  };

  const handleDeallocate = (roomId: string, studentId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId && room.occupied > 0) {
          const newOccupied = room.occupied - 1;
          return {
            ...room,
            occupied: newOccupied,
            status: room.status === 'maintenance' ? 'maintenance' : (newOccupied < room.capacity ? 'available' : 'full'),
          };
        }
        return room;
      })
    );
  };

  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => {
    const id = (Math.max(...rooms.map(r => parseInt(r.id))) + 1).toString();
    setRooms([...rooms, { ...newRoom, id }]);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
  };

  const handleSetMaintenance = (room: Room) => {
    const newStatus = room.status === 'maintenance' ? 
      (room.occupied >= room.capacity ? 'full' : 'available') : 
      'maintenance';
    
    setRooms(rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
    
    toast({
      title: newStatus === 'maintenance' ? 'Room Under Maintenance' : 'Room Available',
      description: `Room ${room.roomNumber} status updated.`,
    });
  };

  const openAllocationModal = (room: Room) => {
    setSelectedRoom(room);
    setAllocationModalOpen(true);
  };

  const openDetailsModal = (room: Room) => {
    setSelectedRoom(room);
    setDetailsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setEditModalOpen(true);
  };

  const getHostelName = (hostelId: string) => {
    return mockHostels.find(h => h.id === hostelId)?.name || 'Unknown';
  };

  return (
    <DashboardLayout title="Room Management" subtitle="Manage and allocate hostel rooms">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col gap-4">
          {/* Search and Add Button Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {isAdmin && (
              <Button onClick={() => setAddModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            )}
          </div>
          
          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <Select value={hostelFilter} onValueChange={setHostelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hostels</SelectItem>
                {mockHostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id}>
                    {hostel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map((floor) => (
                  <SelectItem key={floor} value={floor.toString()}>
                    Floor {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Room Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <BedDouble className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Rooms</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-success">
              <BedDouble className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.available}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Available</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.full}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Full</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-warning">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.maintenance}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Maintenance</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.totalBeds}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Beds</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 text-center shadow-card">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xl sm:text-2xl font-bold">{stats.occupiedBeds}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Occupied</p>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              {/* Room Actions Dropdown */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDetailsModal(room)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAllocationModal(room)} disabled={room.status === 'maintenance'}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Allocation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => openEditModal(room)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Room
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetMaintenance(room)}>
                          <Settings2 className="h-4 w-4 mr-2" />
                          {room.status === 'maintenance' ? 'Remove Maintenance' : 'Set Maintenance'}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4 flex items-center gap-3">
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
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Floor {room.floor} • {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3 truncate">
                {getHostelName(room.hostelId)}
              </p>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {room.occupied} / {room.capacity} beds
                  </span>
                </div>
                <Badge className={statusConfig[room.status].color}>
                  {statusConfig[room.status].label}
                </Badge>
              </div>

              {/* Occupancy Bar */}
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    room.status === 'available' && 'bg-success',
                    room.status === 'full' && 'bg-primary',
                    room.status === 'maintenance' && 'bg-warning'
                  )}
                  style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDetailsModal(room)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                {room.status !== 'maintenance' && (
                  <Button
                    variant={room.status === 'available' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => openAllocationModal(room)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {room.status === 'full' ? 'Manage' : 'Allocate'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <BedDouble className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="font-medium text-foreground">No rooms found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RoomAllocationModal
        open={allocationModalOpen}
        onOpenChange={setAllocationModalOpen}
        room={selectedRoom}
        onAllocate={handleAllocate}
        onDeallocate={handleDeallocate}
      />

      <RoomDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        room={selectedRoom}
      />

      <AddRoomModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddRoom={handleAddRoom}
        hostels={mockHostels}
      />

      <EditRoomModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        room={selectedRoom}
        onUpdateRoom={handleUpdateRoom}
        onDeleteRoom={handleDeleteRoom}
        hostels={mockHostels}
      />
    </DashboardLayout>
  );
}

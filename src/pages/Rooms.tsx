import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Building, Filter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { mockRooms } from '@/lib/mockData';
import { Room } from '@/types';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Rooms() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hostelFilter, setHostelFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  
  const rooms = mockRooms;
  
  // Get unique values for filters
  const hostels = Array.from(new Set(rooms.map(r => r.hostel)));
  const floors = Array.from(new Set(rooms.map(r => r.floor)));

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'occupied':
        return 'bg-primary text-primary-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'reserved':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesHostel = hostelFilter === 'all' || room.hostel === hostelFilter;
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    
    return matchesStatus && matchesHostel && matchesFloor;
  });

  const summary = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
    reserved: rooms.filter((r) => r.status === 'reserved').length,
    totalCapacity: rooms.reduce((acc, r) => acc + r.capacity, 0),
    totalOccupied: rooms.reduce((acc, r) => acc + r.occupied, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">Manage hostel rooms and occupancy</p>
        </div>
        <Button onClick={() => navigate('/rooms/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{summary.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{summary.occupied}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{summary.maintenance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.totalCapacity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-info">
              {Math.round((summary.totalOccupied / summary.totalCapacity) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Room Directory
            </CardTitle>
            <div className="flex gap-2">
              <Select value={hostelFilter} onValueChange={setHostelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Hostels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hostels</SelectItem>
                  {hostels.map(hostel => (
                    <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map(floor => (
                    <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                <Badge className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{room.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Floor</span>
                <span className="font-medium">Floor {room.floor}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="h-4 w-4" />
                  {room.occupied}/{room.capacity}
                </span>
              </div>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to={`/rooms/${room.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

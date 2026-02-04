import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BedDouble, 
  Building2, 
  Users, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  CalendarDays,
  CreditCard,
  Wifi,
  Zap,
  Droplets,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Roommate {
  id: string;
  name: string;
  course: string;
  year: number;
  phone: string;
  email: string;
}

// Mock data for student's room
const roomData = {
  roomNumber: '204',
  floor: 2,
  hostel: 'Boys Hostel A',
  type: 'Triple Sharing',
  capacity: 3,
  location: 'North Campus, Block A',
  checkInDate: '2023-07-20',
  facilities: ['WiFi', 'Power Backup', 'Hot Water', 'Attached Bathroom'],
  warden: {
    name: 'Mr. Suresh Sharma',
    phone: '+91 98765 43210',
    email: 'suresh.sharma@medhavi.edu',
  },
};

const roommates: Roommate[] = [
  { id: '1', name: 'Rahul Sharma', course: 'B.Tech CSE', year: 2, phone: '+91 98765 43211', email: 'rahul.sharma@medhavi.edu' },
  { id: '2', name: 'Amit Kumar', course: 'B.Tech ECE', year: 2, phone: '+91 98765 43212', email: 'amit.kumar@medhavi.edu' },
];

const recentComplaints = [
  { id: '1', subject: 'WiFi connectivity issue', status: 'resolved', date: '2024-01-10' },
  { id: '2', subject: 'Water heater not working', status: 'in-progress', date: '2024-01-12' },
];

const leaveHistory = [
  { id: '1', from: '2024-01-05', to: '2024-01-07', reason: 'Family function', status: 'approved' },
  { id: '2', from: '2024-01-20', to: '2024-01-22', reason: 'Medical appointment', status: 'pending' },
];

const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'WiFi': Wifi,
  'Power Backup': Zap,
  'Hot Water': Droplets,
  'Attached Bathroom': Shield,
};

const statusConfig = {
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: 'bg-warning/10 text-warning', icon: Clock },
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  approved: { label: 'Approved', color: 'bg-success/10 text-success', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

export default function MyRoom() {
  const { user } = useAuth();

  return (
    <DashboardLayout 
      title="My Room" 
      subtitle={`Room ${roomData.roomNumber}, ${roomData.hostel}`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Room Overview Card */}
        <Card className="shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-4">
                  <BedDouble className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Room {roomData.roomNumber}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4" />
                    {roomData.hostel} • Floor {roomData.floor}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {roomData.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {roomData.type}
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Room Details */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Room Details
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{roomData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{roomData.capacity} beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor</span>
                    <span className="font-medium">{roomData.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in Date</span>
                    <span className="font-medium">{new Date(roomData.checkInDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Room Facilities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {roomData.facilities.map((facility) => {
                    const Icon = facilityIcons[facility] || Shield;
                    return (
                      <div 
                        key={facility}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/complaints">
            <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2.5 group-hover:bg-warning/20 transition-colors">
                  <MessageSquare className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">File Complaint</p>
                  <p className="text-xs text-muted-foreground">Report issues</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/attendance">
            <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg bg-info/10 p-2.5 group-hover:bg-info/20 transition-colors">
                  <CalendarDays className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium">Apply Leave</p>
                  <p className="text-xs text-muted-foreground">Request time off</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/fees">
            <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2.5 group-hover:bg-success/20 transition-colors">
                  <CreditCard className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Pay Fees</p>
                  <p className="text-xs text-muted-foreground">View payments</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/notices">
            <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Notices</p>
                  <p className="text-xs text-muted-foreground">View updates</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Roommates */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Roommates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roommates.map((roommate) => (
                <div 
                  key={roommate.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {roommate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{roommate.name}</p>
                    <p className="text-sm text-muted-foreground">{roommate.course} • Year {roommate.year}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {roommates.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No roommates assigned yet</p>
              )}
            </CardContent>
          </Card>

          {/* Warden Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Hostel Warden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {roomData.warden.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{roomData.warden.name}</p>
                  <p className="text-sm text-muted-foreground">Hostel Warden</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {roomData.warden.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="default" className="flex-1">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Complaints */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Complaints
              </CardTitle>
              <Link to="/complaints">
                <Button variant="ghost" size="sm">
                  View All
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentComplaints.map((complaint) => {
                const StatusIcon = statusConfig[complaint.status as keyof typeof statusConfig].icon;
                return (
                  <div 
                    key={complaint.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{complaint.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={cn('gap-1', statusConfig[complaint.status as keyof typeof statusConfig].color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[complaint.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Leave History
              </CardTitle>
              <Link to="/attendance">
                <Button variant="ghost" size="sm">
                  View All
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveHistory.map((leave) => {
                const StatusIcon = statusConfig[leave.status as keyof typeof statusConfig].icon;
                return (
                  <div 
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{leave.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={cn('gap-1', statusConfig[leave.status as keyof typeof statusConfig].color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[leave.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

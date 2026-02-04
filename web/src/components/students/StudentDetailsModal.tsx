import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  User, 
  Mail, 
  Phone, 
  BedDouble, 
  GraduationCap, 
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Edit,
  FileText,
  Building2,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ClipboardList,
  CalendarDays,
  LogOut,
  MessageSquare,
  Home,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  hostel: string;
  roomNumber: string;
  admissionDate: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  status: 'active' | 'inactive' | 'graduated';
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
}

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentData | null;
  onEdit: () => void;
}

const feeStatusConfig = {
  paid: { label: 'Paid', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/10 text-success border-success/20' },
  inactive: { label: 'Inactive', color: 'bg-muted text-muted-foreground border-border' },
  graduated: { label: 'Graduated', color: 'bg-primary/10 text-primary border-primary/20' },
};

// Mock data for fee history
const feeHistory = [
  { id: '1', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-10', status: 'paid' as const, transactionId: 'TXN001234567' },
  { id: '2', semester: 'Even 2023-24', amount: 48000, dueDate: '2024-01-15', paidDate: '2024-01-12', status: 'paid' as const, transactionId: 'TXN001234123' },
  { id: '3', semester: 'Odd 2023-24', amount: 48000, dueDate: '2023-08-15', paidDate: '2023-08-14', status: 'paid' as const, transactionId: 'TXN001233456' },
];

// Mock data for attendance
const attendanceData = {
  totalDays: 120,
  present: 112,
  absent: 5,
  leave: 3,
  percentage: 93.3,
  recentRecords: [
    { date: '2025-01-12', status: 'present' as const },
    { date: '2025-01-11', status: 'present' as const },
    { date: '2025-01-10', status: 'present' as const },
    { date: '2025-01-09', status: 'leave' as const },
    { date: '2025-01-08', status: 'present' as const },
    { date: '2025-01-07', status: 'absent' as const },
    { date: '2025-01-06', status: 'present' as const },
  ]
};

// Mock data for leave records
const leaveRecords = [
  { id: '1', fromDate: '2025-01-09', toDate: '2025-01-09', reason: 'Medical appointment', status: 'approved' as const, appliedAt: '2025-01-07' },
  { id: '2', fromDate: '2024-12-24', toDate: '2024-12-26', reason: 'Family function', status: 'approved' as const, appliedAt: '2024-12-20' },
  { id: '3', fromDate: '2024-11-15', toDate: '2024-11-17', reason: 'Personal work at home', status: 'approved' as const, appliedAt: '2024-11-12' },
];

// Mock data for complaints
const complaintHistory: Array<{
  id: string;
  subject: string;
  category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}> = [
  { id: '1', subject: 'AC not working', category: 'electrical', status: 'resolved', priority: 'high', createdAt: '2025-01-05', resolvedAt: '2025-01-06' },
  { id: '2', subject: 'Water leakage in bathroom', category: 'plumbing', status: 'resolved', priority: 'medium', createdAt: '2024-12-18', resolvedAt: '2024-12-20' },
  { id: '3', subject: 'Room cleaning request', category: 'cleanliness', status: 'resolved', priority: 'low', createdAt: '2024-11-25', resolvedAt: '2024-11-25' },
];

// Room details mock
const roomDetails = {
  roomNumber: '204',
  floor: 2,
  type: 'Double',
  hostelName: 'Vivekananda Hostel',
  hostelType: 'Boys',
  warden: 'Mr. Rajesh Sharma',
  wardenPhone: '+91 98765 43210',
  roommates: [
    { name: 'Vikash Kumar', course: 'B.Tech CS', year: 3 }
  ],
  checkInDate: '2023-08-01',
  facilities: ['AC', 'Attached Bathroom', 'Study Table', 'WiFi']
};

const attendanceStatusConfig = {
  present: { label: 'P', color: 'bg-success text-success-foreground' },
  absent: { label: 'A', color: 'bg-destructive text-destructive-foreground' },
  leave: { label: 'L', color: 'bg-warning text-warning-foreground' },
};

const leaveStatusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20' },
  approved: { label: 'Approved', color: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const complaintStatusConfig = {
  open: { label: 'Open', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  'in-progress': { label: 'In Progress', color: 'bg-warning/10 text-warning border-warning/20' },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20' },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border' },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  high: { label: 'High', color: 'bg-destructive/10 text-destructive' },
};

export function StudentDetailsModal({ open, onOpenChange, student, onEdit }: StudentDetailsModalProps) {
  if (!student) return null;

  const FeeStatusIcon = feeStatusConfig[student.feeStatus].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Student Profile
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground">{student.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {student.course} • Year {student.year}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Student ID: STU-{student.id.padStart(4, '0')}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={cn(statusConfig[student.status].color)}>
                    {statusConfig[student.status].label}
                  </Badge>
                  <Badge className={cn(feeStatusConfig[student.feeStatus].color)}>
                    <FeeStatusIcon className="h-3 w-3 mr-1" />
                    Fee: {feeStatusConfig[student.feeStatus].label}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Building2 className="h-3 w-3" />
                    {student.hostel || 'Not Assigned'}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Home className="h-3 w-3" />
                    Room {student.roomNumber || 'N/A'}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="text-xs sm:text-sm gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="room" className="text-xs sm:text-sm gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Room</span>
                </TabsTrigger>
                <TabsTrigger value="fees" className="text-xs sm:text-sm gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Fees</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="text-xs sm:text-sm gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="complaints" className="text-xs sm:text-sm gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Complaints</span>
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4">
                {/* Contact Information */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{student.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Phone</p>
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {student.phone}
                        </p>
                      </div>
                      {student.address && (
                        <div className="space-y-1 col-span-2">
                          <p className="text-xs font-medium text-muted-foreground">Address</p>
                          <p className="text-sm flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {student.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Course</p>
                        <p className="text-sm font-medium">{student.course}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Year</p>
                        <p className="text-sm font-medium">Year {student.year}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Admission Date</p>
                        <p className="text-sm flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(student.admissionDate).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Student ID</p>
                        <p className="text-sm font-mono">STU-{student.id.padStart(4, '0')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Guardian Information */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Guardian Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Guardian Name</p>
                        <p className="text-sm">{student.guardianName || 'Not Provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Guardian Phone</p>
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {student.guardianPhone || 'Not Provided'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Room & Hostel Tab */}
              <TabsContent value="room" className="space-y-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Hostel Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Hostel Name</p>
                        <p className="text-sm font-medium">{roomDetails.hostelName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Hostel Type</p>
                        <Badge variant="outline">{roomDetails.hostelType}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Warden</p>
                        <p className="text-sm">{roomDetails.warden}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Warden Contact</p>
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {roomDetails.wardenPhone}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-primary" />
                      Room Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Room Number</p>
                        <p className="text-sm font-medium">{roomDetails.roomNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Floor</p>
                        <p className="text-sm">{roomDetails.floor}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Room Type</p>
                        <Badge variant="secondary">{roomDetails.type}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Check-in Date</p>
                        <p className="text-sm flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(roomDetails.checkInDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-xs font-medium text-muted-foreground">Facilities</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {roomDetails.facilities.map((facility) => (
                            <Badge key={facility} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {roomDetails.roommates.length > 0 && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Roommates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {roomDetails.roommates.map((roommate, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {roommate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{roommate.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {roommate.course} • Year {roommate.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Fees Tab */}
              <TabsContent value="fees" className="space-y-4">
                {/* Fee Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className={cn(
                    "border",
                    student.feeStatus === 'paid' && "border-success/20 bg-success/5",
                    student.feeStatus === 'pending' && "border-warning/20 bg-warning/5",
                    student.feeStatus === 'overdue' && "border-destructive/20 bg-destructive/5"
                  )}>
                    <CardContent className="p-3 text-center">
                      <FeeStatusIcon className={cn(
                        "h-6 w-6 mx-auto mb-1",
                        student.feeStatus === 'paid' && "text-success",
                        student.feeStatus === 'pending' && "text-warning",
                        student.feeStatus === 'overdue' && "text-destructive"
                      )} />
                      <p className="text-lg font-bold capitalize">{student.feeStatus}</p>
                      <p className="text-xs text-muted-foreground">Current Status</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <IndianRupee className="h-6 w-6 mx-auto mb-1 text-primary" />
                      <p className="text-lg font-bold">₹50,500</p>
                      <p className="text-xs text-muted-foreground">Current Due</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <CheckCircle className="h-6 w-6 mx-auto mb-1 text-success" />
                      <p className="text-lg font-bold">₹1.47L</p>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Fee History */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Semester</TableHead>
                          <TableHead className="text-xs">Amount</TableHead>
                          <TableHead className="text-xs">Paid Date</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeHistory.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="text-xs font-medium">{fee.semester}</TableCell>
                            <TableCell className="text-xs">₹{fee.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-xs">
                              {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString('en-IN') : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={cn('text-xs', feeStatusConfig[fee.status].color)}>
                                {feeStatusConfig[fee.status].label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                {/* Attendance Summary */}
                <div className="grid grid-cols-4 gap-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-primary">{attendanceData.percentage}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-success/5 border-success/20">
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-success">{attendanceData.present}</p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-destructive">{attendanceData.absent}</p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-warning/5 border-warning/20">
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-warning">{attendanceData.leave}</p>
                      <p className="text-xs text-muted-foreground">Leave</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Attendance Progress */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Attendance Progress
                      </span>
                      <Badge variant={attendanceData.percentage >= 75 ? 'default' : 'destructive'}>
                        {attendanceData.percentage >= 75 ? 'Good Standing' : 'Below Minimum'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Progress value={attendanceData.percentage} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {attendanceData.present} out of {attendanceData.totalDays} days • Minimum required: 75%
                    </p>
                  </CardContent>
                </Card>

                {/* Recent Attendance */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      Recent Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2 flex-wrap">
                      {attendanceData.recentRecords.map((record, index) => (
                        <div key={index} className="text-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                            attendanceStatusConfig[record.status].color
                          )}>
                            {attendanceStatusConfig[record.status].label}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Leave Records */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LogOut className="h-4 w-4 text-primary" />
                      Leave History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Period</TableHead>
                          <TableHead className="text-xs">Reason</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveRecords.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell className="text-xs">
                              {new Date(leave.fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              {leave.fromDate !== leave.toDate && (
                                <> - {new Date(leave.toDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">{leave.reason}</TableCell>
                            <TableCell>
                              <Badge className={cn('text-xs', leaveStatusConfig[leave.status].color)}>
                                {leaveStatusConfig[leave.status].label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Complaints Tab */}
              <TabsContent value="complaints" className="space-y-4">
                {/* Complaint Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold">{complaintHistory.length}</p>
                      <p className="text-xs text-muted-foreground">Total Filed</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-success/5 border-success/20">
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-success">
                        {complaintHistory.filter(c => c.status === 'resolved').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <p className="text-xl font-bold text-warning">
                        {complaintHistory.filter(c => c.status === 'open' || c.status === 'in-progress').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Complaint History */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Complaint History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {complaintHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No complaints filed
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {complaintHistory.map((complaint) => (
                          <div key={complaint.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{complaint.subject}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {complaint.category}
                                  </Badge>
                                  <Badge className={cn('text-xs', priorityConfig[complaint.priority].color)}>
                                    {priorityConfig[complaint.priority].label}
                                  </Badge>
                                </div>
                              </div>
                              <Badge className={cn('text-xs', complaintStatusConfig[complaint.status].color)}>
                                {complaintStatusConfig[complaint.status].label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Filed: {new Date(complaint.createdAt).toLocaleDateString('en-IN')}</span>
                              {complaint.resolvedAt && (
                                <span className="text-success">
                                  Resolved: {new Date(complaint.resolvedAt).toLocaleDateString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4" />
                Documents
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="hero" onClick={onEdit}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

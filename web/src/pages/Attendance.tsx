import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Calendar as CalendarIcon,
  Check,
  X,
  Clock,
  Users,
  UserCheck,
  UserX,
  Search,
  Save,
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format, isToday, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord, LeaveRequest } from '@/types';

// Mock data for students
const mockStudents = [
  { id: '1', name: 'Rahul Kumar', roomNumber: '101', course: 'B.Tech CSE', year: 2 },
  { id: '2', name: 'Priya Sharma', roomNumber: '102', course: 'B.Tech ECE', year: 1 },
  { id: '3', name: 'Amit Singh', roomNumber: '103', course: 'BBA', year: 3 },
  { id: '4', name: 'Sneha Patel', roomNumber: '104', course: 'B.Tech CSE', year: 2 },
  { id: '5', name: 'Vikash Yadav', roomNumber: '105', course: 'MBA', year: 1 },
  { id: '6', name: 'Ananya Gupta', roomNumber: '106', course: 'B.Tech ME', year: 4 },
  { id: '7', name: 'Rohit Verma', roomNumber: '107', course: 'B.Tech CSE', year: 1 },
  { id: '8', name: 'Kavita Joshi', roomNumber: '108', course: 'BCA', year: 2 },
];

// Mock attendance records
const mockAttendanceRecords: (AttendanceRecord & { studentName: string; roomNumber: string })[] = [
  { id: '1', studentId: '1', studentName: 'Rahul Kumar', roomNumber: '101', date: '2026-01-12', status: 'present' },
  { id: '2', studentId: '2', studentName: 'Priya Sharma', roomNumber: '102', date: '2026-01-12', status: 'present' },
  { id: '3', studentId: '3', studentName: 'Amit Singh', roomNumber: '103', date: '2026-01-12', status: 'absent' },
  { id: '4', studentId: '4', studentName: 'Sneha Patel', roomNumber: '104', date: '2026-01-12', status: 'leave' },
  { id: '5', studentId: '5', studentName: 'Vikash Yadav', roomNumber: '105', date: '2026-01-12', status: 'present' },
  { id: '6', studentId: '1', studentName: 'Rahul Kumar', roomNumber: '101', date: '2026-01-11', status: 'present' },
  { id: '7', studentId: '2', studentName: 'Priya Sharma', roomNumber: '102', date: '2026-01-11', status: 'absent' },
];

// Mock leave requests
const mockLeaveRequests: LeaveRequest[] = [
  { id: '1', studentId: '1', studentName: 'Rahul Kumar', fromDate: '2026-01-15', toDate: '2026-01-18', reason: 'Family function - sister wedding', status: 'pending', appliedAt: '2026-01-10' },
  { id: '2', studentId: '4', studentName: 'Sneha Patel', fromDate: '2026-01-12', toDate: '2026-01-14', reason: 'Medical appointment in hometown', status: 'approved', appliedAt: '2026-01-08' },
  { id: '3', studentId: '3', studentName: 'Amit Singh', fromDate: '2026-01-20', toDate: '2026-01-22', reason: 'Personal emergency', status: 'pending', appliedAt: '2026-01-11' },
  { id: '4', studentId: '6', studentName: 'Ananya Gupta', fromDate: '2026-01-05', toDate: '2026-01-07', reason: 'Campus placement interview', status: 'rejected', appliedAt: '2026-01-03' },
];

const statusConfig = {
  present: { label: 'Present', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  leave: { label: 'On Leave', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertCircle },
};

const leaveStatusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isWarden = user?.role === 'warden' || user?.role === 'admin';
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
  });

  // Filter students based on search
  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roomNumber.includes(searchQuery)
  );

  // Get attendance for selected date
  const getAttendanceForDate = (studentId: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (attendanceData[`${studentId}-${dateStr}`]) {
      return attendanceData[`${studentId}-${dateStr}`];
    }
    const record = mockAttendanceRecords.find(
      r => r.studentId === studentId && r.date === dateStr
    );
    return record?.status || null;
  };

  // Mark attendance
  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setAttendanceData(prev => ({
      ...prev,
      [`${studentId}-${dateStr}`]: status,
    }));
  };

  // Save attendance
  const saveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(selectedDate, 'MMMM d, yyyy')} has been saved successfully.`,
    });
  };

  // Mark all present
  const markAllPresent = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const newData: Record<string, 'present' | 'absent' | 'leave'> = {};
    filteredStudents.forEach(student => {
      newData[`${student.id}-${dateStr}`] = 'present';
    });
    setAttendanceData(prev => ({ ...prev, ...newData }));
    toast({
      title: "All Marked Present",
      description: "All visible students have been marked as present.",
    });
  };

  // Submit leave request (for students)
  const submitLeaveRequest = () => {
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      studentId: user?.id || '',
      studentName: user?.name || '',
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      reason: leaveForm.reason,
      status: 'pending',
      appliedAt: format(new Date(), 'yyyy-MM-dd'),
    };

    setLeaveRequests(prev => [newLeave, ...prev]);
    setShowLeaveModal(false);
    setLeaveForm({ fromDate: '', toDate: '', reason: '' });
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
  };

  // Approve/Reject leave (for warden)
  const handleLeaveAction = (leaveId: string, action: 'approved' | 'rejected') => {
    setLeaveRequests(prev =>
      prev.map(leave =>
        leave.id === leaveId ? { ...leave, status: action } : leave
      )
    );
    setShowLeaveDetailsModal(false);
    toast({
      title: `Leave ${action === 'approved' ? 'Approved' : 'Rejected'}`,
      description: `The leave request has been ${action}.`,
    });
  };

  // Stats calculations
  const todayAttendance = mockAttendanceRecords.filter(r => r.date === format(new Date(), 'yyyy-MM-dd'));
  const presentCount = todayAttendance.filter(r => r.status === 'present').length;
  const absentCount = todayAttendance.filter(r => r.status === 'absent').length;
  const leaveCount = todayAttendance.filter(r => r.status === 'leave').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  // Student's own attendance (for student view)
  const myAttendance = mockAttendanceRecords.filter(r => r.studentId === '1'); // Assuming student id 1
  const myLeaves = leaveRequests.filter(l => l.studentId === '1');

  return (
    <DashboardLayout
      title="Attendance & Leave Management"
      subtitle={isWarden ? "Mark attendance and manage leave requests" : "View your attendance and apply for leave"}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{mockStudents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Present Today</p>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Absent Today</p>
              <p className="text-2xl font-bold">{absentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Leaves</p>
              <p className="text-2xl font-bold">{pendingLeaves}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={isWarden ? "mark-attendance" : "my-attendance"} className="space-y-6">
        <TabsList>
          {isWarden && <TabsTrigger value="mark-attendance">Mark Attendance</TabsTrigger>}
          {isWarden && <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>}
          {!isWarden && <TabsTrigger value="my-attendance">My Attendance</TabsTrigger>}
          {!isWarden && <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>}
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Warden: Mark Attendance Tab */}
        {isWarden && (
          <TabsContent value="mark-attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Selected Date</p>
                    <p className="text-lg font-bold">{format(selectedDate, 'MMMM d, yyyy')}</p>
                    {isToday(selectedDate) && (
                      <Badge className="mt-2">Today</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Table */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Mark Attendance</CardTitle>
                      <CardDescription>
                        Mark attendance for {format(selectedDate, 'MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={markAllPresent}>
                        <Check className="h-4 w-4 mr-2" />
                        Mark All Present
                      </Button>
                      <Button onClick={saveAttendance}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or room number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => {
                          const currentStatus = getAttendanceForDate(student.id);
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.roomNumber}</TableCell>
                              <TableCell>{student.course}</TableCell>
                              <TableCell>
                                {currentStatus ? (
                                  <Badge className={statusConfig[currentStatus].color}>
                                    {statusConfig[currentStatus].label}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Not Marked</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-1">
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'present' ? 'default' : 'outline'}
                                    className={currentStatus === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                    onClick={() => markAttendance(student.id, 'present')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'absent' ? 'default' : 'outline'}
                                    className={currentStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                                    onClick={() => markAttendance(student.id, 'absent')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={currentStatus === 'leave' ? 'default' : 'outline'}
                                    className={currentStatus === 'leave' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                    onClick={() => markAttendance(student.id, 'leave')}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Warden: Leave Requests Tab */}
        {isWarden && (
          <TabsContent value="leave-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Review and manage student leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-medium">{leave.studentName}</TableCell>
                          <TableCell>{format(new Date(leave.fromDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(new Date(leave.toDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                          <TableCell>{format(new Date(leave.appliedAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge className={leaveStatusConfig[leave.status].color}>
                              {leaveStatusConfig[leave.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedLeave(leave);
                                  setShowLeaveDetailsModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {leave.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleLeaveAction(leave.id, 'approved')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleLeaveAction(leave.id, 'rejected')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Student: My Attendance Tab */}
        {!isWarden && (
          <TabsContent value="my-attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Attendance Record</CardTitle>
                <CardDescription>View your hostel attendance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Present Days</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {myAttendance.filter(a => a.status === 'present').length}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Absent Days</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {myAttendance.filter(a => a.status === 'absent').length}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Leave Days</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {myAttendance.filter(a => a.status === 'leave').length}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.date), 'MMMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge className={statusConfig[record.status].color}>
                              {statusConfig[record.status].label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Student: My Leaves Tab */}
        {!isWarden && (
          <TabsContent value="my-leaves" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Leave Requests</CardTitle>
                  <CardDescription>View and apply for leave</CardDescription>
                </div>
                <Button onClick={() => setShowLeaveModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Leave
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myLeaves.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No leave requests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        myLeaves.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell>{format(new Date(leave.fromDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{format(new Date(leave.toDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                            <TableCell>{format(new Date(leave.appliedAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Badge className={leaveStatusConfig[leave.status].color}>
                                {leaveStatusConfig[leave.status].label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* History Tab (for both) */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View historical attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAttendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.roomNumber}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[record.status].color}>
                            {statusConfig[record.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Apply Leave Modal (for students) */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Submit a leave request for approval by the hostel warden
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={leaveForm.fromDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, fromDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={leaveForm.toDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, toDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for your leave request..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitLeaveRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Details Modal (for warden) */}
      <Dialog open={showLeaveDetailsModal} onOpenChange={setShowLeaveDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{selectedLeave.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={leaveStatusConfig[selectedLeave.status].color}>
                    {leaveStatusConfig[selectedLeave.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From Date</p>
                  <p className="font-medium">{format(new Date(selectedLeave.fromDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Date</p>
                  <p className="font-medium">{format(new Date(selectedLeave.toDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium">{format(new Date(selectedLeave.appliedAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{selectedLeave.reason}</p>
              </div>
              {selectedLeave.status === 'pending' && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleLeaveAction(selectedLeave.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleLeaveAction(selectedLeave.id, 'approved')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

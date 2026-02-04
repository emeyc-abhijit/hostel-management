import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { EditStudentModal } from '@/components/students/EditStudentModal';
import { StudentDetailsModal } from '@/components/students/StudentDetailsModal';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Plus, 
  Eye, 
  Mail, 
  Phone, 
  Download,
  Filter,
  Users,
  GraduationCap,
  BedDouble,
  CreditCard,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Building2,
  Home
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

const initialStudents: StudentData[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@medhavi.edu', phone: '+91 98765 43210', course: 'B.Tech CSE', year: 2, hostel: 'Boys Hostel A', roomNumber: '204', admissionDate: '2023-07-15', feeStatus: 'paid', status: 'active', guardianName: 'Mr. Sharma', guardianPhone: '+91 98765 00001', address: 'Delhi, India' },
  { id: '2', name: 'Priya Singh', email: 'priya.singh@medhavi.edu', phone: '+91 98765 43211', course: 'B.Tech ECE', year: 3, hostel: 'Girls Hostel A', roomNumber: '105', admissionDate: '2022-07-20', feeStatus: 'paid', status: 'active', guardianName: 'Mr. Singh', guardianPhone: '+91 98765 00002', address: 'Mumbai, India' },
  { id: '3', name: 'Amit Kumar', email: 'amit.kumar@medhavi.edu', phone: '+91 98765 43212', course: 'MBA', year: 1, hostel: 'Boys Hostel B', roomNumber: '301', admissionDate: '2024-01-10', feeStatus: 'pending', status: 'active', guardianName: 'Mr. Kumar', guardianPhone: '+91 98765 00003' },
  { id: '4', name: 'Sneha Patel', email: 'sneha.patel@medhavi.edu', phone: '+91 98765 43213', course: 'B.Tech IT', year: 4, hostel: 'Girls Hostel B', roomNumber: '202', admissionDate: '2021-07-18', feeStatus: 'paid', status: 'active', address: 'Ahmedabad, Gujarat' },
  { id: '5', name: 'Vikash Gupta', email: 'vikash.gupta@medhavi.edu', phone: '+91 98765 43214', course: 'B.Tech ME', year: 1, hostel: 'Boys Hostel A', roomNumber: '108', admissionDate: '2024-01-05', feeStatus: 'overdue', status: 'active' },
  { id: '6', name: 'Neha Agarwal', email: 'neha.agarwal@medhavi.edu', phone: '+91 98765 43215', course: 'B.Tech CSE', year: 2, hostel: 'Girls Hostel A', roomNumber: '112', admissionDate: '2023-07-22', feeStatus: 'paid', status: 'active', guardianName: 'Mrs. Agarwal', guardianPhone: '+91 98765 00006' },
  { id: '7', name: 'Ravi Verma', email: 'ravi.verma@medhavi.edu', phone: '+91 98765 43216', course: 'MCA', year: 1, hostel: 'Boys Hostel C', roomNumber: '405', admissionDate: '2024-01-12', feeStatus: 'pending', status: 'active' },
  { id: '8', name: 'Anjali Mehta', email: 'anjali.mehta@medhavi.edu', phone: '+91 98765 43217', course: 'B.Tech EE', year: 3, hostel: 'Girls Hostel B', roomNumber: '208', admissionDate: '2022-07-25', feeStatus: 'paid', status: 'active', address: 'Jaipur, Rajasthan' },
  { id: '9', name: 'Suresh Yadav', email: 'suresh.yadav@medhavi.edu', phone: '+91 98765 43218', course: 'B.Tech CSE', year: 2, hostel: 'Boys Hostel A', roomNumber: '215', admissionDate: '2023-07-28', feeStatus: 'paid', status: 'active' },
  { id: '10', name: 'Kavita Sharma', email: 'kavita.sharma@medhavi.edu', phone: '+91 98765 43219', course: 'B.Tech ECE', year: 4, hostel: 'Girls Hostel A', roomNumber: '118', admissionDate: '2021-07-30', feeStatus: 'overdue', status: 'active', guardianName: 'Mr. K. Sharma', guardianPhone: '+91 98765 00010' },
  { id: '11', name: 'Deepak Joshi', email: 'deepak.joshi@medhavi.edu', phone: '+91 98765 43220', course: 'MBA', year: 2, hostel: 'Boys Hostel B', roomNumber: '312', admissionDate: '2023-01-15', feeStatus: 'paid', status: 'active' },
  { id: '12', name: 'Pooja Reddy', email: 'pooja.reddy@medhavi.edu', phone: '+91 98765 43221', course: 'B.Tech IT', year: 1, hostel: 'Girls Hostel B', roomNumber: '225', admissionDate: '2024-01-08', feeStatus: 'pending', status: 'active', address: 'Hyderabad, Telangana' },
  { id: '13', name: 'Arjun Nair', email: 'arjun.nair@medhavi.edu', phone: '+91 98765 43222', course: 'B.Tech CSE', year: 3, hostel: 'Boys Hostel A', roomNumber: '310', admissionDate: '2022-07-15', feeStatus: 'paid', status: 'active' },
  { id: '14', name: 'Divya Iyer', email: 'divya.iyer@medhavi.edu', phone: '+91 98765 43223', course: 'B.Tech ECE', year: 2, hostel: 'Girls Hostel A', roomNumber: '120', admissionDate: '2023-07-18', feeStatus: 'paid', status: 'active' },
  { id: '15', name: 'Karan Malhotra', email: 'karan.malhotra@medhavi.edu', phone: '+91 98765 43224', course: 'BBA', year: 1, hostel: 'Boys Hostel C', roomNumber: '412', admissionDate: '2024-01-20', feeStatus: 'pending', status: 'active' },
];

const feeStatusConfig = {
  paid: { label: 'Paid', color: 'bg-success/10 text-success border-success/20' },
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20' },
  overdue: { label: 'Overdue', color: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const statusConfig = {
  active: { label: 'Active', color: 'bg-success/10 text-success border-success/20' },
  inactive: { label: 'Inactive', color: 'bg-muted text-muted-foreground border-border' },
  graduated: { label: 'Graduated', color: 'bg-info/10 text-info border-info/20' },
};

const ITEMS_PER_PAGE = 8;

export default function Students() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isWarden = user?.role === 'warden';
  const canManage = isAdmin || isWarden;

  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase()) ||
      student.roomNumber.includes(search) ||
      student.phone.includes(search);
    const matchesHostel = hostelFilter === 'all' || student.hostel === hostelFilter;
    const matchesFee = feeFilter === 'all' || student.feeStatus === feeFilter;
    const matchesYear = yearFilter === 'all' || student.year.toString() === yearFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesRoom = roomFilter === '' || student.roomNumber.toLowerCase().includes(roomFilter.toLowerCase());
    return matchesSearch && matchesHostel && matchesFee && matchesYear && matchesStatus && matchesCourse && matchesRoom;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hostels = [...new Set(students.map(s => s.hostel))];
  const courses = [...new Set(students.map(s => s.course))];

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    paid: students.filter(s => s.feeStatus === 'paid').length,
    pending: students.filter(s => s.feeStatus === 'pending').length,
    overdue: students.filter(s => s.feeStatus === 'overdue').length,
  };

  // Count active filters
  const activeFilterCount = [
    hostelFilter !== 'all',
    feeFilter !== 'all',
    yearFilter !== 'all',
    statusFilter !== 'all',
    courseFilter !== 'all',
    roomFilter !== '',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch('');
    setHostelFilter('all');
    setFeeFilter('all');
    setYearFilter('all');
    setStatusFilter('all');
    setCourseFilter('all');
    setRoomFilter('');
    setCurrentPage(1);
  };

  const handleAddStudent = (studentData: Omit<StudentData, 'id'>) => {
    const newStudent: StudentData = {
      ...studentData,
      id: (students.length + 1).toString(),
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: StudentData) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
    setSelectedStudent(null);
  };

  const handleViewDetails = (student: StudentData) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  const handleEditStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (student: StudentData) => {
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    handleUpdateStudent({ ...student, status: newStatus });
  };

  return (
    <DashboardLayout 
      title="Students Directory" 
      subtitle={`${students.length} students currently residing in hostels`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-primary/10 p-2 sm:p-2.5 flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-card-foreground">{stats.total}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Total Students</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-info/10 p-2 sm:p-2.5 flex-shrink-0">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-info" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-info">{stats.active}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-success/10 p-2 sm:p-2.5 flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-success">{stats.paid}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Fees Paid</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-warning/10 p-2 sm:p-2.5 flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-card p-3 sm:p-4 shadow-card">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-lg bg-destructive/10 p-2 sm:p-2.5 flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-destructive">{stats.overdue}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Main Search Row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, course, room..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="pl-9 pr-9"
                  />
                  {search && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearch('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={showAdvancedFilters ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="gap-2"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
                      <X className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Export</span>
                  </Button>
                  {canManage && (
                    <Button variant="hero" size="sm" onClick={() => setAddModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Add Student</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-2">
                <p className="text-xs text-muted-foreground self-center mr-1">Quick filters:</p>
                <Button 
                  variant={feeFilter === 'overdue' ? 'destructive' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => { 
                    setFeeFilter(feeFilter === 'overdue' ? 'all' : 'overdue'); 
                    setCurrentPage(1); 
                  }}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Overdue Fees ({stats.overdue})
                </Button>
                <Button 
                  variant={feeFilter === 'pending' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => { 
                    setFeeFilter(feeFilter === 'pending' ? 'all' : 'pending'); 
                    setCurrentPage(1); 
                  }}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Pending Fees ({stats.pending})
                </Button>
                <Button 
                  variant={statusFilter === 'inactive' ? 'secondary' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => { 
                    setStatusFilter(statusFilter === 'inactive' ? 'all' : 'inactive'); 
                    setCurrentPage(1); 
                  }}
                >
                  <UserX className="h-3 w-3 mr-1" />
                  Inactive Students
                </Button>
                <Button 
                  variant={yearFilter === '1' ? 'default' : 'outline'} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => { 
                    setYearFilter(yearFilter === '1' ? 'all' : '1'); 
                    setCurrentPage(1); 
                  }}
                >
                  <GraduationCap className="h-3 w-3 mr-1" />
                  First Year
                </Button>
              </div>

              {/* Advanced Filters Panel */}
              <Collapsible open={showAdvancedFilters}>
                <CollapsibleContent>
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          Hostel
                        </label>
                        <Select value={hostelFilter} onValueChange={(v) => { setHostelFilter(v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="All Hostels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Hostels</SelectItem>
                            {hostels.map((hostel) => (
                              <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          Room Number
                        </label>
                        <Input
                          placeholder="e.g., 204"
                          value={roomFilter}
                          onChange={(e) => { setRoomFilter(e.target.value); setCurrentPage(1); }}
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Course
                        </label>
                        <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="All Courses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Year
                        </label>
                        <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="All Years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3">Year 3</SelectItem>
                            <SelectItem value="4">Year 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          Fee Status
                        </label>
                        <Select value={feeFilter} onValueChange={(v) => { setFeeFilter(v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Status
                        </label>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="graduated">Graduated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {hostelFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {hostelFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setHostelFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {roomFilter !== '' && (
              <Badge variant="secondary" className="gap-1">
                <Home className="h-3 w-3" />
                Room: {roomFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setRoomFilter('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {courseFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="h-3 w-3" />
                {courseFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setCourseFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {yearFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Year {yearFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setYearFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {feeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 capitalize">
                <CreditCard className="h-3 w-3" />
                {feeFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setFeeFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 capitalize">
                <UserCheck className="h-3 w-3" />
                {statusFilter}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => setStatusFilter('all')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Showing {paginatedStudents.length} of {filteredStudents.length} students
          {filteredStudents.length !== students.length && ` (filtered from ${students.length} total)`}
        </div>

        {/* Students Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[250px]">Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No students found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-card-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">ID: STU-{student.id.padStart(4, '0')}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.course}</p>
                        <p className="text-xs text-muted-foreground">Year {student.year}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Room {student.roomNumber}</p>
                        <p className="text-xs text-muted-foreground">{student.hostel}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusConfig[student.status].color)}>
                        {statusConfig[student.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(feeStatusConfig[student.feeStatus].color)}>
                        {feeStatusConfig[student.feeStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          {canManage && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(student)}>
                                {student.status === 'active' ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Mark Inactive
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Mark Active
                                  </>
                                )}
                              </DropdownMenuItem>
                              {isAdmin && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setEditModalOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Student
                                  </DropdownMenuItem>
                                </>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredStudents.length} entries)
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStudentModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={handleAddStudent}
        hostels={hostels}
      />
      <EditStudentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        student={selectedStudent}
        onUpdate={handleUpdateStudent}
        onDelete={handleDeleteStudent}
        hostels={hostels}
      />
      <StudentDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        student={selectedStudent}
        onEdit={() => {
          setDetailsModalOpen(false);
          setEditModalOpen(true);
        }}
      />
    </DashboardLayout>
  );
}

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
import { ApplicationDetailsModal } from '@/components/applications/ApplicationDetailsModal';
import { ApproveApplicationModal } from '@/components/applications/ApproveApplicationModal';
import { RejectApplicationModal } from '@/components/applications/RejectApplicationModal';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Check, 
  Clock, 
  Search, 
  X, 
  Eye, 
  MoreVertical,
  Download,
  Filter,
  FileText,
  Calendar,
  BedDouble,
  GraduationCap,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  reason?: string;
}

interface RoomData {
  id: string;
  roomNumber: string;
  hostel: string;
  capacity: number;
  occupied: number;
  floor: number;
}

const initialApplications: ApplicationData[] = [
  { id: '1', studentId: 's1', studentName: 'Rahul Sharma', email: 'rahul.sharma@medhavi.edu', phone: '+91 98765 43210', course: 'B.Tech CSE', year: 1, preferredHostel: 'Boys Hostel A', alternateHostel: 'Boys Hostel B', status: 'pending', appliedDate: '2024-01-10', guardianName: 'Mr. Sharma', guardianPhone: '+91 98765 00001', address: 'Delhi, India', reason: 'First year student seeking hostel accommodation for the academic year.' },
  { id: '2', studentId: 's2', studentName: 'Sneha Patel', email: 'sneha.patel@medhavi.edu', phone: '+91 98765 43211', course: 'B.Tech ECE', year: 2, preferredHostel: 'Girls Hostel A', status: 'approved', appliedDate: '2024-01-09', guardianName: 'Mr. Patel', guardianPhone: '+91 98765 00002' },
  { id: '3', studentId: 's3', studentName: 'Amit Kumar', email: 'amit.kumar@medhavi.edu', phone: '+91 98765 43212', course: 'MBA', year: 1, preferredHostel: 'Boys Hostel B', alternateHostel: 'Boys Hostel C', status: 'pending', appliedDate: '2024-01-08', address: 'Mumbai, Maharashtra', reason: 'Joining MBA program, need hostel accommodation.' },
  { id: '4', studentId: 's4', studentName: 'Priya Singh', email: 'priya.singh@medhavi.edu', phone: '+91 98765 43213', course: 'B.Tech IT', year: 3, preferredHostel: 'Girls Hostel B', status: 'rejected', appliedDate: '2024-01-07', notes: 'Incomplete documentation - Missing ID proof and address verification.' },
  { id: '5', studentId: 's5', studentName: 'Vikash Gupta', email: 'vikash.gupta@medhavi.edu', phone: '+91 98765 43214', course: 'B.Tech ME', year: 1, preferredHostel: 'Boys Hostel A', status: 'pending', appliedDate: '2024-01-06', guardianName: 'Mr. Gupta', guardianPhone: '+91 98765 00005', reason: 'Seeking on-campus accommodation for easier access to labs.' },
  { id: '6', studentId: 's6', studentName: 'Neha Agarwal', email: 'neha.agarwal@medhavi.edu', phone: '+91 98765 43215', course: 'B.Tech CSE', year: 2, preferredHostel: 'Girls Hostel A', status: 'approved', appliedDate: '2024-01-05' },
  { id: '7', studentId: 's7', studentName: 'Ravi Verma', email: 'ravi.verma@medhavi.edu', phone: '+91 98765 43216', course: 'MCA', year: 1, preferredHostel: 'Boys Hostel C', status: 'pending', appliedDate: '2024-01-04', reason: 'Outstation student, require hostel accommodation.' },
  { id: '8', studentId: 's8', studentName: 'Anjali Mehta', email: 'anjali.mehta@medhavi.edu', phone: '+91 98765 43217', course: 'B.Tech EE', year: 1, preferredHostel: 'Girls Hostel B', alternateHostel: 'Girls Hostel A', status: 'approved', appliedDate: '2024-01-03' },
  { id: '9', studentId: 's9', studentName: 'Suresh Yadav', email: 'suresh.yadav@medhavi.edu', phone: '+91 98765 43218', course: 'B.Tech CSE', year: 1, preferredHostel: 'Boys Hostel A', status: 'pending', appliedDate: '2024-01-02', address: 'Lucknow, UP' },
  { id: '10', studentId: 's10', studentName: 'Kavita Sharma', email: 'kavita.sharma@medhavi.edu', phone: '+91 98765 43219', course: 'B.Tech ECE', year: 1, preferredHostel: 'Girls Hostel A', status: 'pending', appliedDate: '2024-01-01' },
];

const availableRooms: RoomData[] = [
  { id: 'r1', roomNumber: '101', hostel: 'Boys Hostel A', capacity: 2, occupied: 1, floor: 1 },
  { id: 'r2', roomNumber: '102', hostel: 'Boys Hostel A', capacity: 2, occupied: 0, floor: 1 },
  { id: 'r3', roomNumber: '201', hostel: 'Boys Hostel A', capacity: 3, occupied: 2, floor: 2 },
  { id: 'r4', roomNumber: '105', hostel: 'Boys Hostel B', capacity: 2, occupied: 1, floor: 1 },
  { id: 'r5', roomNumber: '110', hostel: 'Boys Hostel C', capacity: 2, occupied: 0, floor: 1 },
  { id: 'r6', roomNumber: '101', hostel: 'Girls Hostel A', capacity: 2, occupied: 1, floor: 1 },
  { id: 'r7', roomNumber: '102', hostel: 'Girls Hostel A', capacity: 2, occupied: 0, floor: 1 },
  { id: 'r8', roomNumber: '105', hostel: 'Girls Hostel B', capacity: 3, occupied: 1, floor: 1 },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-success/10 text-success border-success/20', icon: Check },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: X },
};

const ITEMS_PER_PAGE = 6;

export default function Applications() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isWarden = user?.role === 'warden';
  const canManage = isAdmin || isWarden;

  const [applications, setApplications] = useState<ApplicationData[]>(initialApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesHostel = hostelFilter === 'all' || app.preferredHostel === hostelFilter;
    const matchesYear = yearFilter === 'all' || app.year.toString() === yearFilter;
    return matchesSearch && matchesStatus && matchesHostel && matchesYear;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hostels = [...new Set(applications.map(a => a.preferredHostel))];

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleOpenApprove = (application: ApplicationData) => {
    setSelectedApplication(application);
    setApproveModalOpen(true);
  };

  const handleOpenReject = (application: ApplicationData) => {
    setSelectedApplication(application);
    setRejectModalOpen(true);
  };

  const handleApprove = (applicationId: string, roomId: string, notes: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'approved' as const, notes }
        : app
    ));
    setApproveModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleReject = (applicationId: string, reason: string, notes: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected' as const, notes: `${reason}${notes ? ` - ${notes}` : ''}` }
        : app
    ));
    setRejectModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <DashboardLayout 
      title="Hostel Applications" 
      subtitle={`${stats.pending} applications pending review`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or course..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-36">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hostelFilter} onValueChange={(v) => { setHostelFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40">
                <BedDouble className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hostels</SelectItem>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel} value={hostel}>{hostel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-28">
                <GraduationCap className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Year" />
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
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Showing {paginatedApplications.length} of {filteredApplications.length} applications
          {filteredApplications.length !== applications.length && ` (filtered from ${applications.length} total)`}
        </div>

        {/* Applications Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[220px]">Applicant</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Preferred Hostel</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No applications found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((application) => {
                  const StatusIcon = statusConfig[application.status].icon;
                  return (
                    <TableRow key={application.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {application.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-card-foreground">{application.studentName}</p>
                            <p className="text-xs text-muted-foreground">{application.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.course}</p>
                          <p className="text-xs text-muted-foreground">Year {application.year}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.preferredHostel}</p>
                          {application.alternateHostel && (
                            <p className="text-xs text-muted-foreground">Alt: {application.alternateHostel}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(application.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('gap-1', statusConfig[application.status].color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[application.status].label}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(application)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {canManage && application.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-success focus:text-success"
                                  onClick={() => handleOpenApprove(application)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleOpenReject(application)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredApplications.length} entries)
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
      <ApplicationDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        application={selectedApplication}
        onApprove={() => {
          setDetailsModalOpen(false);
          setApproveModalOpen(true);
        }}
        onReject={() => {
          setDetailsModalOpen(false);
          setRejectModalOpen(true);
        }}
      />
      <ApproveApplicationModal
        open={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        application={selectedApplication}
        availableRooms={availableRooms}
        onApprove={handleApprove}
      />
      <RejectApplicationModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        application={selectedApplication}
        onReject={handleReject}
      />
    </DashboardLayout>
  );
}

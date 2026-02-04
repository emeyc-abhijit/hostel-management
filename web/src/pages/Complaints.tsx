import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AddComplaintModal } from '@/components/complaints/AddComplaintModal';
import { ComplaintDetailsModal } from '@/components/complaints/ComplaintDetailsModal';
import { AddNoteModal } from '@/components/complaints/AddNoteModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Wrench,
  Zap,
  Droplets,
  Sparkles,
  MoreVertical,
  Eye,
  ArrowRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplaintNote {
  id: string;
  text: string;
  addedBy: string;
  addedAt: string;
}

interface ComplaintData {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  roomNumber: string;
  hostel?: string;
  category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  notes?: ComplaintNote[];
}

const initialComplaints: ComplaintData[] = [
  { id: '1', studentId: 's1', studentName: 'Rahul Sharma', studentEmail: 'rahul.sharma@medhavi.edu', roomNumber: '204', hostel: 'Boys Hostel A', category: 'electrical', subject: 'Fan not working', description: 'The ceiling fan in my room has stopped working since yesterday. It was making some noise before it stopped completely. Please send someone to check.', status: 'open', priority: 'high', createdAt: '2024-01-12', notes: [{ id: 'n1', text: 'Complaint received and logged.', addedBy: 'System', addedAt: '2024-01-12T09:00:00' }] },
  { id: '2', studentId: 's2', studentName: 'Sneha Patel', studentEmail: 'sneha.patel@medhavi.edu', roomNumber: '105', hostel: 'Girls Hostel A', category: 'plumbing', subject: 'Water leakage', description: 'There is water leaking from the bathroom tap. The tap handle is also loose and difficult to turn off properly.', status: 'in-progress', priority: 'medium', createdAt: '2024-01-11', assignedTo: 'Maintenance Team A', notes: [{ id: 'n2', text: 'Plumber assigned for inspection.', addedBy: 'Mr. Sharma', addedAt: '2024-01-11T14:00:00' }] },
  { id: '3', studentId: 's3', studentName: 'Amit Kumar', studentEmail: 'amit.kumar@medhavi.edu', roomNumber: '301', hostel: 'Boys Hostel B', category: 'maintenance', subject: 'Broken window', description: 'The window glass is cracked and needs replacement. It happened during the storm last week.', status: 'resolved', priority: 'low', createdAt: '2024-01-10', resolvedAt: '2024-01-12', assignedTo: 'Maintenance Team B', notes: [{ id: 'n3', text: 'Window replaced successfully.', addedBy: 'Maintenance Team B', addedAt: '2024-01-12T16:00:00' }] },
  { id: '4', studentId: 's4', studentName: 'Priya Singh', studentEmail: 'priya.singh@medhavi.edu', roomNumber: '202', hostel: 'Girls Hostel B', category: 'cleanliness', subject: 'Room cleaning required', description: 'The common area on the second floor needs deep cleaning. There are stains on the floor and the furniture is dusty.', status: 'open', priority: 'low', createdAt: '2024-01-09' },
  { id: '5', studentId: 's5', studentName: 'Vikash Gupta', studentEmail: 'vikash.gupta@medhavi.edu', roomNumber: '108', hostel: 'Boys Hostel A', category: 'electrical', subject: 'Light flickering', description: 'The tube light in the corridor keeps flickering. It is very disturbing at night.', status: 'in-progress', priority: 'medium', createdAt: '2024-01-08', assignedTo: 'Electrician - Rajesh' },
  { id: '6', studentId: 's6', studentName: 'Neha Agarwal', studentEmail: 'neha.agarwal@medhavi.edu', roomNumber: '112', hostel: 'Girls Hostel A', category: 'maintenance', subject: 'Door lock issue', description: 'The door lock is jammed and difficult to open. I need to use extra force every time.', status: 'open', priority: 'high', createdAt: '2024-01-07' },
  { id: '7', studentId: 's7', studentName: 'Ravi Verma', roomNumber: '405', hostel: 'Boys Hostel C', category: 'plumbing', subject: 'Clogged drain', description: 'The bathroom drain is clogged and water is not draining properly.', status: 'closed', priority: 'medium', createdAt: '2024-01-05', resolvedAt: '2024-01-06' },
];

const staffMembers = ['Maintenance Team A', 'Maintenance Team B', 'Electrician - Rajesh', 'Electrician - Suresh', 'Plumber - Mohan', 'Cleaning Staff'];

const statusConfig = {
  open: { label: 'Open', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground border-border', icon: CheckCircle },
};

const categoryConfig = {
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'text-primary', bgColor: 'bg-primary/10' },
  electrical: { label: 'Electrical', icon: Zap, color: 'text-warning', bgColor: 'bg-warning/10' },
  plumbing: { label: 'Plumbing', icon: Droplets, color: 'text-info', bgColor: 'bg-info/10' },
  cleanliness: { label: 'Cleanliness', icon: Sparkles, color: 'text-success', bgColor: 'bg-success/10' },
  other: { label: 'Other', icon: MessageSquare, color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  high: { label: 'High', color: 'bg-destructive/10 text-destructive' },
};

const ITEMS_PER_PAGE = 5;

export default function Complaints() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isStudent = user?.role === 'student';
  const canManage = user?.role === 'admin' || user?.role === 'warden';

  const [complaints, setComplaints] = useState<ComplaintData[]>(initialComplaints);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(search.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(search.toLowerCase()) ||
      complaint.roomNumber.includes(search) ||
      complaint.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sort by priority (high first) then by date
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedComplaints.length / ITEMS_PER_PAGE);
  const paginatedComplaints = sortedComplaints.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length,
    highPriority: complaints.filter(c => c.priority === 'high' && c.status === 'open').length,
  };

  const handleAddComplaint = (complaintData: {
    category: 'maintenance' | 'electrical' | 'plumbing' | 'cleanliness' | 'other';
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    roomNumber: string;
  }) => {
    const newComplaint: ComplaintData = {
      id: (complaints.length + 1).toString(),
      studentId: user?.id || 's-new',
      studentName: user?.name || 'Student',
      studentEmail: user?.email,
      roomNumber: complaintData.roomNumber,
      category: complaintData.category,
      subject: complaintData.subject,
      description: complaintData.description,
      status: 'open',
      priority: complaintData.priority,
      createdAt: new Date().toISOString().split('T')[0],
      notes: [{ id: 'n-new', text: 'Complaint received and logged.', addedBy: 'System', addedAt: new Date().toISOString() }],
    };
    setComplaints([newComplaint, ...complaints]);
  };

  const handleUpdateStatus = (complaintId: string, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    setComplaints(complaints.map(c => {
      if (c.id === complaintId) {
        const updated = { 
          ...c, 
          status: newStatus,
          resolvedAt: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : c.resolvedAt,
          notes: [
            ...(c.notes || []),
            { 
              id: `n-${Date.now()}`, 
              text: `Status changed to ${statusConfig[newStatus].label}`, 
              addedBy: user?.name || 'Admin', 
              addedAt: new Date().toISOString() 
            }
          ]
        };
        return updated;
      }
      return c;
    }));
    setSelectedComplaint(null);
    setDetailsModalOpen(false);
    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${statusConfig[newStatus].label}.`,
    });
  };

  const handleAddNote = (complaintId: string, noteText: string, assignTo?: string) => {
    setComplaints(complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          assignedTo: assignTo || c.assignedTo,
          notes: [
            ...(c.notes || []),
            { id: `n-${Date.now()}`, text: noteText, addedBy: user?.name || 'Admin', addedAt: new Date().toISOString() }
          ]
        };
      }
      return c;
    }));
    setNoteModalOpen(false);
  };

  const handleViewDetails = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint);
    setDetailsModalOpen(true);
  };

  const handleOpenNoteModal = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint);
    setNoteModalOpen(true);
  };

  return (
    <DashboardLayout 
      title="Complaints & Maintenance" 
      subtitle="Track and manage hostel complaints"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <Zap className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
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
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-36">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="cleanliness">Cleanliness</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {canManage && (
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
            {isStudent && (
              <Button variant="hero" onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          Showing {paginatedComplaints.length} of {sortedComplaints.length} complaints
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {paginatedComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">No complaints found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "No complaints have been submitted yet"}
              </p>
            </div>
          ) : (
            paginatedComplaints.map((complaint) => {
              const StatusIcon = statusConfig[complaint.status].icon;
              const CategoryIcon = categoryConfig[complaint.category].icon;
              
              return (
                <div
                  key={complaint.id}
                  className={cn(
                    "group rounded-xl border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover cursor-pointer",
                    complaint.priority === 'high' && complaint.status === 'open' && "border-destructive/30"
                  )}
                  onClick={() => handleViewDetails(complaint)}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
                        categoryConfig[complaint.category].bgColor
                      )}>
                        <CategoryIcon className={cn('h-6 w-6', categoryConfig[complaint.category].color)} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {complaint.subject}
                          </h3>
                          {complaint.priority === 'high' && complaint.status === 'open' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {complaint.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
                          <span className="font-medium">{complaint.studentName}</span>
                          <span>•</span>
                          <span>Room {complaint.roomNumber}</span>
                          {complaint.hostel && (
                            <>
                              <span>•</span>
                              <span>{complaint.hostel}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          {complaint.assignedTo && (
                            <>
                              <span>•</span>
                              <span className="text-info">Assigned: {complaint.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <Badge className={cn('gap-1', statusConfig[complaint.status].color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[complaint.status].label}
                      </Badge>
                      <Badge variant="outline" className={priorityConfig[complaint.priority].color}>
                        {priorityConfig[complaint.priority].label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(complaint); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canManage && complaint.status !== 'closed' && (
                            <>
                              <DropdownMenuSeparator />
                              {complaint.status === 'open' && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint.id, 'in-progress'); }}>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Mark In Progress
                                </DropdownMenuItem>
                              )}
                              {complaint.status === 'in-progress' && (
                                <DropdownMenuItem 
                                  className="text-success focus:text-success"
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(complaint.id, 'resolved'); }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Resolved
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenNoteModal(complaint); }}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
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
      <AddComplaintModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={handleAddComplaint}
        studentName={user?.name || 'Student'}
      />
      <ComplaintDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        complaint={selectedComplaint}
        onUpdateStatus={(status) => selectedComplaint && handleUpdateStatus(selectedComplaint.id, status)}
        onAddNote={() => {
          setDetailsModalOpen(false);
          setNoteModalOpen(true);
        }}
        canManage={canManage}
      />
      <AddNoteModal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        complaintId={selectedComplaint?.id || ''}
        complaintSubject={selectedComplaint?.subject || ''}
        onAdd={handleAddNote}
        staffMembers={staffMembers}
        currentAssignee={selectedComplaint?.assignedTo}
      />
    </DashboardLayout>
  );
}

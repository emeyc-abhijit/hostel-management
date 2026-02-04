import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddNoticeModal } from '@/components/notices/AddNoticeModal';
import { EditNoticeModal } from '@/components/notices/EditNoticeModal';
import { NoticeDetailsModal } from '@/components/notices/NoticeDetailsModal';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  Calendar, 
  Plus, 
  Search, 
  AlertTriangle, 
  Info, 
  PartyPopper, 
  Wrench,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Pin,
  Clock,
  Filter,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoticeData {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'maintenance';
  targetAudience: 'all' | 'boys' | 'girls' | 'specific';
  targetHostel?: string;
  postedBy: string;
  postedAt: string;
  expiresAt?: string;
  isPinned: boolean;
}

const initialNotices: NoticeData[] = [
  {
    id: '1',
    title: 'Hostel Fee Payment Deadline',
    content: 'All students are reminded that the hostel fee for the current semester must be paid by January 31, 2024. Late payments will incur a penalty of ₹500. Please ensure timely payment to avoid any inconvenience.\n\nPayment can be made through:\n- Online banking\n- UPI transfer\n- Hostel office (cash/card)',
    category: 'urgent',
    targetAudience: 'all',
    postedBy: 'Dr. Rajesh Kumar',
    postedAt: '2024-01-12',
    expiresAt: '2024-01-31',
    isPinned: true,
  },
  {
    id: '2',
    title: 'Annual Hostel Day Celebration',
    content: 'We are excited to announce the Annual Hostel Day celebration on February 15, 2024. Various cultural programs, games, and food stalls will be organized. All students are encouraged to participate and make this event memorable.\n\nEvent Schedule:\n- 10:00 AM - Opening Ceremony\n- 11:00 AM - Cultural Programs\n- 2:00 PM - Sports Events\n- 6:00 PM - Prize Distribution',
    category: 'event',
    targetAudience: 'all',
    postedBy: 'Cultural Committee',
    postedAt: '2024-01-11',
    expiresAt: '2024-02-16',
    isPinned: true,
  },
  {
    id: '3',
    title: 'Scheduled Water Supply Disruption',
    content: 'Due to maintenance work on the water tank, there will be a disruption in water supply on January 14, 2024, from 10 AM to 4 PM. Students are requested to store sufficient water in advance.',
    category: 'maintenance',
    targetAudience: 'boys',
    postedBy: 'Hostel Maintenance',
    postedAt: '2024-01-10',
    expiresAt: '2024-01-14',
    isPinned: false,
  },
  {
    id: '4',
    title: 'New Hostel Rules Update',
    content: 'The hostel administration has updated certain rules regarding visitor timings and common area usage. Please refer to the notice board near the main entrance for detailed information.\n\nKey changes:\n- Visitor hours: 4 PM to 7 PM on weekdays\n- Common area closes at 11 PM\n- ID cards must be worn at all times',
    category: 'general',
    targetAudience: 'all',
    postedBy: 'Hostel Warden',
    postedAt: '2024-01-08',
    isPinned: false,
  },
  {
    id: '5',
    title: 'WiFi Password Change',
    content: 'The WiFi password for all hostel buildings has been changed for security reasons. Please collect the new password from your respective hostel office by showing your student ID.',
    category: 'general',
    targetAudience: 'all',
    postedBy: 'IT Department',
    postedAt: '2024-01-05',
    isPinned: false,
  },
  {
    id: '6',
    title: 'Girls Hostel A - Elevator Maintenance',
    content: 'The elevator in Girls Hostel A will be under maintenance on January 16, 2024. Please use the stairs during this period. We apologize for any inconvenience.',
    category: 'maintenance',
    targetAudience: 'specific',
    targetHostel: 'Girls Hostel A',
    postedBy: 'Maintenance Team',
    postedAt: '2024-01-05',
    expiresAt: '2024-01-17',
    isPinned: false,
  },
];

const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Boys Hostel C', 'Girls Hostel A', 'Girls Hostel B'];

const categoryConfig = {
  general: { label: 'General', icon: Info, color: 'bg-info/10 text-info border-info/20' },
  urgent: { label: 'Urgent', icon: AlertTriangle, color: 'bg-destructive/10 text-destructive border-destructive/20' },
  event: { label: 'Event', icon: PartyPopper, color: 'bg-success/10 text-success border-success/20' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'bg-warning/10 text-warning border-warning/20' },
};

export default function Notices() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'warden';

  const [notices, setNotices] = useState<NoticeData[]>(initialNotices);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewFilter, setViewFilter] = useState('active');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null);

  const now = new Date();

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    
    const isExpired = notice.expiresAt && new Date(notice.expiresAt) < now;
    const matchesView = 
      viewFilter === 'all' ? true :
      viewFilter === 'active' ? !isExpired :
      viewFilter === 'expired' ? isExpired :
      viewFilter === 'pinned' ? notice.isPinned : true;
    
    return matchesSearch && matchesCategory && matchesView;
  });

  // Sort: pinned first, then by date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  });

  const stats = {
    total: notices.length,
    active: notices.filter(n => !n.expiresAt || new Date(n.expiresAt) >= now).length,
    urgent: notices.filter(n => n.category === 'urgent').length,
    pinned: notices.filter(n => n.isPinned).length,
  };

  const handleAddNotice = (noticeData: {
    title: string;
    content: string;
    category: 'general' | 'urgent' | 'event' | 'maintenance';
    targetAudience: 'all' | 'boys' | 'girls' | 'specific';
    targetHostel?: string;
    hasExpiry: boolean;
    expiresAt?: string;
    isPinned: boolean;
  }) => {
    const newNotice: NoticeData = {
      id: (notices.length + 1).toString(),
      title: noticeData.title,
      content: noticeData.content,
      category: noticeData.category,
      targetAudience: noticeData.targetAudience,
      targetHostel: noticeData.targetHostel,
      postedBy: user?.name || 'Admin',
      postedAt: new Date().toISOString().split('T')[0],
      expiresAt: noticeData.hasExpiry ? noticeData.expiresAt : undefined,
      isPinned: noticeData.isPinned,
    };
    setNotices([newNotice, ...notices]);
  };

  const handleUpdateNotice = (updatedNotice: NoticeData) => {
    setNotices(notices.map(n => n.id === updatedNotice.id ? updatedNotice : n));
    setSelectedNotice(null);
  };

  const handleDeleteNotice = (noticeId: string) => {
    setNotices(notices.filter(n => n.id !== noticeId));
    setSelectedNotice(null);
  };

  const handleTogglePin = (notice: NoticeData) => {
    handleUpdateNotice({ ...notice, isPinned: !notice.isPinned });
  };

  const handleViewDetails = (notice: NoticeData) => {
    setSelectedNotice(notice);
    setDetailsModalOpen(true);
  };

  const handleEditNotice = (notice: NoticeData) => {
    setSelectedNotice(notice);
    setEditModalOpen(true);
  };

  return (
    <DashboardLayout 
      title="Notices & Announcements" 
      subtitle="Stay updated with hostel communications"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Notices</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.urgent}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <Pin className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pinned}</p>
                <p className="text-xs text-muted-foreground">Pinned</p>
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
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={viewFilter} onValueChange={setViewFilter}>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pinned">Pinned</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {canManage && (
            <Button variant="hero" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Post Notice
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          Showing {sortedNotices.length} notices
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {sortedNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">No notices found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || categoryFilter !== 'all' || viewFilter !== 'active'
                  ? "Try adjusting your filters"
                  : "No notices have been posted yet"}
              </p>
            </div>
          ) : (
            sortedNotices.map((notice, index) => {
              const CategoryIcon = categoryConfig[notice.category].icon;
              const isExpired = notice.expiresAt && new Date(notice.expiresAt) < now;
              
              return (
                <div
                  key={notice.id}
                  className={cn(
                    "group overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover",
                    isExpired && "opacity-60",
                    notice.isPinned && "border-warning/50"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Category Header */}
                  <div className={cn(
                    'flex items-center gap-2 px-5 py-3',
                    notice.category === 'urgent' && 'bg-destructive/5',
                    notice.category === 'event' && 'bg-success/5',
                    notice.category === 'maintenance' && 'bg-warning/5',
                    notice.category === 'general' && 'bg-info/5'
                  )}>
                    <CategoryIcon className={cn(
                      'h-4 w-4',
                      notice.category === 'urgent' && 'text-destructive',
                      notice.category === 'event' && 'text-success',
                      notice.category === 'maintenance' && 'text-warning',
                      notice.category === 'general' && 'text-info'
                    )} />
                    <Badge className={categoryConfig[notice.category].color}>
                      {categoryConfig[notice.category].label}
                    </Badge>
                    {notice.isPinned && (
                      <Badge variant="outline" className="gap-1 text-warning border-warning/30">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">Expired</Badge>
                    )}
                    {notice.targetAudience !== 'all' && (
                      <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {notice.targetAudience === 'specific' ? notice.targetHostel : 
                         notice.targetAudience === 'boys' ? 'Boys Only' : 'Girls Only'}
                      </Badge>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(notice.postedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {canManage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleViewDetails(notice)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditNotice(notice)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePin(notice)}>
                              <Pin className="h-4 w-4 mr-2" />
                              {notice.isPinned ? 'Unpin' : 'Pin'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteNotice(notice.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="p-5 cursor-pointer" 
                    onClick={() => handleViewDetails(notice)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                        notice.category === 'urgent' && 'bg-destructive/10',
                        notice.category === 'event' && 'bg-success/10',
                        notice.category === 'maintenance' && 'bg-warning/10',
                        notice.category === 'general' && 'bg-info/10'
                      )}>
                        <Bell className={cn(
                          'h-6 w-6',
                          notice.category === 'urgent' && 'text-destructive',
                          notice.category === 'event' && 'text-success',
                          notice.category === 'maintenance' && 'text-warning',
                          notice.category === 'general' && 'text-info'
                        )} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {notice.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <p className="text-xs text-muted-foreground">
                            Posted by: <span className="font-medium">{notice.postedBy}</span>
                          </p>
                          {notice.expiresAt && (
                            <p className={cn(
                              "text-xs flex items-center gap-1",
                              isExpired ? "text-destructive" : "text-muted-foreground"
                            )}>
                              <Clock className="h-3 w-3" />
                              {isExpired ? 'Expired' : 'Expires'}: {new Date(notice.expiresAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <AddNoticeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAdd={handleAddNotice}
        hostels={hostels}
        postedBy={user?.name || 'Admin'}
      />
      <EditNoticeModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        notice={selectedNotice}
        onUpdate={handleUpdateNotice}
        onDelete={handleDeleteNotice}
        hostels={hostels}
      />
      <NoticeDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        notice={selectedNotice}
        onEdit={() => {
          setDetailsModalOpen(false);
          setEditModalOpen(true);
        }}
        canEdit={canManage}
      />
    </DashboardLayout>
  );
}

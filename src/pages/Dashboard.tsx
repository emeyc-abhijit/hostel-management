import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DoorOpen, CreditCard, MessageSquare, TrendingUp, AlertCircle, Calendar, Building2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats, getOccupancyChartData, getComplaintsByCategoryData, mockComplaints, mockLeaveRequests } from '@/lib/mockData';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import hostelService from '@/lib/hostelService';
import { Hostel } from '@/types';

type StatWithTrend = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
};

type StatWithoutTrend = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

type Stat = StatWithTrend | StatWithoutTrend;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hostelId } = useParams();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  
  useEffect(() => {
    if (user?.role === 'admin') {
      loadHostels();
    }
  }, [user]);

  useEffect(() => {
    if (hostelId && hostels.length > 0) {
      const hostel = hostels.find(h => h.id === hostelId);
      setSelectedHostel(hostel || null);
    }
  }, [hostelId, hostels]);

  const loadHostels = async () => {
    const data = await hostelService.getHostels();
    setHostels(data);
  };

  const stats = getDashboardStats(user?.role || 'student');
  const occupancyData = getOccupancyChartData();
  const complaintsData = getComplaintsByCategoryData();

  const adminStats: StatWithTrend[] = [
    { title: 'Total Students', value: stats.totalStudents?.toString() || '0', icon: Users, trend: '+12%', color: 'text-primary' },
    { title: 'Available Rooms', value: stats.availableRooms?.toString() || '0', icon: DoorOpen, trend: '-8%', color: 'text-secondary' },
    { title: 'Pending Fees', value: stats.pendingFees || '₹0', icon: CreditCard, trend: '-15%', color: 'text-accent' },
    { title: 'Open Complaints', value: stats.openComplaints?.toString() || '0', icon: MessageSquare, trend: '+5%', color: 'text-destructive' },
  ];

  const studentStats: StatWithoutTrend[] = [
    { title: 'Room Number', value: stats.roomNumber || 'N/A', icon: DoorOpen, color: 'text-primary' },
    { title: 'Pending Fees', value: stats.pendingFees || '₹0', icon: CreditCard, color: 'text-accent' },
    { title: 'Active Complaints', value: stats.activeComplaints?.toString() || '0', icon: MessageSquare, color: 'text-destructive' },
  ];
    

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--info))'];

  const recentComplaints = mockComplaints.slice(0, 3);
  const recentLeaves = mockLeaveRequests.slice(0, 3);

  const cardStats: Stat[] = user?.role === 'student' ? studentStats : adminStats;

  // Show hostel setup for admin if no hostels exist
  if (user?.role === 'admin' && hostels.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-20 h-20 text-primary mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold mb-3">Welcome to Medhavi HMS</h2>
            <p className="text-muted-foreground mb-2 text-center max-w-md">
              To get started, create your first hostel. Once created, you'll be able to manage rooms, students, and all other features for each hostel.
            </p>
            <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
              All features like student management, room allocation, complaints, and more will be organized under each hostel.
            </p>
            <Button onClick={() => navigate('/hostels/new')} size="lg" className="glass-button">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Hostel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedHostel && (
        <Card className="glass-card border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{selectedHostel.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedHostel.code}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/hostels')}>
                Change Hostel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your hostel today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {'trend' in stat && (
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>
                    {stat.trend}
                  </span>{' '}
                  from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section - Admin/Warden Only */}
      {user?.role !== 'student' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Occupancy Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Room Occupancy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="occupied" stroke="hsl(var(--primary))" strokeWidth={2} name="Occupied" />
                  <Line type="monotone" dataKey="available" stroke="hsl(var(--success))" strokeWidth={2} name="Available" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaints by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complaintsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {complaintsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Complaints & Leaves */}
      {user?.role !== 'student' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{complaint.title}</p>
                      <p className="text-xs text-muted-foreground">{complaint.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        {complaint.category}
                      </Badge>
                    </div>
                    <Badge 
                      className={
                        complaint.status === 'open' 
                          ? 'bg-destructive text-destructive-foreground'
                          : complaint.status === 'in-progress'
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-success text-success-foreground'
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pending Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaves.filter(l => l.status === 'pending').map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{leave.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{leave.reason}</p>
                    </div>
                    <Badge className="bg-warning text-warning-foreground">
                      {leave.status}
                    </Badge>
                  </div>
                ))}
                {recentLeaves.filter(l => l.status === 'pending').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending leave requests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions for Students */}
      {user?.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">File a Complaint</p>
                <p className="text-xs text-muted-foreground">Report an issue</p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted">
              <CreditCard className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium">Pay Fees</p>
                <p className="text-xs text-muted-foreground">Make a payment</p>
              </div>
            </button>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {user?.role !== 'student' && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Leave requests awaiting approval</span>
                <Badge variant="outline">8 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Complaints requiring attention</span>
                <Badge variant="outline">15 urgent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rooms needing maintenance</span>
                <Badge variant="outline">5 rooms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

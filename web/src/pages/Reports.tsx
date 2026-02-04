import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  IndianRupee, 
  AlertTriangle, 
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  Target,
  BarChart3,
  PieChartIcon,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Occupancy trend data (monthly)
const occupancyTrendData = [
  { month: 'Jul', occupancy: 78, capacity: 100, available: 22 },
  { month: 'Aug', occupancy: 92, capacity: 100, available: 8 },
  { month: 'Sep', occupancy: 95, capacity: 100, available: 5 },
  { month: 'Oct', occupancy: 94, capacity: 100, available: 6 },
  { month: 'Nov', occupancy: 91, capacity: 100, available: 9 },
  { month: 'Dec', occupancy: 85, capacity: 100, available: 15 },
  { month: 'Jan', occupancy: 89, capacity: 100, available: 11 },
];

// Fee collection data
const feeCollectionData = [
  { month: 'Jul', collected: 245000, pending: 45000, overdue: 12000, total: 302000 },
  { month: 'Aug', collected: 380000, pending: 25000, overdue: 8000, total: 413000 },
  { month: 'Sep', collected: 420000, pending: 18000, overdue: 5000, total: 443000 },
  { month: 'Oct', collected: 390000, pending: 35000, overdue: 15000, total: 440000 },
  { month: 'Nov', collected: 365000, pending: 42000, overdue: 18000, total: 425000 },
  { month: 'Dec', collected: 310000, pending: 55000, overdue: 22000, total: 387000 },
  { month: 'Jan', collected: 425000, pending: 28000, overdue: 10000, total: 463000 },
];

// Complaint analytics data
const complaintCategoryData = [
  { name: 'Maintenance', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Electrical', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Plumbing', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Cleanliness', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 8, color: 'hsl(var(--chart-5))' },
];

const complaintTrendData = [
  { month: 'Jul', open: 12, resolved: 28, inProgress: 5, total: 45 },
  { month: 'Aug', open: 8, resolved: 32, inProgress: 4, total: 44 },
  { month: 'Sep', open: 15, resolved: 25, inProgress: 8, total: 48 },
  { month: 'Oct', open: 10, resolved: 30, inProgress: 6, total: 46 },
  { month: 'Nov', open: 18, resolved: 22, inProgress: 10, total: 50 },
  { month: 'Dec', open: 14, resolved: 35, inProgress: 7, total: 56 },
  { month: 'Jan', open: 9, resolved: 38, inProgress: 4, total: 51 },
];

// Hostel-wise occupancy
const hostelOccupancyData = [
  { hostel: 'Saraswati', boys: 0, girls: 92, total: 92, capacity: 100 },
  { hostel: 'Vivekananda', boys: 88, girls: 0, total: 88, capacity: 100 },
  { hostel: 'Tagore', boys: 0, girls: 85, total: 85, capacity: 100 },
  { hostel: 'Nehru', boys: 94, girls: 0, total: 94, capacity: 100 },
];

// Application statistics
const applicationData = [
  { month: 'Jul', received: 45, approved: 38, rejected: 5, pending: 2 },
  { month: 'Aug', received: 120, approved: 105, rejected: 12, pending: 3 },
  { month: 'Sep', received: 35, approved: 30, rejected: 3, pending: 2 },
  { month: 'Oct', received: 22, approved: 18, rejected: 2, pending: 2 },
  { month: 'Nov', received: 15, approved: 12, rejected: 1, pending: 2 },
  { month: 'Dec', received: 8, approved: 6, rejected: 1, pending: 1 },
  { month: 'Jan', received: 28, approved: 22, rejected: 3, pending: 3 },
];

// Room type distribution
const roomTypeData = [
  { name: 'Single', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Double', value: 120, color: 'hsl(var(--chart-2))' },
  { name: 'Triple', value: 85, color: 'hsl(var(--chart-3))' },
];

// Resolution time by priority
const resolutionTimeData = [
  { priority: 'High', avgDays: 1.2, target: 1 },
  { priority: 'Medium', avgDays: 2.8, target: 3 },
  { priority: 'Low', avgDays: 4.5, target: 5 },
];

// Top performing wardens
const wardenPerformanceData = [
  { name: 'Mr. Sharma', hostel: 'Vivekananda', resolved: 45, rating: 4.8 },
  { name: 'Mrs. Patel', hostel: 'Saraswati', resolved: 42, rating: 4.7 },
  { name: 'Mr. Kumar', hostel: 'Nehru', resolved: 38, rating: 4.5 },
  { name: 'Mrs. Singh', hostel: 'Tagore', resolved: 35, rating: 4.4 },
];

// Fee collection by hostel
const feeByHostelData = [
  { hostel: 'Saraswati', collected: 680000, pending: 45000, rate: 94 },
  { hostel: 'Vivekananda', collected: 720000, pending: 38000, rate: 95 },
  { hostel: 'Tagore', collected: 590000, pending: 62000, rate: 90 },
  { hostel: 'Nehru', collected: 545000, pending: 55000, rate: 91 },
];

// Gauges for KPIs
const kpiGaugeData = [
  { name: 'Occupancy', value: 89, fill: 'hsl(var(--primary))' },
];

const chartConfig = {
  occupancy: { label: 'Occupancy %', color: 'hsl(var(--primary))' },
  available: { label: 'Available %', color: 'hsl(var(--muted))' },
  collected: { label: 'Collected', color: 'hsl(var(--chart-1))' },
  pending: { label: 'Pending', color: 'hsl(var(--chart-2))' },
  overdue: { label: 'Overdue', color: 'hsl(var(--destructive))' },
  open: { label: 'Open', color: 'hsl(var(--destructive))' },
  resolved: { label: 'Resolved', color: 'hsl(var(--chart-1))' },
  inProgress: { label: 'In Progress', color: 'hsl(var(--chart-2))' },
  boys: { label: 'Boys', color: 'hsl(var(--chart-1))' },
  girls: { label: 'Girls', color: 'hsl(var(--chart-4))' },
  received: { label: 'Received', color: 'hsl(var(--muted-foreground))' },
  approved: { label: 'Approved', color: 'hsl(var(--chart-1))' },
  rejected: { label: 'Rejected', color: 'hsl(var(--destructive))' },
};

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('6months');

  // Only admin and warden can access reports
  if (user?.role === 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleExport = (reportType: string) => {
    toast({
      title: 'Exporting Report',
      description: `Generating ${reportType} report...`,
    });
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${reportType} report has been downloaded.`,
      });
    }, 1500);
  };

  const summaryStats = [
    {
      title: 'Current Occupancy',
      value: '89%',
      change: '+2.3%',
      trend: 'up',
      icon: Building2,
      description: 'vs last month',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Collection',
      value: '₹24.5L',
      change: '+8.5%',
      trend: 'up',
      icon: IndianRupee,
      description: 'this semester',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Open Complaints',
      value: '23',
      change: '-12%',
      trend: 'down',
      icon: AlertTriangle,
      description: 'vs last month',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Total Students',
      value: '847',
      change: '+45',
      trend: 'up',
      icon: Users,
      description: 'new this semester',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  // Calculate totals for fee collection
  const totalCollected = feeCollectionData.reduce((sum, d) => sum + d.collected, 0);
  const totalPending = feeCollectionData.reduce((sum, d) => sum + d.pending, 0);
  const totalOverdue = feeCollectionData.reduce((sum, d) => sum + d.overdue, 0);
  const collectionRate = Math.round((totalCollected / (totalCollected + totalPending + totalOverdue)) * 100);

  // Calculate complaint stats
  const totalResolved = complaintTrendData.reduce((sum, d) => sum + d.resolved, 0);
  const totalComplaints = complaintTrendData.reduce((sum, d) => sum + d.total, 0);
  const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Comprehensive insights into hostel operations">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last 1 Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last 1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="hidden sm:flex">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('Summary')}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <Card key={stat.title} className="shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-success" />
                      )}
                      <span className="text-xs text-success font-medium">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">{stat.description}</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="occupancy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="occupancy" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Occupancy</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="gap-2">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Fees</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Complaints</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
          </TabsList>

          {/* Occupancy Tab */}
          <TabsContent value="occupancy" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport('Occupancy')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Occupancy Trend
                  </CardTitle>
                  <CardDescription>Monthly occupancy percentage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={occupancyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis domain={[0, 100]} className="text-xs" tickFormatter={(v) => `${v}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="occupancy"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Hostel-wise Occupancy
                  </CardTitle>
                  <CardDescription>Current occupancy by hostel</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hostelOccupancyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 100]} className="text-xs" tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="hostel" type="category" className="text-xs" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="boys" stackId="a" fill="hsl(var(--chart-1))" name="Boys" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="girls" stackId="a" fill="hsl(var(--chart-4))" name="Girls" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Room Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Room Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roomTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {roomTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Hostel Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hostel</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Occupied</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostelOccupancyData.map((hostel) => (
                        <TableRow key={hostel.hostel}>
                          <TableCell className="font-medium">{hostel.hostel}</TableCell>
                          <TableCell>{hostel.capacity}</TableCell>
                          <TableCell>{hostel.total}</TableCell>
                          <TableCell>{hostel.capacity - hostel.total}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={hostel.total} className="h-2 w-16" />
                              <span className="text-sm font-medium">{hostel.total}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fee Collection Tab */}
          <TabsContent value="fees" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport('Fee Collection')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-card bg-gradient-to-br from-success/5 to-transparent border-success/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Collected</p>
                      <p className="text-xl font-bold text-success">₹{(totalCollected / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card bg-gradient-to-br from-warning/5 to-transparent border-warning/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-xl font-bold text-warning">₹{(totalPending / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card bg-gradient-to-br from-destructive/5 to-transparent border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                      <p className="text-xl font-bold text-destructive">₹{(totalOverdue / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Collection Rate</p>
                      <p className="text-xl font-bold text-primary">{collectionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Monthly Fee Collection
                  </CardTitle>
                  <CardDescription>Collected vs pending vs overdue amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={feeCollectionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `₹${value/1000}K`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="collected" fill="hsl(var(--chart-1))" name="Collected" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="hsl(var(--chart-2))" name="Pending" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="overdue" fill="hsl(var(--destructive))" name="Overdue" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Collection Trend
                  </CardTitle>
                  <CardDescription>Monthly collection efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={feeCollectionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `₹${value/1000}K`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="collected"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Fee by Hostel */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Hostel-wise Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hostel</TableHead>
                      <TableHead>Collected</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Collection Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeByHostelData.map((hostel) => (
                      <TableRow key={hostel.hostel}>
                        <TableCell className="font-medium">{hostel.hostel}</TableCell>
                        <TableCell className="text-success font-medium">₹{(hostel.collected / 100000).toFixed(1)}L</TableCell>
                        <TableCell className="text-warning">₹{(hostel.pending / 1000).toFixed(0)}K</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={hostel.rate} className="h-2 w-20" />
                            <span className="text-sm font-medium">{hostel.rate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={hostel.rate >= 95 ? 'default' : hostel.rate >= 90 ? 'secondary' : 'destructive'}>
                            {hostel.rate >= 95 ? 'Excellent' : hostel.rate >= 90 ? 'Good' : 'Needs Attention'}
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
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport('Complaints')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Resolution Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="rounded-full bg-primary/10 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{resolutionRate}%</p>
                  <p className="text-xs text-muted-foreground">Resolution Rate</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="rounded-full bg-success/10 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <Timer className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-2xl font-bold">2.3 days</p>
                  <p className="text-xs text-muted-foreground">Avg Resolution Time</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="rounded-full bg-chart-1/10 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-chart-1" />
                  </div>
                  <p className="text-2xl font-bold text-chart-1">{totalResolved}</p>
                  <p className="text-xs text-muted-foreground">Total Resolved</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="rounded-full bg-warning/10 h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">23</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Complaints by Category
                  </CardTitle>
                  <CardDescription>Distribution of complaint types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={complaintCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {complaintCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Resolution Trend
                  </CardTitle>
                  <CardDescription>Monthly complaint status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complaintTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="resolved" fill="hsl(var(--chart-1))" name="Resolved" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="inProgress" fill="hsl(var(--chart-2))" name="In Progress" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="open" fill="hsl(var(--destructive))" name="Open" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resolution by Priority & Warden Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Resolution Time by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resolutionTimeData.map((item) => (
                      <div key={item.priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            item.priority === 'High' ? 'destructive' : 
                            item.priority === 'Medium' ? 'default' : 'secondary'
                          }>
                            {item.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Target: {item.target} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.avgDays} days</span>
                          {item.avgDays <= item.target ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Wardens</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Warden</TableHead>
                        <TableHead>Hostel</TableHead>
                        <TableHead>Resolved</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wardenPerformanceData.map((warden, index) => (
                        <TableRow key={warden.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {index === 0 && <span className="text-yellow-500">🥇</span>}
                              {index === 1 && <span className="text-gray-400">🥈</span>}
                              {index === 2 && <span className="text-amber-600">🥉</span>}
                              {warden.name}
                            </div>
                          </TableCell>
                          <TableCell>{warden.hostel}</TableCell>
                          <TableCell>{warden.resolved}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">⭐ {warden.rating}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleExport('Applications')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Application Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{applicationData.reduce((sum, d) => sum + d.received, 0)}</p>
                  <p className="text-xs text-muted-foreground">Total Received</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-success">{applicationData.reduce((sum, d) => sum + d.approved, 0)}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">{applicationData.reduce((sum, d) => sum + d.rejected, 0)}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-warning">{applicationData.reduce((sum, d) => sum + d.pending, 0)}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Application Trend
                  </CardTitle>
                  <CardDescription>Monthly application statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={applicationData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="approved" fill="hsl(var(--chart-1))" name="Approved" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="rejected" fill="hsl(var(--destructive))" name="Rejected" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="hsl(var(--chart-2))" name="Pending" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Application Volume
                  </CardTitle>
                  <CardDescription>Monthly received applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={applicationData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="received"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Approval Rate */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Approval Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className="text-success stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                          strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">85%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Approval Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                          strokeDasharray={`${95 * 2.51} ${100 * 2.51}`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">1.2d</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Avg Processing Time</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="8"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className="text-chart-2 stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="48"
                          cy="48"
                          strokeDasharray={`${5 * 2.51} ${100 * 2.51}`}
                          transform="rotate(-90 48 48)"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">5%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Pending Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

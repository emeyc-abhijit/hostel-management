import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { StudentAttendanceWidget } from '@/components/dashboard/StudentAttendanceWidget';
import { StudentFeesWidget } from '@/components/dashboard/StudentFeesWidget';
import { StudentComplaintsWidget } from '@/components/dashboard/StudentComplaintsWidget';
import { StudentNoticesWidget } from '@/components/dashboard/StudentNoticesWidget';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, BedDouble, MessageSquare, CreditCard, Calendar } from 'lucide-react';

const adminStats = [
  { title: 'Total Students', value: '1,024', change: '+12% this month', changeType: 'positive' as const, icon: Users, iconColor: 'bg-info/10 text-info' },
  { title: 'Total Hostels', value: '6', change: 'Fully operational', changeType: 'neutral' as const, icon: Building2, iconColor: 'bg-primary/10 text-primary' },
  { title: 'Available Beds', value: '144', change: '14% capacity', changeType: 'neutral' as const, icon: BedDouble, iconColor: 'bg-success/10 text-success' },
  { title: 'Pending Complaints', value: '23', change: '-8% from last week', changeType: 'positive' as const, icon: MessageSquare, iconColor: 'bg-warning/10 text-warning' },
];

const wardenStats = [
  { title: 'My Hostel Students', value: '186', change: 'Boys Hostel A', changeType: 'neutral' as const, icon: Users, iconColor: 'bg-info/10 text-info' },
  { title: 'Available Rooms', value: '12', change: '6.5% capacity', changeType: 'neutral' as const, icon: BedDouble, iconColor: 'bg-success/10 text-success' },
  { title: 'Today\'s Attendance', value: '94%', change: '+2% from yesterday', changeType: 'positive' as const, icon: Calendar, iconColor: 'bg-primary/10 text-primary' },
  { title: 'Open Complaints', value: '8', change: '3 high priority', changeType: 'negative' as const, icon: MessageSquare, iconColor: 'bg-warning/10 text-warning' },
];

const studentStats = [
  { title: 'Room Number', value: '204', change: 'Boys Hostel A', changeType: 'neutral' as const, icon: BedDouble, iconColor: 'bg-primary/10 text-primary' },
  { title: 'Fee Status', value: 'Paid', change: 'Valid till Dec 2024', changeType: 'positive' as const, icon: CreditCard, iconColor: 'bg-success/10 text-success' },
  { title: 'Attendance', value: '92%', change: 'This semester', changeType: 'positive' as const, icon: Calendar, iconColor: 'bg-info/10 text-info' },
  { title: 'My Complaints', value: '1', change: 'In progress', changeType: 'neutral' as const, icon: MessageSquare, iconColor: 'bg-warning/10 text-warning' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const getStats = () => {
    switch (user?.role) {
      case 'admin':
        return adminStats;
      case 'warden':
        return wardenStats;
      case 'student':
        return studentStats;
      default:
        return adminStats;
    }
  };

  const getSubtitle = () => {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `Welcome back, ${user?.name} • ${date}`;
  };

  return (
    <DashboardLayout title="Dashboard" subtitle={getSubtitle()}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {getStats().map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Student-specific Dashboard */}
        {isStudent ? (
          <div className="grid gap-6 lg:grid-cols-2 stagger-children">
            {/* Attendance Widget */}
            <StudentAttendanceWidget />
            
            {/* Fees Widget */}
            <StudentFeesWidget />
            
            {/* Complaints Widget */}
            <StudentComplaintsWidget />
            
            {/* Notices Widget */}
            <StudentNoticesWidget />
          </div>
        ) : (
          /* Admin/Warden Dashboard */
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2 animate-fade-in-up">
              <RecentActivity />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <QuickActions />
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <OccupancyChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

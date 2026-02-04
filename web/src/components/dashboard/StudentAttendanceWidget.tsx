import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const attendanceData = {
  percentage: 92,
  totalDays: 120,
  present: 110,
  absent: 6,
  leave: 4,
  recentRecords: [
    { date: '2024-01-12', status: 'present' },
    { date: '2024-01-11', status: 'present' },
    { date: '2024-01-10', status: 'leave' },
    { date: '2024-01-09', status: 'present' },
    { date: '2024-01-08', status: 'absent' },
    { date: '2024-01-07', status: 'present' },
    { date: '2024-01-06', status: 'present' },
  ],
};

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', ring: 'ring-success/20' },
  absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', ring: 'ring-destructive/20' },
  leave: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', ring: 'ring-warning/20' },
};

export function StudentAttendanceWidget() {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'from-success to-success/70';
    if (percentage >= 75) return 'from-warning to-warning/70';
    return 'from-destructive to-destructive/70';
  };

  return (
    <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-card-hover transition-all duration-300">
      {/* Decorative top gradient */}
      <div className="h-1 bg-gradient-to-r from-success via-success/50 to-transparent" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <span>Attendance Overview</span>
          </CardTitle>
          <Badge 
            variant={attendanceData.percentage >= 75 ? 'default' : 'destructive'}
            className="rounded-full px-3 font-medium"
          >
            {attendanceData.percentage >= 75 ? 'Good Standing' : 'Low Attendance'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main Percentage Display */}
        <div className="relative text-center py-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              {/* Circular progress background */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/50"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${attendanceData.percentage * 3.51} 351`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--success))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <TrendingUp className={`h-4 w-4 ${getStatusColor(attendanceData.percentage)} mb-1`} />
                <span className={`text-3xl font-bold ${getStatusColor(attendanceData.percentage)}`}>
                  {attendanceData.percentage}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Overall Attendance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Present', value: attendanceData.present, color: 'success' },
            { label: 'Absent', value: attendanceData.absent, color: 'destructive' },
            { label: 'Leave', value: attendanceData.leave, color: 'warning' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className={`relative text-center p-3 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 overflow-hidden group/stat hover:scale-105 transition-transform duration-200`}
            >
              <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <div className={`absolute inset-0 bg-${stat.color}/5 opacity-0 group-hover/stat:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        {/* Recent 7 Days */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Last 7 Days</p>
          <div className="flex gap-2 justify-between">
            {attendanceData.recentRecords.map((record, idx) => {
              const config = statusConfig[record.status as keyof typeof statusConfig];
              const Icon = config.icon;
              const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div 
                  key={idx} 
                  className="flex flex-col items-center gap-1.5 group/day"
                >
                  <div className={`p-2 rounded-xl ${config.bg} ring-1 ${config.ring} transition-all duration-200 group-hover/day:scale-110`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

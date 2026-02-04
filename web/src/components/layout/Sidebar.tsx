import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  MessageSquare,
  Bell,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  FileText,
  BedDouble,
  BarChart3,
  Sparkles,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<'admin' | 'warden' | 'student'>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'warden', 'student'] },
  { label: 'Hostels', href: '/hostels', icon: Building2, roles: ['admin', 'warden'] },
  { label: 'Rooms', href: '/rooms', icon: BedDouble, roles: ['admin', 'warden'] },
  { label: 'Students', href: '/students', icon: Users, roles: ['admin', 'warden'] },
  { label: 'Applications', href: '/applications', icon: ClipboardList, roles: ['admin', 'warden'] },
  { label: 'My Room', href: '/my-room', icon: BedDouble, roles: ['student'] },
  { label: 'Apply Hostel', href: '/apply', icon: FileText, roles: ['student'] },
  { label: 'Complaints', href: '/complaints', icon: MessageSquare, roles: ['admin', 'warden', 'student'] },
  { label: 'Notices', href: '/notices', icon: Bell, roles: ['admin', 'warden', 'student'] },
  { label: 'Fees', href: '/fees', icon: CreditCard, roles: ['admin', 'student'] },
  { label: 'Attendance', href: '/attendance', icon: Calendar, roles: ['warden', 'student'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'warden'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'warden', 'student'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar overflow-hidden transition-transform duration-300 ease-in-out',
      // Mobile: slide in/out, Desktop: always visible
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Logo */}
      <div className="relative flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
            <Building2 className="h-6 w-6 text-primary-foreground" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-warning animate-pulse-soft" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-sidebar-foreground tracking-tight">Medhavi</span>
            <span className="text-xs text-sidebar-foreground/50 font-medium">HMS Portal</span>
          </div>
        </div>
        
        {/* Close button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1 stagger-children">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                {/* Active background with gradient */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25" />
                )}
                
                {/* Hover indicator */}
                <div className={cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary transition-all duration-200',
                  isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                )} />
                
                <Icon className={cn(
                  'relative h-5 w-5 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )} />
                <span className="relative">{item.label}</span>
                
                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl pointer-events-none" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="relative border-t border-sidebar-border/50 p-4">
        <div className="mb-3 flex items-center gap-3 p-2 rounded-xl bg-sidebar-accent/30 backdrop-blur-sm">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-lg">
            {user?.name.charAt(0)}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-sidebar" />
          </div>
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs capitalize text-sidebar-foreground/50">
              {user?.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

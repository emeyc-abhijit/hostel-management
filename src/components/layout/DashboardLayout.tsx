import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHostel } from '@/contexts/HostelContext';
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  MessageSquare,
  Calendar,
  Bell,
  UserCog,
  LogOut,
  Menu,
  X,
  Search,
  Building2,
  ChevronRight,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationCenter } from '@/components/NotificationCenter';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { selectedHostel, setSelectedHostel, hostels } = useHostel();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedHostel, setExpandedHostel] = useState<string | null>(selectedHostel?.id || null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hostelFeatures = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'warden'] },
    { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'warden'] },
    { name: 'Rooms', href: '/rooms', icon: DoorOpen, roles: ['admin', 'warden'] },
    { name: 'Fees', href: '/fees', icon: CreditCard, roles: ['admin', 'warden'] },
    { name: 'Complaints', href: '/complaints', icon: MessageSquare, roles: ['admin', 'warden'] },
    { name: 'Leaves', href: '/leaves', icon: Calendar, roles: ['admin', 'warden'] },
    { name: 'Staff', href: '/staff', icon: UserCog, roles: ['admin'] },
    { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'warden'] },
  ];

  const studentNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Room', href: '/my-room', icon: DoorOpen },
    { name: 'My Fees', href: '/my-fees', icon: CreditCard },
    { name: 'My Complaints', href: '/my-complaints', icon: MessageSquare },
    { name: 'My Leaves', href: '/my-leaves', icon: Calendar },
  ];

  const handleHostelClick = (hostelId: string) => {
    const hostel = hostels.find(h => h.id === hostelId);
    if (hostel) {
      setSelectedHostel(hostel);
      setExpandedHostel(expandedHostel === hostelId ? null : hostelId);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Medhavi HMS
          </h1>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {user?.role === 'student' ? (
            // Student view - simple navigation
            studentNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })
          ) : (
            // Admin/Warden view - hostel-based navigation
            <>
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  Hostels
                </span>
                {user?.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-sidebar-accent"
                    onClick={() => navigate('/hostels')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {hostels.length === 0 ? (
                <div className="px-3 py-4 text-sm text-sidebar-foreground/60 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="mb-2">No hostels yet</p>
                  {user?.role === 'admin' && (
                    <Button
                      size="sm"
                      onClick={() => navigate('/hostels')}
                      className="mt-2"
                    >
                      Create Hostel
                    </Button>
                  )}
                </div>
              ) : (
                hostels.map((hostel) => {
                  const isExpanded = expandedHostel === hostel.id;
                  const isSelected = selectedHostel?.id === hostel.id;

                  return (
                    <div key={hostel.id} className="space-y-1">
                      <button
                        onClick={() => handleHostelClick(hostel.id)}
                        className={cn(
                          'flex items-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'bg-sidebar-accent text-sidebar-foreground'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                        )}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <Building2 className="h-5 w-5 shrink-0" />
                        <span className="truncate">{hostel.name}</span>
                      </button>

                      {isExpanded && (
                        <div className="ml-6 space-y-1 border-l border-sidebar-border pl-3">
                          {hostelFeatures
                            .filter((feature) => user && feature.roles.includes(user.role))
                            .map((feature) => {
                              const isActive = location.pathname === feature.href;
                              return (
                                <Link
                                  key={feature.name}
                                  to={feature.href}
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                    isActive
                                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                  )}
                                >
                                  <feature.icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </nav>

          <div className="border-t border-sidebar-border p-4">
          <Link to="/profile" className="block">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-white font-semibold shadow-lg">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <aside
          className={cn(
            'fixed left-0 top-0 h-full w-64 transform border-r border-border bg-card transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <h1 className="text-xl font-bold text-primary">Medhavi HMS</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {user?.role === 'student' ? (
              studentNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Hostels
                  </span>
                  {user?.role === 'admin' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        navigate('/hostels');
                        setSidebarOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {hostels.map((hostel) => {
                  const isExpanded = expandedHostel === hostel.id;
                  const isSelected = selectedHostel?.id === hostel.id;

                  return (
                    <div key={hostel.id} className="space-y-1">
                      <button
                        onClick={() => handleHostelClick(hostel.id)}
                        className={cn(
                          'flex items-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isSelected
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <Building2 className="h-5 w-5 shrink-0" />
                        <span className="truncate">{hostel.name}</span>
                      </button>

                      {isExpanded && (
                        <div className="ml-6 space-y-1 border-l border-border pl-3">
                          {hostelFeatures
                            .filter((feature) => user && feature.roles.includes(user.role))
                            .map((feature) => {
                              const isActive = location.pathname === feature.href;
                              return (
                                <Link
                                  key={feature.name}
                                  to={feature.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                  )}
                                >
                                  <feature.icon className="h-4 w-4" />
                                  {feature.name}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </nav>

          <div className="border-t border-border p-4">
            <Link to="/profile" className="block">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationCenter />
            <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-white text-sm font-semibold shadow-md">
                {user?.name.charAt(0)}
              </div>
              <Link to="/profile" className="hidden xl:flex flex-col">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
};

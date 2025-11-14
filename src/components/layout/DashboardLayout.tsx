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
          <img
            src="/MSU-logo.svg"
            alt="Medhavi Hostel Logo"
            className="h-10 w-auto object-contain"
          />
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
                    className="h-7 w-7 p-0"
                    onClick={() => navigate('/hostels/new')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {hostels.length === 0 ? (
                <div className="px-2 py-4 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">No hostels yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/hostels/new')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Hostel
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {hostels.map((hostel) => {
                    const isExpanded = expandedHostel === hostel.id;
                    const isHostelActive = selectedHostel?.id === hostel.id;

                    return (
                      <div key={hostel.id} className="space-y-1">
                        <button
                          onClick={() => handleHostelClick(hostel.id)}
                          className={cn(
                            'w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            isHostelActive
                              ? 'bg-sidebar-accent/50 text-sidebar-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="truncate">{hostel.name}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="ml-6 space-y-1 border-l border-sidebar-border/50 pl-3">
                            {hostelFeatures
                              .filter((feature) => feature.roles.includes(user?.role || ''))
                              .map((feature) => {
                                const isActive = location.pathname === feature.href;
                                return (
                                  <Link
                                    key={feature.name}
                                    to={feature.href}
                                    className={cn(
                                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                      isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
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
                </div>
              )}

              {user?.role === 'admin' && hostels.length > 0 && (
                <>
                  <div className="my-4 border-t border-sidebar-border" />
                  <Link
                    to="/hostels"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      location.pathname === '/hostels'
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <Building2 className="h-5 w-5" />
                    Manage Hostels
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user?.name}</span>
                <span className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-9 bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Link to="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-sidebar">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
              <img
                src="/MSU-logo.svg"
                alt="Medhavi Hostel Logo"
                className="h-10 w-auto object-contain"
              />
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
                <>
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                      Hostels
                    </span>
                    {user?.role === 'admin' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          navigate('/hostels/new');
                          setSidebarOpen(false);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {hostels.length === 0 ? (
                    <div className="px-2 py-4 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-xs text-muted-foreground mb-3">No hostels yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigate('/hostels/new');
                          setSidebarOpen(false);
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Hostel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {hostels.map((hostel) => {
                        const isExpanded = expandedHostel === hostel.id;
                        const isHostelActive = selectedHostel?.id === hostel.id;

                        return (
                          <div key={hostel.id} className="space-y-1">
                            <button
                              onClick={() => handleHostelClick(hostel.id)}
                              className={cn(
                                'w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isHostelActive
                                  ? 'bg-sidebar-accent/50 text-sidebar-foreground'
                                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span className="truncate">{hostel.name}</span>
                              </div>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="ml-6 space-y-1 border-l border-sidebar-border/50 pl-3">
                                {hostelFeatures
                                  .filter((feature) => feature.roles.includes(user?.role || ''))
                                  .map((feature) => {
                                    const isActive = location.pathname === feature.href;
                                    return (
                                      <Link
                                        key={feature.name}
                                        to={feature.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                          isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
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
                    </div>
                  )}

                  {user?.role === 'admin' && hostels.length > 0 && (
                    <>
                      <div className="my-4 border-t border-sidebar-border" />
                      <Link
                        to="/hostels"
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          location.pathname === '/hostels'
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        )}
                      >
                        <Building2 className="h-5 w-5" />
                        Manage Hostels
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-sidebar-foreground">{user?.name}</span>
                    <span className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Bell, Search, Command, Menu, Settings, LogOut, User, FileText, CreditCard, HelpCircle, ChevronRight, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: 'Fee Payment Reminder',
    message: 'Your hostel fee for January is due in 3 days',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: 2,
    title: 'Complaint Resolved',
    message: 'Your complaint about AC maintenance has been resolved',
    time: '5 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: 3,
    title: 'New Notice Posted',
    message: 'Important: Hostel timings updated for exam period',
    time: '1 day ago',
    type: 'info',
    read: true,
  },
];

// Search navigation items
const searchItems = [
  { label: 'Dashboard', path: '/', category: 'Pages' },
  { label: 'My Room', path: '/my-room', category: 'Pages' },
  { label: 'Attendance', path: '/attendance', category: 'Pages' },
  { label: 'Complaints', path: '/complaints', category: 'Pages' },
  { label: 'Notices', path: '/notices', category: 'Pages' },
  { label: 'Fees', path: '/fees', category: 'Pages' },
  { label: 'Settings', path: '/settings', category: 'Pages' },
  { label: 'Students', path: '/students', category: 'Management' },
  { label: 'Rooms', path: '/rooms', category: 'Management' },
  { label: 'Hostels', path: '/hostels', category: 'Management' },
  { label: 'Applications', path: '/applications', category: 'Management' },
  { label: 'Reports', path: '/reports', category: 'Management' },
];

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-xl gap-4">
        {/* Left Section - Menu + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 flex-shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Title Section */}
          <div className="animate-fade-in-down min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Search Button - hidden on mobile */}
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 h-9 px-3 bg-muted/50 border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>

          {/* Mobile search icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9 rounded-xl hover:bg-muted transition-all duration-200"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-xl hover:bg-muted transition-all duration-200"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-[9px] sm:text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/25 animate-bounce-in">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 h-auto p-0">
                  Mark all read
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border/50 p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-sm text-primary hover:text-primary/80"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/notices');
                  }}
                >
                  View all notifications
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider - hidden on small mobile */}
          <div className="hidden sm:block h-6 w-px bg-border/50" />

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div className="relative group">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/30 group-hover:scale-105">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-success rounded-full border-2 border-background" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/my-room')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/fees')} className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Fee Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/attendance')} className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Attendance</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/complaints')} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>My Complaints</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Palette Search */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search pages, features..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems.filter(item => item.category === 'Pages').map((item) => (
              <CommandItem
                key={item.path}
                onSelect={() => {
                  navigate(item.path);
                  setSearchOpen(false);
                }}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Management">
            {searchItems.filter(item => item.category === 'Management').map((item) => (
              <CommandItem
                key={item.path}
                onSelect={() => {
                  navigate(item.path);
                  setSearchOpen(false);
                }}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

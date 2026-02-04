import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, GraduationCap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: 'admin', label: 'Administrator', icon: Shield, description: 'Full system access' },
  { value: 'warden', label: 'Warden', icon: Users, description: 'Hostel management' },
  { value: 'student', label: 'Student', icon: GraduationCap, description: 'Resident access' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex gradient-hero relative flex-col items-center justify-center p-12 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10 max-w-md text-center animate-fade-in">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <Building2 className="h-16 w-16" />
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Medhavi Skills University
          </h1>
          <h2 className="mb-6 text-2xl font-semibold text-white/90">
            Hostel Management System
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            A comprehensive digital solution for managing hostel operations, 
            student accommodations, and administrative tasks.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm text-white/70">Students</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-white/70">Hostels</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-white/70">Rooms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <div className="inline-flex items-center justify-center rounded-xl bg-primary p-3 mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Medhavi HMS</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your hostel portal
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select your role</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6 transition-colors',
                        selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium',
                        selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {role.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@medhavi.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Demo: Use any email and password to login
          </p>
        </div>
      </div>
    </div>
  );
}

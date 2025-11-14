import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Plus, Users, DoorOpen, CreditCard, MessageSquare } from 'lucide-react';

export default function HostelLanding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Track and manage student records, admissions, and profiles',
    },
    {
      icon: DoorOpen,
      title: 'Room Management',
      description: 'Allocate rooms, manage occupancy, and track availability',
    },
    {
      icon: CreditCard,
      title: 'Fee Management',
      description: 'Handle fee collection, track payments, and generate receipts',
    },
    {
      icon: MessageSquare,
      title: 'Complaints & Requests',
      description: 'Manage student complaints, maintenance requests, and grievances',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Building2 className="relative w-20 h-20 text-primary animate-float" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Welcome to Medhavi HMS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete Hostel Management System for Educational Institutions
          </p>
        </div>

        {/* Main CTA Card */}
        <Card className="glass-card border-primary/20 shadow-premium">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">Create Your First Hostel</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start managing your hostel operations efficiently. Create a hostel to unlock all management features including rooms, students, fees, and more.
              </p>
            </div>
            
            <Button
              size="lg"
              onClick={() => navigate('/hostels/new')}
              className="text-lg px-8 py-6 h-auto shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Hostel
            </Button>

            <p className="text-sm text-muted-foreground pt-4">
              It only takes a few minutes to set up
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-premium group">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <Card className="glass-card border-info/20 bg-info/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help getting started?{' '}
              <Button variant="link" className="p-0 h-auto text-primary font-semibold" onClick={() => navigate('/hostels/new')}>
                Follow our quick setup guide →
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, MapPin, Pencil, Trash2, Plus } from 'lucide-react';
import hostelService from '@/lib/hostelService';
import { Hostel } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Hostels() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    const data = await hostelService.getHostels();
    setHostels(data);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await hostelService.deleteHostel(deleteId);
    if (success) {
      toast({
        title: 'Hostel deleted',
        description: 'The hostel has been removed successfully.',
      });
      loadHostels();
    }
    setDeleteId(null);
  };

  const getOccupancyRate = (hostel: Hostel) => {
    return ((hostel.occupied / hostel.capacity) * 100).toFixed(0);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-destructive';
    if (rate >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hostel Management</h1>
          <p className="text-muted-foreground">Manage hostels and their configurations</p>
        </div>
        <Button onClick={() => navigate('/hostels/new')} className="glass-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Hostel
        </Button>
      </div>

      {hostels.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hostels yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first hostel to start managing rooms, students, and facilities.
            </p>
            <Button onClick={() => navigate('/hostels/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Hostel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => {
            const occupancyRate = parseFloat(getOccupancyRate(hostel));
            return (
              <Card key={hostel.id} className="glass-card hover-lift cursor-pointer transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{hostel.name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {hostel.code}
                      </Badge>
                    </div>
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{hostel.address}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Occupancy</span>
                      <span className={`text-sm font-semibold ${getOccupancyColor(occupancyRate)}`}>
                        {occupancyRate}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{hostel.occupied} occupied</span>
                      <span>{hostel.capacity} total</span>
                    </div>
                  </div>

                  {hostel.warden && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-medium mb-1">Warden</p>
                      <p className="text-sm text-muted-foreground">{hostel.warden}</p>
                      {hostel.wardenPhone && (
                        <p className="text-xs text-muted-foreground">{hostel.wardenPhone}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                      {hostel.facilities.map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/hostel/${hostel.id}/dashboard`)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/hostels/edit/${hostel.id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(hostel.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hostel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hostel? This action cannot be undone.
              All associated data (rooms, students) will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

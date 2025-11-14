import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import hostelService from '@/lib/hostelService';
import { Hostel } from '@/types';
import { useToast } from '@/hooks/use-toast';

const hostelSchema = z.object({
  name: z.string().min(1, 'Hostel name is required'),
  code: z.string().min(1, 'Hostel code is required'),
  address: z.string().min(1, 'Address is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  warden: z.string().optional(),
  wardenPhone: z.string().optional(),
});

type HostelFormData = z.infer<typeof hostelSchema>;

export default function HostelForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState('');
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HostelFormData>({
    resolver: zodResolver(hostelSchema),
    defaultValues: {
      capacity: 100,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      loadHostel(id);
    }
  }, [id, isEdit]);

  const loadHostel = async (hostelId: string) => {
    const hostel = await hostelService.getHostelById(hostelId);
    if (hostel) {
      setValue('name', hostel.name);
      setValue('code', hostel.code);
      setValue('address', hostel.address);
      setValue('capacity', hostel.capacity);
      setValue('warden', hostel.warden || '');
      setValue('wardenPhone', hostel.wardenPhone || '');
      setFacilities(hostel.facilities);
    }
  };

  const onSubmit = async (data: HostelFormData) => {
    const hostelData: Hostel = {
      id: isEdit ? id! : `h${Date.now()}`,
      name: data.name,
      code: data.code,
      address: data.address,
      capacity: data.capacity,
      warden: data.warden,
      wardenPhone: data.wardenPhone,
      occupied: 0,
      facilities,
      createdAt: new Date().toISOString(),
    };

    if (isEdit) {
      await hostelService.updateHostel(id!, hostelData);
      toast({
        title: 'Hostel updated',
        description: 'The hostel has been updated successfully.',
      });
    } else {
      await hostelService.createHostel(hostelData);
      toast({
        title: 'Hostel created',
        description: 'The new hostel has been added successfully.',
      });
    }

    navigate('/hostels');
  };

  const addFacility = () => {
    const trimmed = facilityInput.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setFacilities([...facilities, trimmed]);
      setFacilityInput('');
    }
  };

  const removeFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isEdit ? 'Edit Hostel' : 'Create New Hostel'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update hostel information' : 'Add a new hostel to the system'}
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Hostel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Hostel Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Block A - Boys Hostel"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Hostel Code *</Label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="e.g., BLK-A"
                />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Complete address of the hostel"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Total Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                placeholder="Total number of students"
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="warden">Warden Name</Label>
                <Input
                  id="warden"
                  {...register('warden')}
                  placeholder="Name of the warden"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wardenPhone">Warden Phone</Label>
                <Input
                  id="wardenPhone"
                  {...register('wardenPhone')}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities</Label>
              <div className="flex gap-2">
                <Input
                  id="facilities"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                  placeholder="Add facility (e.g., WiFi, Gym)"
                />
                <Button type="button" variant="secondary" onClick={addFacility}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {facilities.map((facility) => (
                  <Badge key={facility} variant="secondary" className="gap-1">
                    {facility}
                    <button
                      type="button"
                      onClick={() => removeFacility(facility)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEdit ? 'Update Hostel' : 'Create Hostel'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/hostels')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const exitFormSchema = z.object({
  reason: z.string().min(20, 'Reason must be at least 20 characters'),
  lastDate: z.string().min(1, 'Last date is required'),
  forwardingAddress: z.string().min(10, 'Please provide a valid forwarding address'),
  guardianConsent: z.string().min(1, 'Guardian consent is required'),
  clearanceDues: z.enum(['yes', 'no']),
  clearanceReason: z.string().optional(),
});

type ExitFormData = z.infer<typeof exitFormSchema>;

export default function ExitForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ExitFormData>({
    resolver: zodResolver(exitFormSchema),
    defaultValues: {
      reason: '',
      lastDate: '',
      forwardingAddress: '',
      guardianConsent: '',
      clearanceDues: 'yes',
      clearanceReason: '',
    },
  });

  const onSubmit = (data: ExitFormData) => {
    console.log('Exit application:', data);
    toast({
      title: 'Application submitted successfully',
      description: 'Your permanent leaving application has been submitted for approval.',
    });
    navigate('/my-entry-exit');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permanent Leaving Application</h1>
        <p className="text-muted-foreground">Submit your application to permanently leave the hostel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaving Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leaving</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain in detail why you are leaving the hostel permanently"
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Date in Hostel</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forwardingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forwarding Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Where can we contact you after leaving?"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guardianConsent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Name (Consent Provided)</FormLabel>
                    <FormControl>
                      <Input placeholder="Parent/Guardian who has given consent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clearanceDues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are all dues cleared?</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="yes"
                            checked={field.value === 'yes'}
                            onChange={() => field.onChange('yes')}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="no"
                            checked={field.value === 'no'}
                            onChange={() => field.onChange('no')}
                          />
                          No
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('clearanceDues') === 'no' && (
                <FormField
                  control={form.control}
                  name="clearanceReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Pending Dues</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why there are pending dues"
                          className="min-h-[60px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-4">
                <Button type="submit">Submit Application</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

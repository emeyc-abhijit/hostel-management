import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const entryExitSchema = z.object({
  requestType: z.enum(['entry', 'exit']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  destination: z.string().optional(),
  contactDuringAbsence: z.string().optional(),
});

type EntryExitFormData = z.infer<typeof entryExitSchema>;

export default function EntryExitForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<EntryExitFormData>({
    resolver: zodResolver(entryExitSchema),
    defaultValues: {
      requestType: 'exit',
      startDate: '',
      endDate: '',
      purpose: '',
      destination: '',
      contactDuringAbsence: '',
    },
  });

  const onSubmit = (data: EntryExitFormData) => {
    console.log('Entry/Exit request:', data);
    toast({
      title: 'Request submitted successfully',
      description: 'Your entry/exit permission request has been submitted for approval.',
    });
    navigate('/my-entry-exit');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Entry/Exit Permission Request</h1>
        <p className="text-muted-foreground">Submit a request for entry or exit permission</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry">Entry Permission</SelectItem>
                        <SelectItem value="exit">Exit Permission</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain the reason for this request"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Where will you be going?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactDuringAbsence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact During Absence (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number or email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit">Submit Request</Button>
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

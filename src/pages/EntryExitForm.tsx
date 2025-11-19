import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileCheck, DoorOpen, ArrowLeft } from 'lucide-react';

export default function EntryExitForm() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Entry/Exit Application</h1>
        <p className="text-muted-foreground">Choose the type of application you want to submit</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/entry-exit/entry')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-primary" />
              Entry Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View your hostel admission form and details. Required for entry permissions.
            </p>
            <Button className="w-full">
              View Admission Form
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/entry-exit/exit')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="h-6 w-6 text-destructive" />
              Exit Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Submit a permanent leaving application to exit the hostel.
            </p>
            <Button variant="destructive" className="w-full">
              Submit Exit Form
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

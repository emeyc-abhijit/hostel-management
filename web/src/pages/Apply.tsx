import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  X,
  FileIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const hostels = [
  { id: 'boys-a', name: 'Boys Hostel A', type: 'boys', available: 24 },
  { id: 'boys-b', name: 'Boys Hostel B', type: 'boys', available: 15 },
  { id: 'boys-c', name: 'Boys Hostel C', type: 'boys', available: 35 },
  { id: 'girls-a', name: 'Girls Hostel A', type: 'girls', available: 6 },
  { id: 'girls-b', name: 'Girls Hostel B', type: 'girls', available: 15 },
];

const roomTypes = [
  { id: 'single', name: 'Single Room', price: 35000, description: 'Private room with attached bathroom' },
  { id: 'double', name: 'Double Sharing', price: 25000, description: 'Shared room with 1 roommate' },
  { id: 'triple', name: 'Triple Sharing', price: 18000, description: 'Shared room with 2 roommates' },
];

export default function Apply() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Academic Details
    enrollmentNo: '',
    course: '',
    year: '',
    department: '',
    // Guardian Details
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    // Preferences
    preferredHostel: '',
    roomType: '',
    specialRequirements: '',
    // Documents
    documents: [] as UploadedFile[],
    // Terms
    termsAccepted: false,
  });

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedFile | null>>({
    photo: null,
    idProof: null,
    addressProof: null,
    admissionLetter: null,
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setUploadedDocs(prev => ({
        ...prev,
        [docType]: { name: file.name, size: file.size, type: file.type }
      }));
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  const removeFile = (docType: string) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: null }));
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "Your hostel application has been submitted successfully. You will receive a confirmation email shortly.",
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.gender;
      case 2:
        return formData.enrollmentNo && formData.course && formData.year;
      case 3:
        return formData.guardianName && formData.guardianPhone;
      case 4:
        return formData.preferredHostel && formData.roomType;
      case 5:
        return formData.termsAccepted && uploadedDocs.photo && uploadedDocs.idProof;
      default:
        return false;
    }
  };

  return (
    <DashboardLayout 
      title="Apply for Hostel" 
      subtitle="Complete the application form to apply for hostel accommodation"
    >
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        {/* Progress Bar */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-3">
              {['Personal', 'Academic', 'Guardian', 'Preferences', 'Documents'].map((label, index) => (
                <div 
                  key={label}
                  className={cn(
                    'flex flex-col items-center gap-1',
                    index + 1 <= step ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium',
                    index + 1 < step ? 'bg-primary text-primary-foreground' : 
                    index + 1 === step ? 'bg-primary/20 text-primary border-2 border-primary' : 
                    'bg-muted text-muted-foreground'
                  )}>
                    {index + 1 < step ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-[10px] hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card className="shadow-card">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Details
                </CardTitle>
                <CardDescription>
                  Enter your personal information as per official records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="you@medhavi.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(v) => handleInputChange('bloodGroup', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Permanent Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                      id="pincode" 
                      placeholder="PIN Code"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic Details
                </CardTitle>
                <CardDescription>
                  Provide your academic enrollment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNo">Enrollment Number *</Label>
                    <Input 
                      id="enrollmentNo" 
                      placeholder="e.g., MSU2024001"
                      value={formData.enrollmentNo}
                      onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Course *</Label>
                    <Select value={formData.course} onValueChange={(v) => handleInputChange('course', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech-cse">B.Tech Computer Science</SelectItem>
                        <SelectItem value="btech-ece">B.Tech Electronics</SelectItem>
                        <SelectItem value="btech-me">B.Tech Mechanical</SelectItem>
                        <SelectItem value="btech-ee">B.Tech Electrical</SelectItem>
                        <SelectItem value="btech-it">B.Tech IT</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="mca">MCA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year of Study *</Label>
                    <Select value={formData.year} onValueChange={(v) => handleInputChange('year', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      placeholder="e.g., Computer Science"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Guardian Details */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Guardian Details
                </CardTitle>
                <CardDescription>
                  Provide parent or guardian contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input 
                      id="guardianName" 
                      placeholder="Parent/Guardian name"
                      value={formData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relation *</Label>
                    <Select value={formData.guardianRelation} onValueChange={(v) => handleInputChange('guardianRelation', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone Number *</Label>
                    <Input 
                      id="guardianPhone" 
                      placeholder="+91 98765 43210"
                      value={formData.guardianPhone}
                      onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianEmail">Email Address</Label>
                    <Input 
                      id="guardianEmail" 
                      type="email"
                      placeholder="guardian@email.com"
                      value={formData.guardianEmail}
                      onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Hostel Preferences
                </CardTitle>
                <CardDescription>
                  Select your preferred hostel and room type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Preferred Hostel *</Label>
                  <RadioGroup 
                    value={formData.preferredHostel} 
                    onValueChange={(v) => handleInputChange('preferredHostel', v)}
                    className="grid gap-3"
                  >
                    {hostels
                      .filter(h => formData.gender === 'male' ? h.type === 'boys' : h.type === 'girls')
                      .map((hostel) => (
                        <div key={hostel.id} className="flex items-center space-x-3">
                          <RadioGroupItem value={hostel.id} id={hostel.id} />
                          <Label 
                            htmlFor={hostel.id} 
                            className="flex-1 flex items-center justify-between cursor-pointer p-3 rounded-lg border hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">{hostel.name}</span>
                            </div>
                            <span className="text-sm text-success">{hostel.available} beds available</span>
                          </Label>
                        </div>
                      ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Room Type *</Label>
                  <RadioGroup 
                    value={formData.roomType} 
                    onValueChange={(v) => handleInputChange('roomType', v)}
                    className="grid gap-3"
                  >
                    {roomTypes.map((room) => (
                      <div key={room.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={room.id} id={room.id} />
                        <Label 
                          htmlFor={room.id} 
                          className="flex-1 cursor-pointer p-4 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{room.name}</p>
                              <p className="text-sm text-muted-foreground">{room.description}</p>
                            </div>
                            <p className="text-lg font-bold text-primary">₹{room.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/sem</span></p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea 
                    id="specialRequirements" 
                    placeholder="Any medical conditions, dietary requirements, or other special needs..."
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 5: Documents */}
          {step === 5 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload required documents (Max 5MB each, PDF/JPG/PNG)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'photo', label: 'Passport Photo *', desc: 'Recent passport size photo' },
                    { key: 'idProof', label: 'ID Proof *', desc: 'Aadhar Card / Passport' },
                    { key: 'addressProof', label: 'Address Proof', desc: 'Utility bill / Bank statement' },
                    { key: 'admissionLetter', label: 'Admission Letter', desc: 'University admission letter' },
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label>{doc.label}</Label>
                      <div className="relative">
                        {uploadedDocs[doc.key] ? (
                          <div className="flex items-center gap-3 p-3 rounded-lg border bg-success/5 border-success/20">
                            <FileIcon className="h-8 w-8 text-success" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{uploadedDocs[doc.key]?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {((uploadedDocs[doc.key]?.size || 0) / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="shrink-0"
                              onClick={() => removeFile(doc.key)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-muted/50 cursor-pointer transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{doc.desc}</span>
                            <input 
                              type="file" 
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(doc.key, e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="terms" 
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange('termsAccepted', !!checked)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I hereby declare that all the information provided above is true and correct. I agree to abide by 
                      the hostel rules and regulations of Medhavi Skills University. I understand that any false 
                      information may lead to cancellation of my hostel allotment.
                    </label>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between p-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button 
                variant="hero"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="hero"
                onClick={handleSubmit}
                disabled={!canProceed()}
              >
                <CheckCircle className="h-4 w-4" />
                Submit Application
              </Button>
            )}
          </div>
        </Card>

        {/* Help Card */}
        <Card className="shadow-card bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Need Help?</p>
                <p>Contact the hostel office at <span className="text-primary">hostel@medhavi.edu</span> or call <span className="text-primary">+91 1234 567890</span> for any queries regarding your application.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

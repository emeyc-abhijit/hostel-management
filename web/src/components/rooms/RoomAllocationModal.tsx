import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';
import { Search, UserPlus, Users, GraduationCap, X, Check, BedDouble } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnassignedStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  year: number;
  gender: 'male' | 'female';
  applicationDate: string;
}

interface CurrentOccupant {
  id: string;
  name: string;
  email: string;
  course: string;
  year: number;
  joinedDate: string;
}

interface RoomAllocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onAllocate: (roomId: string, studentIds: string[]) => void;
  onDeallocate: (roomId: string, studentId: string) => void;
}

// Mock unassigned students
const mockUnassignedStudents: UnassignedStudent[] = [
  { id: 'u1', name: 'Ananya Sharma', email: 'ananya.s@medhavi.edu', course: 'B.Tech CSE', year: 1, gender: 'female', applicationDate: '2024-01-10' },
  { id: 'u2', name: 'Rahul Verma', email: 'rahul.v@medhavi.edu', course: 'B.Tech ECE', year: 1, gender: 'male', applicationDate: '2024-01-11' },
  { id: 'u3', name: 'Sneha Patel', email: 'sneha.p@medhavi.edu', course: 'B.Tech IT', year: 2, gender: 'female', applicationDate: '2024-01-12' },
  { id: 'u4', name: 'Vikram Singh', email: 'vikram.s@medhavi.edu', course: 'B.Tech ME', year: 1, gender: 'male', applicationDate: '2024-01-13' },
  { id: 'u5', name: 'Priya Gupta', email: 'priya.g@medhavi.edu', course: 'B.Tech CSE', year: 3, gender: 'female', applicationDate: '2024-01-14' },
  { id: 'u6', name: 'Arjun Reddy', email: 'arjun.r@medhavi.edu', course: 'B.Tech EE', year: 2, gender: 'male', applicationDate: '2024-01-15' },
  { id: 'u7', name: 'Kavya Nair', email: 'kavya.n@medhavi.edu', course: 'B.Tech CSE', year: 1, gender: 'female', applicationDate: '2024-01-16' },
  { id: 'u8', name: 'Rohit Kumar', email: 'rohit.k@medhavi.edu', course: 'B.Tech CE', year: 1, gender: 'male', applicationDate: '2024-01-17' },
];

// Mock current occupants (varies by room)
const mockOccupants: Record<string, CurrentOccupant[]> = {
  '1': [
    { id: 'o1', name: 'Meera Iyer', email: 'meera.i@medhavi.edu', course: 'B.Tech CSE', year: 2, joinedDate: '2023-08-15' },
    { id: 'o2', name: 'Divya Krishnan', email: 'divya.k@medhavi.edu', course: 'B.Tech IT', year: 2, joinedDate: '2023-08-15' },
    { id: 'o3', name: 'Lakshmi Menon', email: 'lakshmi.m@medhavi.edu', course: 'B.Tech ECE', year: 2, joinedDate: '2023-08-15' },
  ],
  '2': [
    { id: 'o4', name: 'Arun Prakash', email: 'arun.p@medhavi.edu', course: 'B.Tech ME', year: 3, joinedDate: '2022-08-20' },
  ],
  '6': [
    { id: 'o5', name: 'Neha Sharma', email: 'neha.s@medhavi.edu', course: 'B.Tech CSE', year: 1, joinedDate: '2024-08-10' },
    { id: 'o6', name: 'Pooja Reddy', email: 'pooja.r@medhavi.edu', course: 'B.Tech IT', year: 1, joinedDate: '2024-08-10' },
  ],
  '9': [
    { id: 'o7', name: 'Karthik Rajan', email: 'karthik.r@medhavi.edu', course: 'B.Tech EE', year: 2, joinedDate: '2023-08-15' },
  ],
};

export function RoomAllocationModal({
  open,
  onOpenChange,
  room,
  onAllocate,
  onDeallocate,
}: RoomAllocationModalProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isAllocating, setIsAllocating] = useState(false);

  if (!room) return null;

  const availableSlots = room.capacity - room.occupied;
  const currentOccupants = mockOccupants[room.id] || [];

  const filteredStudents = mockUnassignedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else if (selectedStudents.length < availableSlots) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      toast({
        title: 'Selection Limit Reached',
        description: `You can only select ${availableSlots} student(s) for this room.`,
        variant: 'destructive',
      });
    }
  };

  const handleAllocate = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: 'No Students Selected',
        description: 'Please select at least one student to allocate.',
        variant: 'destructive',
      });
      return;
    }

    setIsAllocating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onAllocate(room.id, selectedStudents);
    setIsAllocating(false);
    setSelectedStudents([]);
    toast({
      title: 'Students Allocated',
      description: `${selectedStudents.length} student(s) have been assigned to Room ${room.roomNumber}.`,
    });
    onOpenChange(false);
  };

  const handleDeallocate = async (studentId: string, studentName: string) => {
    onDeallocate(room.id, studentId);
    toast({
      title: 'Student Removed',
      description: `${studentName} has been removed from Room ${room.roomNumber}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BedDouble className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span>Room {room.roomNumber} Allocation</span>
              <p className="text-sm font-normal text-muted-foreground">
                Floor {room.floor} • {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {room.occupied} / {room.capacity} occupied
            </Badge>
            {availableSlots > 0 && (
              <Badge className="bg-success/10 text-success border-success/20">
                {availableSlots} slot{availableSlots > 1 ? 's' : ''} available
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="allocate" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="allocate" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Allocate Students
            </TabsTrigger>
            <TabsTrigger value="current" className="gap-2">
              <Users className="h-4 w-4" />
              Current Occupants ({currentOccupants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allocate" className="flex-1 flex flex-col min-h-0 mt-4">
            {availableSlots === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h3 className="font-medium text-foreground">Room is Full</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remove existing occupants to allocate new students.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name, email, or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Selected count */}
                {selectedStudents.length > 0 && (
                  <div className="flex items-center justify-between mb-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">
                      {selectedStudents.length} of {availableSlots} slot(s) selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudents([])}
                    >
                      Clear All
                    </Button>
                  </div>
                )}

                {/* Student List */}
                <ScrollArea className="flex-1 min-h-[250px]">
                  <div className="space-y-2 pr-4">
                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No unassigned students found
                      </div>
                    ) : (
                      filteredStudents.map((student) => {
                        const isSelected = selectedStudents.includes(student.id);
                        return (
                          <div
                            key={student.id}
                            onClick={() => toggleStudentSelection(student.id)}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            )}
                          >
                            <div className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground/30'
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {student.name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {student.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Year {student.year}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {student.course}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>

                {/* Allocate Button */}
                <div className="pt-4 border-t mt-4">
                  <Button
                    onClick={handleAllocate}
                    disabled={selectedStudents.length === 0 || isAllocating}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isAllocating
                      ? 'Allocating...'
                      : `Allocate ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="current" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-[350px]">
              {currentOccupants.length === 0 ? (
                <div className="flex items-center justify-center text-center h-full p-8">
                  <div>
                    <BedDouble className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium text-foreground">No Occupants</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This room is currently empty.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {currentOccupants.map((occupant) => (
                    <div
                      key={occupant.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {occupant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {occupant.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {occupant.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          Year {occupant.year}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Since {new Date(occupant.joinedDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeallocate(occupant.id, occupant.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  IndianRupee,
  Calendar,
  TrendingUp,
  Receipt,
  FileText,
  Search,
  Eye,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Settings,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { RecordPaymentModal } from '@/components/fees/RecordPaymentModal';
import { PaymentReceiptModal } from '@/components/fees/PaymentReceiptModal';
import { SendReminderModal } from '@/components/fees/SendReminderModal';
import { PaymentDetailsModal } from '@/components/fees/PaymentDetailsModal';
import { StudentPaymentModal } from '@/components/fees/StudentPaymentModal';
import { EditFeeStructureModal } from '@/components/fees/EditFeeStructureModal';
import { DeleteFeeModal } from '@/components/fees/DeleteFeeModal';
import { FeeHistoryModal, FeeHistoryEntry } from '@/components/fees/FeeHistoryModal';
import { useToast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  semester: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  transactionId?: string;
  paymentMethod?: string;
}

const initialFeeStructure: FeeStructure[] = [
  { id: '1', category: 'Room Rent', amount: 25000, description: 'Per semester accommodation charges' },
  { id: '2', category: 'Mess Charges', amount: 18000, description: 'Food and dining per semester' },
  { id: '3', category: 'Maintenance', amount: 3000, description: 'Building and facility maintenance' },
  { id: '4', category: 'Electricity', amount: 2000, description: 'Electricity charges (avg. estimate)' },
  { id: '5', category: 'Internet & WiFi', amount: 1500, description: 'High-speed internet access' },
  { id: '6', category: 'Laundry', amount: 1000, description: 'Laundry service charges' },
  { id: '7', category: 'Security Deposit', amount: 5000, description: 'Refundable security deposit (one-time)' },
];

const initialPaymentHistory: PaymentRecord[] = [
  { id: '1', studentId: 's1', studentName: 'Rahul Sharma', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-10', status: 'paid', transactionId: 'TXN001234567', paymentMethod: 'UPI' },
  { id: '2', studentId: 's2', studentName: 'Priya Singh', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-14', status: 'paid', transactionId: 'TXN001234568', paymentMethod: 'Net Banking' },
  { id: '3', studentId: 's3', studentName: 'Amit Kumar', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', status: 'pending' },
  { id: '4', studentId: 's4', studentName: 'Sneha Patel', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-12', status: 'paid', transactionId: 'TXN001234569', paymentMethod: 'Card' },
  { id: '5', studentId: 's5', studentName: 'Vikash Gupta', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', status: 'overdue' },
  { id: '6', studentId: 's6', studentName: 'Neha Agarwal', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-15', status: 'paid', transactionId: 'TXN001234570', paymentMethod: 'UPI' },
  { id: '7', studentId: 's7', studentName: 'Ravi Verma', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', status: 'pending' },
  { id: '8', studentId: 's8', studentName: 'Kavita Sharma', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', status: 'overdue' },
  { id: '9', studentId: 's9', studentName: 'Arjun Reddy', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-11', status: 'paid', transactionId: 'TXN001234571', paymentMethod: 'UPI' },
  { id: '10', studentId: 's10', studentName: 'Meera Joshi', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', status: 'pending' },
];

// Student's own payment history
const initialMyPayments: PaymentRecord[] = [
  { id: '1', studentId: 's1', studentName: 'Priya Singh', semester: 'Even 2024-25', amount: 50500, dueDate: '2025-01-15', status: 'pending' },
  { id: '2', studentId: 's1', studentName: 'Priya Singh', semester: 'Odd 2024-25', amount: 50500, dueDate: '2024-08-15', paidDate: '2024-08-10', status: 'paid', transactionId: 'TXN001234567', paymentMethod: 'UPI' },
  { id: '3', studentId: 's1', studentName: 'Priya Singh', semester: 'Even 2023-24', amount: 48000, dueDate: '2024-01-15', paidDate: '2024-01-12', status: 'paid', transactionId: 'TXN001234123', paymentMethod: 'Net Banking' },
  { id: '4', studentId: 's1', studentName: 'Priya Singh', semester: 'Odd 2023-24', amount: 48000, dueDate: '2023-08-15', paidDate: '2023-08-14', status: 'paid', transactionId: 'TXN001233456', paymentMethod: 'Card' },
];

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
};

const ITEMS_PER_PAGE = 8;

export default function Fees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Payment data state
  const [paymentHistory, setPaymentHistory] = useState(initialPaymentHistory);
  const [myPayments, setMyPayments] = useState(initialMyPayments);
  const [feeStructure, setFeeStructure] = useState(initialFeeStructure);

  // Modal states
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStudentPayModal, setShowStudentPayModal] = useState(false);

  // Fee structure modal states
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null);
  const [showEditFeeModal, setShowEditFeeModal] = useState(false);
  const [showDeleteFeeModal, setShowDeleteFeeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isNewFee, setIsNewFee] = useState(false);

  // Fee history log
  const [feeHistory, setFeeHistory] = useState<FeeHistoryEntry[]>([]);

  const isStudent = user?.role === 'student';
  const payments = isStudent ? myPayments : paymentHistory;

  const filteredPayments = payments.filter((payment) => {
    const matchesSemester = semesterFilter === 'all' || payment.semester === semesterFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSemester && matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalFee = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);
  
  const stats = {
    totalCollected: paymentHistory.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPending: paymentHistory.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalOverdue: paymentHistory.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    paidCount: paymentHistory.filter(p => p.status === 'paid').length,
    pendingCount: paymentHistory.filter(p => p.status === 'pending').length,
    overdueCount: paymentHistory.filter(p => p.status === 'overdue').length,
  };

  const collectionRate = Math.round((stats.paidCount / paymentHistory.length) * 100);

  // Get current due for student
  const currentDue = myPayments.find(p => p.status === 'pending' || p.status === 'overdue');

  // Handlers
  const handleViewDetails = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRecordPayment = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowRecordModal(true);
  };

  const handleViewReceipt = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleSendReminder = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowReminderModal(true);
  };

  const handleStudentPay = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowStudentPayModal(true);
  };

  const handleRecordSubmit = (data: { paymentId: string; transactionId: string; paymentMethod: string; paidAmount: number; paidDate: string }) => {
    setPaymentHistory(prev => prev.map(p => 
      p.id === data.paymentId 
        ? { ...p, status: 'paid' as const, paidDate: data.paidDate, transactionId: data.transactionId, paymentMethod: data.paymentMethod }
        : p
    ));
  };

  const handleReminderSend = (data: { paymentId: string; channels: string[]; message: string }) => {
    console.log('Reminder sent:', data);
  };

  const handleStudentPaySuccess = (transactionId: string, paymentMethod: string) => {
    if (selectedPayment) {
      setMyPayments(prev => prev.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0], transactionId, paymentMethod }
          : p
      ));
    }
  };

  const handleExportReport = () => {
    toast({
      title: 'Exporting Report',
      description: 'Your fee report is being generated...',
    });
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Report has been downloaded successfully.',
      });
    }, 1000);
  };

  // Fee structure handlers
  const handleAddFee = () => {
    setSelectedFee(null);
    setIsNewFee(true);
    setShowEditFeeModal(true);
  };

  const handleEditFee = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setIsNewFee(false);
    setShowEditFeeModal(true);
  };

  const handleDeleteFee = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setShowDeleteFeeModal(true);
  };

  const handleSaveFee = (updatedFee: FeeStructure) => {
    const historyEntry: FeeHistoryEntry = {
      id: `history-${Date.now()}`,
      action: isNewFee ? 'added' : 'edited',
      category: updatedFee.category,
      newAmount: updatedFee.amount,
      changedBy: user?.name || 'Admin',
      changedAt: new Date().toISOString(),
    };

    if (isNewFee) {
      setFeeStructure(prev => [...prev, updatedFee]);
    } else {
      const oldFee = feeStructure.find(f => f.id === updatedFee.id);
      if (oldFee) {
        historyEntry.previousAmount = oldFee.amount;
        if (oldFee.category !== updatedFee.category) {
          historyEntry.details = `Category renamed from "${oldFee.category}"`;
        }
      }
      setFeeStructure(prev => prev.map(f => f.id === updatedFee.id ? updatedFee : f));
    }

    setFeeHistory(prev => [historyEntry, ...prev]);
  };

  const handleConfirmDeleteFee = (feeId: string) => {
    const deletedFee = feeStructure.find(f => f.id === feeId);
    if (deletedFee) {
      const historyEntry: FeeHistoryEntry = {
        id: `history-${Date.now()}`,
        action: 'deleted',
        category: deletedFee.category,
        previousAmount: deletedFee.amount,
        changedBy: user?.name || 'Admin',
        changedAt: new Date().toISOString(),
      };
      setFeeHistory(prev => [historyEntry, ...prev]);
    }
    setFeeStructure(prev => prev.filter(f => f.id !== feeId));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <DashboardLayout 
      title="Fee Management" 
      subtitle={isStudent ? "View your fee details and payment history" : "Track and manage hostel fee collections"}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        {!isStudent && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2.5">
                    <IndianRupee className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Collected</p>
                    <p className="text-xl font-bold text-success">₹{stats.totalCollected.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2.5">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Amount</p>
                    <p className="text-xl font-bold text-warning">₹{stats.totalPending.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2.5">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Overdue Amount</p>
                    <p className="text-xl font-bold text-destructive">₹{stats.totalOverdue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Collection Rate</p>
                    <p className="text-xl font-bold text-primary">{collectionRate}%</p>
                  </div>
                </div>
                <Progress value={collectionRate} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student's Current Due Card */}
        {isStudent && (
          <Card className={cn(
            "shadow-card",
            currentDue 
              ? "border-warning/20 bg-gradient-to-r from-warning/5 to-transparent" 
              : "border-success/20 bg-gradient-to-r from-success/5 to-transparent"
          )}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "rounded-xl p-4",
                    currentDue ? "bg-warning/10" : "bg-success/10"
                  )}>
                    <Receipt className={cn("h-8 w-8", currentDue ? "text-warning" : "text-success")} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Semester Due</p>
                    <p className="text-3xl font-bold text-card-foreground">
                      {currentDue ? `₹${currentDue.amount.toLocaleString()}` : '₹0'}
                    </p>
                    {currentDue ? (
                      <p className="text-sm text-warning flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(currentDue.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    ) : (
                      <p className="text-sm text-success flex items-center gap-1 mt-1">
                        <CheckCircle className="h-4 w-4" />
                        All fees paid for current semester
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentDue ? (
                    <Button variant="hero" onClick={() => handleStudentPay(currentDue)}>
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => myPayments[1] && handleViewReceipt(myPayments[1])}>
                      <Download className="h-4 w-4" />
                      Download Latest Receipt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments" className="gap-2">
              <Receipt className="h-4 w-4" />
              {isStudent ? 'My Payments' : 'Payment Records'}
            </TabsTrigger>
            <TabsTrigger value="structure" className="gap-2">
              <FileText className="h-4 w-4" />
              Fee Structure
            </TabsTrigger>
            {!isStudent && (
              <TabsTrigger value="overdue" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue Alerts
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                  {stats.overdueCount}
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {!isStudent && (
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or transaction ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              )}
              <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-44">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="Even 2024-25">Even 2024-25</SelectItem>
                  <SelectItem value="Odd 2024-25">Odd 2024-25</SelectItem>
                  <SelectItem value="Even 2023-24">Even 2023-24</SelectItem>
                  <SelectItem value="Odd 2023-24">Odd 2023-24</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              {!isStudent && (
                <Button variant="outline" className="ml-auto" onClick={handleExportReport}>
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              )}
            </div>

            {/* Payments Table */}
            <Card className="shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {!isStudent && <TableHead>Student</TableHead>}
                    <TableHead>Semester</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isStudent ? 7 : 8} className="text-center py-8 text-muted-foreground">
                        No payment records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPayments.map((payment) => {
                      const StatusIcon = statusConfig[payment.status].icon;
                      return (
                        <TableRow key={payment.id} className="hover:bg-muted/50">
                          {!isStudent && <TableCell className="font-medium">{payment.studentName}</TableCell>}
                          <TableCell>{payment.semester}</TableCell>
                          <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {payment.paidDate 
                              ? new Date(payment.paidDate).toLocaleDateString() 
                              : <span className="text-muted-foreground">-</span>
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('gap-1', statusConfig[payment.status].color)}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[payment.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {payment.transactionId || <span className="text-muted-foreground">-</span>}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(payment)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.status === 'paid' ? (
                                <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(payment)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              ) : isStudent ? (
                                <Button variant="default" size="sm" onClick={() => handleStudentPay(payment)}>
                                  <CreditCard className="h-4 w-4" />
                                  Pay
                                </Button>
                              ) : (
                                <>
                                  <Button variant="ghost" size="sm" onClick={() => handleSendReminder(payment)}>
                                    <Bell className="h-4 w-4" />
                                  </Button>
                                  <Button variant="default" size="sm" onClick={() => handleRecordPayment(payment)}>
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length} records
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Fee Structure Tab */}
          <TabsContent value="structure" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Semester Fee Structure (2024-25)
                </CardTitle>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowHistoryModal(true)}
                      className="gap-1"
                    >
                      <History className="h-4 w-4" />
                      History
                      {feeHistory.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                          {feeHistory.length}
                        </Badge>
                      )}
                    </Button>
                    <Button onClick={handleAddFee} size="sm">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                      {isAdmin && <TableHead className="text-right w-[100px]">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((fee) => (
                      <TableRow key={fee.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{fee.category}</TableCell>
                        <TableCell className="text-muted-foreground">{fee.description}</TableCell>
                        <TableCell className="text-right font-semibold">₹{fee.amount.toLocaleString()}</TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditFee(fee)}
                                title="Edit category"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteFee(fee)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    <TableRow className="bg-primary/5 hover:bg-primary/10 font-bold">
                      <TableCell colSpan={isAdmin ? 2 : 2}>Total Per Semester</TableCell>
                      <TableCell className="text-right text-primary text-lg">₹{totalFee.toLocaleString()}</TableCell>
                      {isAdmin && <TableCell />}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Payment Methods Accepted</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    UPI (Google Pay, PhonePe, Paytm)
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Net Banking (All major banks)
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Credit/Debit Cards
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Bank Transfer (NEFT/RTGS)
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Fee must be paid within 15 days of semester start</p>
                  <p>• Late payment penalty: ₹100/day after due date</p>
                  <p>• Security deposit refunded after checkout</p>
                  <p>• Contact accounts office for fee-related queries</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Overdue Alerts Tab */}
          {!isStudent && (
            <TabsContent value="overdue" className="space-y-4">
              {paymentHistory.filter(p => p.status === 'overdue').length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="font-semibold text-lg">No Overdue Payments</h3>
                    <p className="text-muted-foreground">All students have paid their fees on time!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {paymentHistory.filter(p => p.status === 'overdue').map((payment) => {
                    const daysOverdue = Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    const lateFee = daysOverdue * 100;
                    return (
                      <Card key={payment.id} className="shadow-card border-destructive/20">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-lg bg-destructive/10 p-3">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{payment.studentName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {payment.semester} • Due: {new Date(payment.dueDate).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-lg font-bold text-destructive">
                                    ₹{payment.amount.toLocaleString()}
                                  </p>
                                  <Badge variant="destructive" className="text-xs">
                                    {daysOverdue} days overdue
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Late fee: ₹{lateFee.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleSendReminder(payment)}>
                                <Bell className="h-4 w-4" />
                                Send Reminder
                              </Button>
                              <Button variant="default" size="sm" onClick={() => handleRecordPayment(payment)}>
                                <CreditCard className="h-4 w-4" />
                                Record Payment
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Modals */}
      <PaymentDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        payment={selectedPayment}
        isStudent={isStudent}
        onRecordPayment={() => {
          setShowDetailsModal(false);
          if (isStudent) {
            setShowStudentPayModal(true);
          } else {
            setShowRecordModal(true);
          }
        }}
        onSendReminder={() => {
          setShowDetailsModal(false);
          setShowReminderModal(true);
        }}
        onViewReceipt={() => {
          setShowDetailsModal(false);
          setShowReceiptModal(true);
        }}
      />

      <RecordPaymentModal
        open={showRecordModal}
        onOpenChange={setShowRecordModal}
        payment={selectedPayment}
        onSubmit={handleRecordSubmit}
      />

      <PaymentReceiptModal
        open={showReceiptModal}
        onOpenChange={setShowReceiptModal}
        payment={selectedPayment}
      />

      <SendReminderModal
        open={showReminderModal}
        onOpenChange={setShowReminderModal}
        payment={selectedPayment}
        onSend={handleReminderSend}
      />

      <StudentPaymentModal
        open={showStudentPayModal}
        onOpenChange={setShowStudentPayModal}
        payment={selectedPayment}
        onSuccess={handleStudentPaySuccess}
      />

      {/* Fee Structure Modals */}
      <EditFeeStructureModal
        open={showEditFeeModal}
        onOpenChange={setShowEditFeeModal}
        fee={selectedFee}
        onSave={handleSaveFee}
        isNew={isNewFee}
      />

      <DeleteFeeModal
        open={showDeleteFeeModal}
        onOpenChange={setShowDeleteFeeModal}
        fee={selectedFee}
        onConfirm={handleConfirmDeleteFee}
      />

      <FeeHistoryModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        history={feeHistory}
      />
    </DashboardLayout>
  );
}

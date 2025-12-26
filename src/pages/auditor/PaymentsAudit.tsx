import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services';
import { Payment } from '@/types';
import { Search, Download, Filter, Loader2, CheckCircle2, XCircle, Clock, ArrowUpRight, CreditCard } from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUCCESS': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Success</Badge>;
    case 'PENDING': return <Badge className="badge-warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case 'FAILED': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    case 'REFUNDED': return <Badge className="badge-info"><ArrowUpRight className="h-3 w-3 mr-1" />Refunded</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const PaymentsAudit: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.listPayments();
      if (response.success && response.data) {
        const paymentsData = (response.data as any).payments || response.data || [];
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({ title: 'Error', description: 'Failed to fetch payments', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Transaction ID', 'Amount', 'Method', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => [
        p.transaction_id || `PAY-${p.id.slice(0, 8)}`,
        p.amount,
        p.payment_method || 'N/A',
        p.status,
        new Date(p.created_at).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({ title: 'Exported', description: 'Payment audit report downloaded' });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) || payment.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCompleted = payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalRefunded = payments.filter(p => p.status === 'REFUNDED').reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments Audit</h1>
          <p className="text-muted-foreground">Detailed payment transactions audit log</p>
        </div>
        <Button className="btn-gradient" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />Export Audit Log
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{payments.length}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-success">₹{totalCompleted.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Refunded</p>
            <p className="text-2xl font-bold text-destructive">₹{totalRefunded.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-muted/50" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-muted/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments found</TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.transaction_id || `PAY-${payment.id}`}</p>
                          <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{Number(payment.amount).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{payment.payment_method || 'N/A'}</Badge></TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(payment.paid_at || payment.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.refund_reason || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsAudit;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services';
import { Payment } from '@/types';
import { Wallet, CreditCard, Loader2, CheckCircle2, XCircle, Clock, ArrowDownRight, ArrowUpRight, Download, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import jsPDF from 'jspdf';



const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUCCESS': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Success</Badge>;
    case 'PENDING': return <Badge className="badge-warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case 'FAILED': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    case 'REFUNDED': return <Badge className="badge-info"><ArrowUpRight className="h-3 w-3 mr-1" />Refunded</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const paymentMethodLabels: Record<string, string> = {
  CARD: 'Card Payment',
  UPI: 'UPI Payment',
  NETBANKING: 'Net Banking',
  WALLET: 'Wallet',
};

const PaymentHistory: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getMyPaymentHistory();
      if (response.success && response.data) {
        // Extract payments array from nested response structure
        const paymentsData = (response.data as any).payments || response.data || [];
        if (Array.isArray(paymentsData)) {
          setPayments(paymentsData);
        } else {
          setPayments([]);
        }
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // Generate PDF receipt
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('RTO Management System', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Payment Receipt', 105, 25, { align: 'center' });
    doc.text('Regional Transport Office', 105, 32, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    let yPos = 50;
    
    // Payment Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT DETAILS', 20, yPos);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(`RTO-${payment.id.slice(0, 8).toUpperCase()}`, 120, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Date:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text((payment.paid_at ? new Date(payment.paid_at) : new Date(payment.created_at)).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), 120, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Time:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text((payment.paid_at ? new Date(payment.paid_at) : new Date(payment.created_at)).toLocaleTimeString('en-IN'), 120, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction ID:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(payment.transaction_id || `TXN-${payment.id.slice(0, 12)}`, 120, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Method:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(payment.payment_method || 'UPI', 120, yPos);
    yPos += 15;
    
    // Transaction Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION INFORMATION', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment ID:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(payment.id, 120, yPos);
    doc.setFontSize(10);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Type:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(payment.challan_id ? 'Challan Payment' : 'Service Fee', 120, yPos);
    yPos += 7;
    
    if (payment.challan_id) {
      doc.setFont('helvetica', 'normal');
      doc.text(`Challan ID:`, 20, yPos);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(payment.challan_id, 120, yPos);
      doc.setFontSize(10);
      yPos += 7;
    }
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Status:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(payment.status, 120, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    
    // Amount Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AMOUNT PAID', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction Amount:`, 20, yPos);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`₹${Number(payment.amount).toLocaleString('en-IN')}`, 120, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction Status:`, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('✓ ' + payment.status, 120, yPos);
    
    // Stamp
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    yPos += 20;
    doc.text('*** This is a computer-generated receipt ***', 105, yPos, { align: 'center' });
    doc.text('Digital Signature Applied', 105, yPos + 5, { align: 'center' });
    
    // Footer
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Regional Transport Office - Government Initiative', 105, 278, { align: 'center' });
    doc.text('For queries, contact: support@rto.gov.in | Helpline: 1800-XXX-XXXX', 105, 283, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 288, { align: 'center' });
    
    // Save PDF
    doc.save(`RTO_Payment_Receipt_${payment.id.slice(0, 8)}_${Date.now()}.pdf`);

    toast({ title: 'Receipt Downloaded', description: 'Your payment receipt has been downloaded as PDF' });
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsDialog(true);
  };

  const totalPaid = payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View your payment history and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success to-accent flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-16 text-center">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
            <p className="text-muted-foreground">You haven't made any payments yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment, index) => (
            <motion.div key={payment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="glass-card-hover">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${payment.status === 'SUCCESS' ? 'bg-success/20 text-success' : payment.status === 'PENDING' ? 'bg-warning/20 text-warning' : payment.status === 'REFUNDED' ? 'bg-info/20 text-info' : 'bg-destructive/20 text-destructive'}`}>
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{payment.challan_id ? 'Challan Payment' : 'Service Fee'}</p>
                        <p className="text-sm text-muted-foreground">{payment.payment_method || 'N/A'} • {new Date(payment.created_at).toLocaleDateString()}</p>
                        {payment.transaction_id && <p className="text-xs text-muted-foreground">TXN: {payment.transaction_id}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{Number(payment.amount).toLocaleString()}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                      {payment.status === 'SUCCESS' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(payment)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadReceipt(payment)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Details Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Payment Details</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Receipt Number</span>
                    <span className="font-mono font-semibold">RTO-{selectedPayment.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Date</span>
                    <span className="font-semibold">{(selectedPayment.paid_at ? new Date(selectedPayment.paid_at) : new Date(selectedPayment.created_at)).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Time</span>
                    <span className="font-semibold">{(selectedPayment.paid_at ? new Date(selectedPayment.paid_at) : new Date(selectedPayment.created_at)).toLocaleTimeString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-sm">{selectedPayment.transaction_id || `TXN-${selectedPayment.id.slice(0, 12)}`}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <Badge variant="outline">{selectedPayment.payment_method || 'UPI'}</Badge>
                  </div>
                </div>
              </div>

              {/* Transaction Information Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Transaction Information</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-xs">{selectedPayment.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Type</span>
                    <span className="font-semibold">{selectedPayment.challan_id ? 'Challan Payment' : 'Service Fee'}</span>
                  </div>
                  {selectedPayment.challan_id && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Challan ID</span>
                      <span className="font-mono text-xs">{selectedPayment.challan_id}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
              </div>

              {/* Amount Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Amount Paid</h3>
                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 text-center">
                  <p className="text-3xl font-bold text-success">₹{Number(selectedPayment.amount).toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground mt-2">Transaction completed successfully</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button className="flex-1" onClick={() => {
                  handleDownloadReceipt(selectedPayment);
                  setShowDetailsDialog(false);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;

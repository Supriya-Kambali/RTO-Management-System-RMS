import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { challanService } from '@/services';
import { Challan } from '@/types';
import { AlertTriangle, Search, Filter, Loader2, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';

const violationLabels: Record<string, string> = {
  OVER_SPEEDING: 'Over Speeding', SIGNAL_JUMP: 'Signal Jump', NO_HELMET: 'No Helmet',
  NO_SEATBELT: 'No Seatbelt', DRUNK_DRIVING: 'Drunk Driving', WRONG_PARKING: 'Wrong Parking',
  NO_LICENSE: 'No License', NO_INSURANCE: 'No Insurance', OTHER: 'Other',
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PAID': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
    case 'UNPAID': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Unpaid</Badge>;
    case 'DISPUTED': return <Badge className="badge-warning"><Clock className="h-3 w-3 mr-1" />Disputed</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const ChallanList: React.FC = () => {
  const { toast } = useToast();
  const [challans, setChallans] = useState<Challan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const response = await challanService.listChallans();
      if (response.success) setChallans(response.data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load challans', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChallans = challans.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.violation_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">All Challans</h1>
        <p className="text-muted-foreground">View and manage issued challans</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search challans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted/50" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-muted/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="DISPUTED">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card"><CardContent className="py-4 text-center"><p className="text-2xl font-bold">{challans.length}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="py-4 text-center"><p className="text-2xl font-bold text-destructive">{challans.filter(c => c.status === 'UNPAID').length}</p><p className="text-xs text-muted-foreground">Unpaid</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="py-4 text-center"><p className="text-2xl font-bold text-success">{challans.filter(c => c.status === 'PAID').length}</p><p className="text-xs text-muted-foreground">Paid</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="py-4 text-center"><p className="text-2xl font-bold text-warning">{challans.filter(c => c.status === 'DISPUTED').length}</p><p className="text-xs text-muted-foreground">Disputed</p></CardContent></Card>
      </div>

      {/* Challans Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Challan ID</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Violation</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallans.map((challan, i) => (
                <motion.tr key={challan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4"><span className="font-mono text-sm">{challan.id.slice(0, 8)}...</span></td>
                  <td className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" />{violationLabels[challan.violation_type]}</div></td>
                  <td className="p-4 font-semibold">₹{challan.amount.toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground">{new Date(challan.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{getStatusBadge(challan.status)}</td>
                  <td className="p-4 text-right"><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ChallanList;

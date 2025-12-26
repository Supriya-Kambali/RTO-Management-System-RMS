import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { dlService } from '@/services';
import { DLApplication } from '@/types';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Search, Calendar, Car, FileText, Award, Loader2 } from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PASSED': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Passed</Badge>;
    case 'FAILED': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    case 'SCHEDULED': return <Badge className="badge-info"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
    case 'ABSENT': return <Badge className="badge-warning"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const TestResults: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<DLApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTest, setSelectedTest] = useState<DLApplication | null>(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [testScore, setTestScore] = useState('');
  const [testRemarks, setTestRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await dlService.listApplications();
      const data = (response.data as any).applications || response.data || [];
      const testScheduled = Array.isArray(data) ? data.filter((app: DLApplication) => 
        app.status === 'TEST_SCHEDULED' || app.status === 'TEST_PASSED' || app.status === 'TEST_FAILED'
      ) : [];
      setApplications(testScheduled);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({ title: 'Error', description: 'Failed to fetch test results', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordResult = async (result: 'PASS' | 'FAIL' | 'ABSENT') => {
    if (!selectedTest) return;
    
    setIsSubmitting(true);
    try {
      await dlService.submitTestResult(selectedTest.id, result, parseInt(testScore), testRemarks);
      toast({
        title: 'Success',
        description: `Test result recorded successfully`,
      });
      setRecordDialogOpen(false);
      setSelectedTest(null);
      setTestScore('');
      setTestRemarks('');
      fetchApplications();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to record result', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusFromApp = (status: string) => {
    if (status === 'TEST_PASSED') return 'PASSED';
    if (status === 'TEST_FAILED') return 'FAILED';
    if (status === 'TEST_SCHEDULED') return 'SCHEDULED';
    return status;
  };

  const filteredResults = applications.filter(app => {
    const appStatus = getStatusFromApp(app.status);
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || appStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const scheduledCount = applications.filter(a => a.status === 'TEST_SCHEDULED').length;
  const passedCount = applications.filter(a => a.status === 'TEST_PASSED').length;
  const failedCount = applications.filter(a => a.status === 'TEST_FAILED').length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Test Results</h1>
        <p className="text-muted-foreground">Manage driving test results and schedules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-info">{scheduledCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-success">{passedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">{failedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'SCHEDULED', 'PASSED', 'FAILED', 'ABSENT'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Test Records</CardTitle>
          <CardDescription>View and manage driving test results</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">No test results match your search criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((app, index) => {
                const appStatus = getStatusFromApp(app.status);
                return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${appStatus === 'PASSED' ? 'bg-success/20 text-success' : appStatus === 'FAILED' ? 'bg-destructive/20 text-destructive' : 'bg-info/20 text-info'}`}>
                        <Car className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Application {app.id.slice(0, 8)}</p>
                          <Badge variant="outline">{app.license_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          User: {app.user_id.slice(0, 8)}...
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {app.test_scheduled_date ? new Date(app.test_scheduled_date).toLocaleDateString() : 'Not scheduled'}
                          {app.test_result && (
                            <>
                              <span>•</span>
                              Result: {app.test_result}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(appStatus)}
                      {app.status === 'TEST_SCHEDULED' && (
                        <Dialog open={recordDialogOpen && selectedTest?.id === app.id} onOpenChange={(open) => {
                          setRecordDialogOpen(open);
                          if (open) setSelectedTest(app);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm">Record Result</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Record Test Result</DialogTitle>
                              <DialogDescription>
                                Record the result for Application {app.id.slice(0, 12)}...
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Score (0-100)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={testScore}
                                  onChange={(e) => setTestScore(e.target.value)}
                                  placeholder="Enter score"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Remarks</label>
                                <Textarea
                                  value={testRemarks}
                                  onChange={(e) => setTestRemarks(e.target.value)}
                                  placeholder="Enter any remarks or observations"
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                              <Button variant="outline" onClick={() => handleRecordResult('ABSENT')} disabled={isSubmitting}>
                                <XCircle className="h-4 w-4 mr-2" />Mark Absent
                              </Button>
                              <Button variant="destructive" onClick={() => handleRecordResult('FAIL')} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                Mark Failed
                              </Button>
                              <Button onClick={() => handleRecordResult('PASS')} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Mark Passed
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;

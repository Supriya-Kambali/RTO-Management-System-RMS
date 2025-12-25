import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Search, User, Calendar, Car, Info, FileText, Award } from 'lucide-react';

interface TestResult {
  id: string;
  applicant_name: string;
  application_id: string;
  license_type: string;
  test_date: string;
  test_type: 'WRITTEN' | 'PRACTICAL';
  status: 'SCHEDULED' | 'PASSED' | 'FAILED' | 'ABSENT';
  score?: number;
  remarks?: string;
  examiner?: string;
}

const mockTestResults: TestResult[] = [
  { id: '1', applicant_name: 'Rahul Sharma', application_id: 'DL2024001', license_type: 'LMV', test_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'PRACTICAL', status: 'SCHEDULED' },
  { id: '2', applicant_name: 'Priya Patel', application_id: 'DL2024002', license_type: 'MCWG', test_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'PRACTICAL', status: 'PASSED', score: 85, remarks: 'Good driving skills', examiner: 'Officer Deshmukh' },
  { id: '3', applicant_name: 'Amit Kumar', application_id: 'DL2024003', license_type: 'LMV', test_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'WRITTEN', status: 'PASSED', score: 92, remarks: 'Excellent knowledge', examiner: 'Officer Singh' },
  { id: '4', applicant_name: 'Sneha Reddy', application_id: 'DL2024004', license_type: 'HMV', test_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'PRACTICAL', status: 'FAILED', score: 45, remarks: 'Poor lane discipline, needs more practice', examiner: 'Officer Joshi' },
  { id: '5', applicant_name: 'Vikram Singh', application_id: 'DL2024005', license_type: 'MCWG', test_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'PRACTICAL', status: 'ABSENT', remarks: 'Did not appear for test' },
  { id: '6', applicant_name: 'Ananya Gupta', application_id: 'DL2024006', license_type: 'LMV', test_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), test_type: 'WRITTEN', status: 'SCHEDULED' },
];

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
  const [results, setResults] = useState<TestResult[]>(mockTestResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [testScore, setTestScore] = useState('');
  const [testRemarks, setTestRemarks] = useState('');

  const filteredResults = results.filter(result => {
    const matchesSearch = result.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.application_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRecordResult = (result: 'PASSED' | 'FAILED') => {
    if (!selectedTest) return;
    
    setResults(prev => prev.map(r => 
      r.id === selectedTest.id 
        ? { ...r, status: result, score: parseInt(testScore) || undefined, remarks: testRemarks, examiner: 'Current Officer' }
        : r
    ));
    
    toast({
      title: 'Result Recorded',
      description: `Test result for ${selectedTest.applicant_name} marked as ${result}`,
    });
    
    setRecordDialogOpen(false);
    setSelectedTest(null);
    setTestScore('');
    setTestRemarks('');
  };

  const scheduledCount = results.filter(r => r.status === 'SCHEDULED').length;
  const passedCount = results.filter(r => r.status === 'PASSED').length;
  const failedCount = results.filter(r => r.status === 'FAILED').length;

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-sm text-primary">Demo Mode: Displaying sample test results</span>
      </div>

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
                <p className="text-2xl font-bold">{results.length}</p>
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
              {filteredResults.map((result, index) => (
                <motion.div key={result.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${result.status === 'PASSED' ? 'bg-success/20 text-success' : result.status === 'FAILED' ? 'bg-destructive/20 text-destructive' : result.status === 'SCHEDULED' ? 'bg-info/20 text-info' : 'bg-warning/20 text-warning'}`}>
                        {result.test_type === 'WRITTEN' ? <FileText className="h-6 w-6" /> : <Car className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{result.applicant_name}</p>
                          <Badge variant="outline">{result.license_type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.application_id} • {result.test_type === 'WRITTEN' ? 'Written Test' : 'Practical Test'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.test_date).toLocaleDateString()}
                          {result.score !== undefined && (
                            <>
                              <span>•</span>
                              <Award className="h-3 w-3" />
                              Score: {result.score}/100
                            </>
                          )}
                        </div>
                        {result.remarks && <p className="text-xs text-muted-foreground mt-1 italic">{result.remarks}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(result.status)}
                      {result.status === 'SCHEDULED' && (
                        <Dialog open={recordDialogOpen && selectedTest?.id === result.id} onOpenChange={(open) => {
                          setRecordDialogOpen(open);
                          if (open) setSelectedTest(result);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm">Record Result</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Record Test Result</DialogTitle>
                              <DialogDescription>
                                Record the result for {result.applicant_name}'s {result.test_type.toLowerCase()} test
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
                              <Button variant="destructive" onClick={() => handleRecordResult('FAILED')}>
                                <XCircle className="h-4 w-4 mr-2" />Mark Failed
                              </Button>
                              <Button onClick={() => handleRecordResult('PASSED')}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />Mark Passed
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;

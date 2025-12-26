import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyticsService, challanService } from '@/services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const violationLabels: Record<string, string> = {
  OVER_SPEEDING: 'Over Speeding',
  SIGNAL_JUMP: 'Signal Jump',
  NO_HELMET: 'No Helmet',
  NO_SEATBELT: 'No Seatbelt',
  DRUNK_DRIVING: 'Drunk Driving',
  WRONG_PARKING: 'Wrong Parking',
  NO_LICENSE: 'No License',
  NO_INSURANCE: 'No Insurance',
  OTHER: 'Other',
};

const PoliceAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [violationsByType, setViolationsByType] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [totalViolations, setTotalViolations] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [topViolation, setTopViolation] = useState({ type: '', count: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all challans to compute analytics
      const response = await challanService.listChallans();
      const challans = (response.data as any).challans || response.data || [];

      if (Array.isArray(challans) && challans.length > 0) {
        // Calculate violations by type
        const typeMap: Record<string, number> = {};
        challans.forEach((challan: any) => {
          const type = challan.violation_type;
          typeMap[type] = (typeMap[type] || 0) + 1;
        });

        const byType = Object.entries(typeMap).map(([type, count]) => ({
          type: violationLabels[type] || type,
          count,
          rawType: type,
        })).sort((a, b) => b.count - a.count);

        setViolationsByType(byType);
        setTotalViolations(challans.length);

        // Find top violation
        if (byType.length > 0) {
          setTopViolation({ type: byType[0].type, count: byType[0].count });
        }

        // Calculate monthly trends (last 6 months)
        const monthMap: Record<string, number> = {};
        challans.forEach((challan: any) => {
          const date = new Date((challan as any).issued_at || challan.created_at);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
        });

        const monthlyData = Object.entries(monthMap)
          .map(([month, count]) => ({ month, count }))
          .slice(-6); // Last 6 months

        setMonthlyTrends(monthlyData);

        // Calculate this month's count
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        setThisMonthCount(monthMap[currentMonth] || 0);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({ title: 'Error', description: 'Failed to fetch analytics data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Violation Analytics</h1>
        <p className="text-muted-foreground">Traffic violation statistics and trends</p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-3xl font-bold">{totalViolations.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">{thisMonthCount}</p>
                <p className="text-xs text-success mt-1">Current period</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success to-accent flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Violation</p>
                <p className="text-3xl font-bold">{topViolation.type || 'N/A'}</p>
                <p className="text-xs text-muted-foreground mt-1">{topViolation.count} cases</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-destructive to-warning flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={violationsByType} 
                    dataKey="count" 
                    nameKey="type" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {violationsByType.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceAnalytics;

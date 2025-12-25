import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyticsService } from '@/services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const PoliceAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsService.getViolationAnalytics();
      if (response.success) setAnalytics(response.data);
    } catch (error) {
      // Use mock data for demo
      setAnalytics({
        total_violations: 1250,
        violations_by_type: [
          { type: 'OVER_SPEEDING', count: 320 },
          { type: 'SIGNAL_JUMP', count: 280 },
          { type: 'NO_HELMET', count: 220 },
          { type: 'NO_SEATBELT', count: 180 },
          { type: 'WRONG_PARKING', count: 150 },
          { type: 'DRUNK_DRIVING', count: 50 },
          { type: 'OTHER', count: 50 },
        ],
        violations_by_month: [
          { month: 'Jul', count: 180 },
          { month: 'Aug', count: 220 },
          { month: 'Sep', count: 195 },
          { month: 'Oct', count: 240 },
          { month: 'Nov', count: 210 },
          { month: 'Dec', count: 205 },
        ],
      });
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
                <p className="text-3xl font-bold">{analytics?.total_violations?.toLocaleString()}</p>
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
                <p className="text-3xl font-bold">205</p>
                <p className="text-xs text-success mt-1">+12% from last month</p>
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
                <p className="text-3xl font-bold">Speeding</p>
                <p className="text-xs text-muted-foreground mt-1">320 cases</p>
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
                  <Pie data={analytics?.violations_by_type} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} label={({ type, percent }) => `${type.replace('_', ' ')} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {analytics?.violations_by_type?.map((_: any, index: number) => (
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
                <BarChart data={analytics?.violations_by_month}>
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

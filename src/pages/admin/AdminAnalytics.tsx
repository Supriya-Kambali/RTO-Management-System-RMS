import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { analyticsService } from '@/services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Wallet, Users, Car, CreditCard, Loader2 } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const AdminAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashRes, revRes] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        analyticsService.getRevenueAnalytics(),
      ]);
      if (dashRes.success) setDashboardData(dashRes.data);
      if (revRes.success) setRevenueData(revRes.data);
    } catch (error) {
      // Mock data
      setDashboardData({
        total_users: 125000,
        total_vehicles: 89000,
        total_licenses: 67000,
        total_challans: 15000,
        revenue_month: 4500000,
      });
      setRevenueData({
        total_revenue: 45000000,
        revenue_by_month: [
          { month: 'Jul', amount: 3200000 },
          { month: 'Aug', amount: 3800000 },
          { month: 'Sep', amount: 4100000 },
          { month: 'Oct', amount: 4500000 },
          { month: 'Nov', amount: 4200000 },
          { month: 'Dec', amount: 4500000 },
        ],
        revenue_by_type: [
          { type: 'Vehicle Registration', amount: 18000000 },
          { type: 'Driving License', amount: 12000000 },
          { type: 'Challans', amount: 8000000 },
          { type: 'Renewals', amount: 5000000 },
          { type: 'Other', amount: 2000000 },
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
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive RTO statistics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: dashboardData?.total_users?.toLocaleString() || '125K', icon: Users, color: 'from-primary to-secondary' },
          { label: 'Vehicles', value: dashboardData?.total_vehicles?.toLocaleString() || '89K', icon: Car, color: 'from-secondary to-accent' },
          { label: 'Licenses', value: dashboardData?.total_licenses?.toLocaleString() || '67K', icon: CreditCard, color: 'from-accent to-primary' },
          { label: 'Challans', value: dashboardData?.total_challans?.toLocaleString() || '15K', icon: TrendingUp, color: 'from-warning to-destructive' },
          { label: 'Revenue (Month)', value: `₹${((dashboardData?.revenue_month || 4500000) / 100000).toFixed(1)}L`, icon: Wallet, color: 'from-success to-accent' },
        ].map((stat, i) => (
          <Card key={i} className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData?.revenue_by_month}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#areaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueData?.revenue_by_type} dataKey="amount" nameKey="type" cx="50%" cy="50%" outerRadius={100} label={({ type, percent }) => `${type.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {revenueData?.revenue_by_type?.map((_: any, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₹${(value/100000).toFixed(1)}L`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', vehicles: 1200, licenses: 890, challans: 450 },
                { month: 'Aug', vehicles: 1400, licenses: 920, challans: 520 },
                { month: 'Sep', vehicles: 1300, licenses: 850, challans: 480 },
                { month: 'Oct', vehicles: 1600, licenses: 1100, challans: 580 },
                { month: 'Nov', vehicles: 1450, licenses: 980, challans: 510 },
                { month: 'Dec', vehicles: 1550, licenses: 1050, challans: 490 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="vehicles" fill="hsl(var(--primary))" name="Vehicles" radius={[4, 4, 0, 0]} />
                <Bar dataKey="licenses" fill="hsl(var(--secondary))" name="Licenses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="challans" fill="hsl(var(--warning))" name="Challans" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;

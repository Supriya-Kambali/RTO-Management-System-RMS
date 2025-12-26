import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { challanService } from '@/services';
import { AlertTriangle, FileText, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const PoliceDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [challansToday, setChallansToday] = useState(0);
  const [challansThisMonth, setChallansThisMonth] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);
  const [disputedCount, setDisputedCount] = useState(0);
  const [recentChallans, setRecentChallans] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await challanService.listChallans();
      const challans = (response.data as any).challans || response.data || [];

      if (Array.isArray(challans)) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Calculate today's challans
        const todayChallans = challans.filter((c: any) => {
          const date = new Date((c as any).issued_at || c.created_at);
          return date >= todayStart;
        });
        setChallansToday(todayChallans.length);

        // Calculate this month's challans
        const monthChallans = challans.filter((c: any) => {
          const date = new Date((c as any).issued_at || c.created_at);
          return date >= monthStart;
        });
        setChallansThisMonth(monthChallans.length);

        // Calculate revenue this month
        const revenue = monthChallans.reduce((sum: number, c: any) => sum + Number(c.amount), 0);
        setRevenueThisMonth(revenue);

        // Count disputed challans
        const disputed = challans.filter((c: any) => c.status === 'DISPUTED');
        setDisputedCount(disputed.length);

        // Get recent challans (last 5)
        const recent = challans
          .sort((a: any, b: any) => {
            const dateA = new Date((a as any).issued_at || a.created_at).getTime();
            const dateB = new Date((b as any).issued_at || b.created_at).getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((c: any) => ({
            id: c.id,
            vehicle: c.registration_number || c.vehicle_id.slice(0, 8),
            violation: violationLabels[c.violation_type] || c.violation_type,
            amount: Number(c.amount),
            time: getRelativeTime(new Date((c as any).issued_at || c.created_at)),
          }));
        setRecentChallans(recent);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to fetch dashboard data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const stats = [
    { title: 'Challans Issued Today', value: challansToday.toString(), icon: AlertTriangle, color: 'from-destructive to-warning', change: 'Today' },
    { title: 'Total This Month', value: challansThisMonth.toString(), icon: FileText, color: 'from-primary to-secondary', change: 'Current month' },
    { title: 'Revenue Generated', value: `₹${(revenueThisMonth / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'from-success to-accent', change: 'This month' },
    { title: 'Pending Disputes', value: disputedCount.toString(), icon: Clock, color: 'from-warning to-primary', change: 'Awaiting review' },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Officer'}!</h1>
        <p className="text-muted-foreground">Traffic enforcement dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Challans */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Challans Issued
          </h2>
          <div className="space-y-3">
            {recentChallans.map((challan, i) => (
              <motion.div key={challan.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">{challan.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{challan.violation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{challan.amount}</p>
                  <p className="text-xs text-muted-foreground">{challan.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliceDashboard;

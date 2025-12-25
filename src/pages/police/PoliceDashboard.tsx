import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, FileText, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';

const stats = [
  { title: 'Challans Issued Today', value: '24', icon: AlertTriangle, color: 'from-destructive to-warning', change: '+8 from yesterday' },
  { title: 'Total This Month', value: '342', icon: FileText, color: 'from-primary to-secondary', change: '+12% from last month' },
  { title: 'Revenue Generated', value: '₹1.2L', icon: TrendingUp, color: 'from-success to-accent', change: 'This month' },
  { title: 'Pending Disputes', value: '15', icon: Clock, color: 'from-warning to-primary', change: '3 new today' },
];

const recentChallans = [
  { id: '1', vehicle: 'MH01AB1234', violation: 'Over Speeding', amount: 1000, time: '10 mins ago' },
  { id: '2', vehicle: 'MH02CD5678', violation: 'Signal Jump', amount: 500, time: '25 mins ago' },
  { id: '3', vehicle: 'MH03EF9012', violation: 'No Helmet', amount: 500, time: '1 hour ago' },
  { id: '4', vehicle: 'MH04GH3456', violation: 'Wrong Parking', amount: 200, time: '2 hours ago' },
];

const PoliceDashboard: React.FC = () => {
  const { user } = useAuth();

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

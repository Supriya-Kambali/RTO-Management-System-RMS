import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Car, CreditCard, AlertTriangle, Wallet, Calendar, Users, TrendingUp, BarChart3, CheckCircle2, Clock } from 'lucide-react';

const stats = [
  { title: 'Pending Vehicles', value: '89', icon: Car, color: 'from-primary to-secondary', change: '23 new today' },
  { title: 'DL Applications', value: '156', icon: CreditCard, color: 'from-secondary to-accent', change: '45 ready for approval' },
  { title: 'Active Disputes', value: '34', icon: AlertTriangle, color: 'from-warning to-destructive', change: '12 resolved today' },
  { title: 'Revenue Today', value: '₹4.2L', icon: Wallet, color: 'from-success to-accent', change: '+18% from yesterday' },
];

const quickStats = [
  { label: 'Vehicles Approved', value: '1,245', change: '+12%' },
  { label: 'DLs Issued', value: '892', change: '+8%' },
  { label: 'Challans Resolved', value: '456', change: '+15%' },
  { label: 'Appointments Today', value: '67', change: '12 pending' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Admin'}!</h1>
        <p className="text-muted-foreground">RTO Admin Dashboard</p>
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-success mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Recent Approvals</h2>
            <div className="space-y-3">
              {[
                { action: 'Vehicle Registration Approved', detail: 'MH01AB1234 - Maruti Swift', time: '5 mins ago' },
                { action: 'DL Application Approved', detail: 'Rahul Kumar - LMV', time: '15 mins ago' },
                { action: 'Challan Dispute Resolved', detail: 'Case #12345 - Accepted', time: '30 mins ago' },
                { action: 'Vehicle Transfer Completed', detail: 'MH02CD5678', time: '1 hour ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />This Week Overview</h2>
            <div className="space-y-4">
              {[
                { label: 'Vehicles Registered', value: 145, max: 200, color: 'bg-primary' },
                { label: 'DLs Issued', value: 89, max: 150, color: 'bg-secondary' },
                { label: 'Challans Collected', value: 234, max: 300, color: 'bg-warning' },
                { label: 'Revenue Target', value: 78, max: 100, color: 'bg-success' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{item.value}/{item.max}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

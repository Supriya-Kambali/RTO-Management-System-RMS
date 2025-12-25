import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ClipboardCheck, FileCheck, Calendar, Users, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Pending Applications', value: '45', icon: ClipboardCheck, color: 'from-primary to-secondary', change: '12 new today' },
  { title: 'Documents to Verify', value: '28', icon: FileCheck, color: 'from-warning to-primary', change: '5 AI flagged' },
  { title: 'Today\'s Appointments', value: '18', icon: Calendar, color: 'from-secondary to-accent', change: '3 completed' },
  { title: 'Verified Today', value: '32', icon: CheckCircle2, color: 'from-success to-accent', change: '+15% efficiency' },
];

const pendingApplications = [
  { id: '1', type: 'DL Application', name: 'Rahul Sharma', status: 'Documents Pending', time: '2 hours ago' },
  { id: '2', type: 'Vehicle Registration', name: 'Priya Patel', status: 'Verification Needed', time: '3 hours ago' },
  { id: '3', type: 'DL Renewal', name: 'Amit Kumar', status: 'Test Scheduled', time: '5 hours ago' },
  { id: '4', type: 'Vehicle Transfer', name: 'Sneha Reddy', status: 'Under Review', time: '1 day ago' },
];

const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Officer'}!</h1>
        <p className="text-muted-foreground">RTO Officer Dashboard</p>
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

      {/* Pending Applications */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pending Applications
          </h2>
          <div className="space-y-3">
            {pendingApplications.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning">{app.status}</p>
                  <p className="text-xs text-muted-foreground">{app.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerDashboard;

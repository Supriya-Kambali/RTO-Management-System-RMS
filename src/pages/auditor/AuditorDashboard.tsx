import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, TrendingUp, IndianRupee, AlertTriangle, FileText, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { title: 'Total Revenue', value: '₹4.5 Cr', icon: IndianRupee, color: 'from-success to-accent', change: '+12.5%', changeType: 'up' },
  { title: 'Total Challans', value: '12,450', icon: AlertTriangle, color: 'from-warning to-destructive', change: '+5.2%', changeType: 'up' },
  { title: 'Pending Payments', value: '₹45 L', icon: FileText, color: 'from-primary to-secondary', change: '-8.3%', changeType: 'down' },
  { title: 'Collection Rate', value: '94.5%', icon: PieChart, color: 'from-secondary to-primary', change: '+2.1%', changeType: 'up' },
];

const revenueBreakdown = [
  { source: 'Challan Payments', amount: '₹2.8 Cr', percentage: 62 },
  { source: 'Vehicle Registration', amount: '₹1.2 Cr', percentage: 27 },
  { source: 'DL Applications', amount: '₹35 L', percentage: 8 },
  { source: 'Other Fees', amount: '₹15 L', percentage: 3 },
];

const recentAudits = [
  { office: 'RTO Mumbai Central', date: '2024-12-20', status: 'Completed', findings: 'No issues' },
  { office: 'RTO Thane', date: '2024-12-18', status: 'Completed', findings: '2 minor discrepancies' },
  { office: 'RTO Pune', date: '2024-12-15', status: 'In Progress', findings: 'Pending review' },
  { office: 'RTO Nagpur', date: '2024-12-10', status: 'Completed', findings: 'No issues' },
];

const AuditorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Auditor Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and audit reports</p>
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
                    <p className={`text-xs mt-1 flex items-center gap-1 ${stat.changeType === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.changeType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.change}
                    </p>
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

      {/* Revenue Breakdown & Recent Audits */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueBreakdown.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.source}</span>
                  <span className="text-sm text-muted-foreground">{item.amount}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Recent Audits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAudits.map((audit, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{audit.office}</p>
                  <p className="text-sm text-muted-foreground">{audit.date} • {audit.findings}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${audit.status === 'Completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {audit.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditorDashboard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, MapPin, Calendar, Download, Info, FileText } from 'lucide-react';

const violationsByType = [
  { type: 'Over Speeding', count: 1245, amount: 1245000 },
  { type: 'Signal Jump', count: 892, amount: 1338000 },
  { type: 'No Helmet', count: 2156, amount: 1078000 },
  { type: 'No Seatbelt', count: 756, amount: 378000 },
  { type: 'Drunk Driving', count: 234, amount: 2340000 },
  { type: 'Wrong Parking', count: 1567, amount: 470100 },
  { type: 'No License', count: 423, amount: 2115000 },
  { type: 'No Insurance', count: 312, amount: 624000 },
];

const violationsByMonth = [
  { month: 'Jul', violations: 1250, revenue: 1875000 },
  { month: 'Aug', violations: 1420, revenue: 2130000 },
  { month: 'Sep', violations: 1180, revenue: 1770000 },
  { month: 'Oct', violations: 1650, revenue: 2475000 },
  { month: 'Nov', violations: 1380, revenue: 2070000 },
  { month: 'Dec', violations: 1520, revenue: 2280000 },
];

const violationsByRegion = [
  { region: 'Pune Central', count: 2345, percentage: 28 },
  { region: 'Pimpri-Chinchwad', count: 1876, percentage: 22 },
  { region: 'Hadapsar', count: 1234, percentage: 15 },
  { region: 'Kothrud', count: 987, percentage: 12 },
  { region: 'Hinjewadi', count: 876, percentage: 10 },
  { region: 'Others', count: 1067, percentage: 13 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

const ViolationReports: React.FC = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState('6months');

  const totalViolations = violationsByType.reduce((sum, v) => sum + v.count, 0);
  const totalRevenue = violationsByType.reduce((sum, v) => sum + v.amount, 0);
  const avgFine = Math.round(totalRevenue / totalViolations);

  const handleExport = (type: string) => {
    toast({
      title: 'Export Started',
      description: `${type} report is being generated...`,
    });
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-sm text-primary">Demo Mode: Displaying sample violation data</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Violation Reports</h1>
          <p className="text-muted-foreground">Comprehensive analysis of traffic violations</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-2xl font-bold">{totalViolations.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>-8% from last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fines Collected</p>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% from last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Fine</p>
                <p className="text-2xl font-bold">₹{avgFine.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Violation</p>
                <p className="text-2xl font-bold">No Helmet</p>
                <p className="text-xs text-muted-foreground mt-1">2,156 cases</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
            <CardDescription>Distribution of violations across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={violationsByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="type" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Count']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Violations by Region</CardTitle>
            <CardDescription>Geographic distribution of violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationsByRegion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ region, percentage }) => `${region}: ${percentage}%`}
                    labelLine={false}
                  >
                    {violationsByRegion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Violations']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Violation count and revenue trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={violationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `₹${(value / 100000).toFixed(1)}L` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Violations'
                  ]}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="violations" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Violation Summary Table</CardTitle>
          <CardDescription>Detailed breakdown of violations by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Violation Type</th>
                  <th className="text-right py-3 px-4 font-medium">Count</th>
                  <th className="text-right py-3 px-4 font-medium">Total Amount</th>
                  <th className="text-right py-3 px-4 font-medium">Avg Fine</th>
                  <th className="text-right py-3 px-4 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {violationsByType.map((violation, index) => (
                  <motion.tr 
                    key={violation.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-medium">{violation.type}</td>
                    <td className="text-right py-3 px-4">{violation.count.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">₹{violation.amount.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">₹{Math.round(violation.amount / violation.count).toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <Badge variant="outline">{((violation.count / totalViolations) * 100).toFixed(1)}%</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/30 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="text-right py-3 px-4">{totalViolations.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{totalRevenue.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{avgFine.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViolationReports;

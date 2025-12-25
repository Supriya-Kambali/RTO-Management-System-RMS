import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService, challanService, dlService, appointmentService, notificationService } from '@/services';
import { Car, CreditCard, AlertTriangle, Calendar, TrendingUp, Clock, CheckCircle2, ArrowUpRight, Loader2, Bell } from 'lucide-react';

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    vehiclesCount: 0,
    licenseStatus: 'N/A',
    licenseExpiry: '',
    pendingChallans: 0,
    challanAmount: 0,
    upcomingAppointments: 0,
    appointmentDate: '',
    unreadNotifications: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [vehiclesRes, challansRes, licenseRes, appointmentsRes, notificationsRes] = await Promise.all([
        vehicleService.getMyVehicles().catch(() => ({ success: false, data: [] })),
        challanService.getMyChallans().catch(() => ({ success: false, data: [] })),
        dlService.getMyLicense().catch(() => ({ success: false, data: null })),
        appointmentService.getMyAppointments().catch(() => ({ success: false, data: [] })),
        notificationService.getMyNotifications().catch(() => ({ success: false, data: [] })),
      ]);

      // Extract vehicles
      const vehicles = Array.isArray((vehiclesRes.data as any)?.vehicles) ? (vehiclesRes.data as any).vehicles : [];
      
      // Extract challans
      const challans = Array.isArray((challansRes.data as any)?.challans) ? (challansRes.data as any).challans : [];
      const pendingChallans = challans.filter((c: any) => c.status === 'UNPAID');
      const totalChallanAmount = pendingChallans.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
      
      // Extract license
      const license = (licenseRes.data as any)?.license || licenseRes.data;
      const licenseStatus = license?.status || 'Not Applied';
      const licenseExpiry = license?.expiry_date ? new Date(license.expiry_date).getFullYear().toString() : '';
      
      // Extract appointments
      const appointments = Array.isArray((appointmentsRes.data as any)?.appointments) ? (appointmentsRes.data as any).appointments : [];
      const upcomingAppts = appointments.filter((a: any) => 
        a.status === 'SCHEDULED' && new Date(a.appointment_date) > new Date()
      );
      const nextAppt = upcomingAppts[0];
      
      // Extract notifications
      const notifications = Array.isArray((notificationsRes.data as any)?.notifications) ? (notificationsRes.data as any).notifications : [];
      const unreadCount = notifications.filter((n: any) => !n.read).length;

      setDashboardData({
        vehiclesCount: vehicles.length,
        licenseStatus,
        licenseExpiry: licenseExpiry ? `Valid till ${licenseExpiry}` : 'N/A',
        pendingChallans: pendingChallans.length,
        challanAmount: totalChallanAmount,
        upcomingAppointments: upcomingAppts.length,
        appointmentDate: nextAppt ? new Date(nextAppt.appointment_date).toLocaleDateString() : 'None',
        unreadNotifications: unreadCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { 
      title: 'My Vehicles', 
      value: dashboardData.vehiclesCount.toString(), 
      icon: Car, 
      color: 'from-primary to-secondary', 
      change: dashboardData.vehiclesCount > 0 ? `${dashboardData.vehiclesCount} registered` : 'No vehicles' 
    },
    { 
      title: 'Driving License', 
      value: dashboardData.licenseStatus, 
      icon: CreditCard, 
      color: 'from-success to-accent', 
      change: dashboardData.licenseExpiry 
    },
    { 
      title: 'Pending Challans', 
      value: dashboardData.pendingChallans.toString(), 
      icon: AlertTriangle, 
      color: 'from-warning to-destructive', 
      change: dashboardData.challanAmount > 0 ? `₹${dashboardData.challanAmount.toLocaleString()} due` : 'All clear' 
    },
    { 
      title: 'Appointments', 
      value: dashboardData.upcomingAppointments.toString(), 
      icon: Calendar, 
      color: 'from-secondary to-primary', 
      change: dashboardData.appointmentDate 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Citizen'}!</h1>
        <p className="text-muted-foreground">Here's an overview of your RTO services</p>
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

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {['Register Vehicle', 'Apply for DL', 'Pay Challan', 'Book Appointment'].map((action, i) => (
              <button key={i} className="p-4 rounded-xl bg-muted/50 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all text-left">
                <ArrowUpRight className="h-4 w-4 text-primary mb-2" />
                <span className="text-sm font-medium">{action}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
              {dashboardData.unreadNotifications > 0 && (
                <span className="ml-auto text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {dashboardData.unreadNotifications} unread
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.unreadNotifications > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You have {dashboardData.unreadNotifications} unread notification{dashboardData.unreadNotifications !== 1 ? 's' : ''}
                </p>
                <a href="/citizen/notifications" className="text-sm text-primary hover:underline inline-block">
                  View all notifications →
                </a>
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No new notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Mail, MessageSquare, CreditCard, Bell, Shield, Database, Info, Save, RefreshCw } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  description: string;
}

const mockFeeStructure: FeeStructure[] = [
  { id: '1', name: 'Learner License Fee', amount: 200, description: 'Fee for learner license application' },
  { id: '2', name: 'Permanent License Fee', amount: 500, description: 'Fee for permanent driving license' },
  { id: '3', name: 'License Renewal Fee', amount: 300, description: 'Fee for license renewal' },
  { id: '4', name: 'Vehicle Registration Fee', amount: 2500, description: 'New vehicle registration fee' },
  { id: '5', name: 'RC Transfer Fee', amount: 1000, description: 'Vehicle ownership transfer fee' },
  { id: '6', name: 'Duplicate RC Fee', amount: 500, description: 'Fee for duplicate RC issuance' },
];

const SystemSettings: React.FC = () => {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeStructure[]>(mockFeeStructure);
  
  // Email Settings
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smtpHost, setSmtpHost] = useState('smtp.example.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEmail, setSmtpEmail] = useState('noreply@rto.gov.in');
  
  // SMS Settings
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsProvider, setSmsProvider] = useState('MSG91');
  const [smsApiKey, setSmsApiKey] = useState('••••••••••••••••');
  
  // Notification Settings
  const [challanNotify, setChallanNotify] = useState(true);
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [paymentReceipt, setPaymentReceipt] = useState(true);
  const [applicationUpdate, setApplicationUpdate] = useState(true);
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  const handleSaveSettings = (section: string) => {
    toast({
      title: 'Settings Saved',
      description: `${section} settings have been updated successfully`,
    });
  };

  const handleFeeUpdate = (id: string, newAmount: number) => {
    setFees(prev => prev.map(fee => fee.id === id ? { ...fee, amount: newAmount } : fee));
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-sm text-primary">Demo Mode: Changes will not persist</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="fees" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="fees"><CreditCard className="h-4 w-4 mr-2" />Fees</TabsTrigger>
          <TabsTrigger value="email"><Mail className="h-4 w-4 mr-2" />Email</TabsTrigger>
          <TabsTrigger value="sms"><MessageSquare className="h-4 w-4 mr-2" />SMS</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
        </TabsList>

        {/* Fee Structure */}
        <TabsContent value="fees">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <CardDescription>Configure fees for various RTO services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fees.map((fee, index) => (
                  <motion.div key={fee.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div>
                        <p className="font-semibold">{fee.name}</p>
                        <p className="text-sm text-muted-foreground">{fee.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => handleFeeUpdate(fee.id, parseInt(e.target.value) || 0)}
                          className="w-28"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSaveSettings('Fee Structure')}>
                  <Save className="h-4 w-4 mr-2" />Save Fees
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure SMTP settings for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                </div>
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
              
              {emailEnabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>From Email</Label>
                    <Input value={smtpEmail} onChange={(e) => setSmtpEmail(e.target.value)} placeholder="noreply@example.com" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Test Connection</Button>
                <Button onClick={() => handleSaveSettings('Email')}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>Configure SMS gateway for notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                </div>
                <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>
              
              {smsEnabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMS Provider</Label>
                    <Input value={smsProvider} onChange={(e) => setSmsProvider(e.target.value)} placeholder="MSG91" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" value={smsApiKey} onChange={(e) => setSmsApiKey(e.target.value)} placeholder="Enter API key" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Test SMS</Button>
                <Button onClick={() => handleSaveSettings('SMS')}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when to send notifications to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <Label>Challan Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify users when a new challan is issued</p>
                  </div>
                  <Switch checked={challanNotify} onCheckedChange={setChallanNotify} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders before scheduled appointments</p>
                  </div>
                  <Switch checked={appointmentReminder} onCheckedChange={setAppointmentReminder} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <Label>Payment Receipts</Label>
                    <p className="text-sm text-muted-foreground">Send receipt after successful payments</p>
                  </div>
                  <Switch checked={paymentReceipt} onCheckedChange={setPaymentReceipt} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <Label>Application Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify on application status changes</p>
                  </div>
                  <Switch checked={applicationUpdate} onCheckedChange={setApplicationUpdate} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Notification')}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Lock account after failed attempts</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Security')}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;

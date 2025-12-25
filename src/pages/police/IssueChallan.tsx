import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { challanService } from '@/services';
import { ViolationType } from '@/types';
import { AlertTriangle, Car, MapPin, IndianRupee, Loader2, CheckCircle2 } from 'lucide-react';

const violationTypes: { type: ViolationType; label: string; amount: number }[] = [
  { type: 'OVER_SPEEDING', label: 'Over Speeding', amount: 1000 },
  { type: 'SIGNAL_JUMP', label: 'Signal Jump', amount: 500 },
  { type: 'NO_HELMET', label: 'No Helmet', amount: 500 },
  { type: 'NO_SEATBELT', label: 'No Seatbelt', amount: 500 },
  { type: 'DRUNK_DRIVING', label: 'Drunk Driving', amount: 10000 },
  { type: 'WRONG_PARKING', label: 'Wrong Parking', amount: 200 },
  { type: 'NO_LICENSE', label: 'No License', amount: 5000 },
  { type: 'NO_INSURANCE', label: 'No Insurance', amount: 2000 },
  { type: 'OTHER', label: 'Other', amount: 500 },
];

const IssueChallan: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    registration_number: '',
    violation_type: '' as ViolationType,
    amount: 0,
    location: '',
  });

  const handleViolationChange = (type: ViolationType) => {
    const violation = violationTypes.find(v => v.type === type);
    setFormData({ ...formData, violation_type: type, amount: violation?.amount || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await challanService.issueChallan(formData);
      if (response.success) {
        setIsSuccess(true);
        toast({ title: 'Challan Issued!', description: `Challan for ₹${formData.amount} has been issued.` });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to issue challan', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ registration_number: '', violation_type: '' as ViolationType, amount: 0, location: '' });
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto fade-in-up">
        <Card className="glass-card text-center">
          <CardContent className="pt-12 pb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Challan Issued Successfully!</h2>
            <p className="text-muted-foreground mb-6">The challan has been recorded and sent to the vehicle owner.</p>
            <div className="p-4 rounded-xl bg-muted/50 mb-6">
              <p className="text-sm text-muted-foreground">Violation</p>
              <p className="font-semibold">{violationTypes.find(v => v.type === formData.violation_type)?.label}</p>
              <p className="text-2xl font-bold gradient-text mt-2">₹{formData.amount.toLocaleString()}</p>
            </div>
            <Button className="btn-gradient w-full" onClick={resetForm}>Issue Another Challan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Issue Challan</h1>
        <p className="text-muted-foreground">Record a new traffic violation</p>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              New Traffic Challan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Car className="h-4 w-4" />Vehicle Registration Number</Label>
                <Input placeholder="e.g., MH01AB1234" value={formData.registration_number} onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })} className="bg-muted/50" required />
                <p className="text-xs text-muted-foreground">Enter the vehicle's registration plate number</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Violation Type</Label>
                <Select value={formData.violation_type} onValueChange={handleViolationChange}>
                  <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select violation type" /></SelectTrigger>
                  <SelectContent>
                    {violationTypes.map((v) => (
                      <SelectItem key={v.type} value={v.type}>
                        <span className="flex items-center justify-between w-full">
                          {v.label} <span className="text-muted-foreground ml-4">₹{v.amount}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />Fine Amount</Label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="bg-muted/50" required />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" />Location (Optional)</Label>
                <Input placeholder="e.g., MG Road Junction, Mumbai" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-muted/50" />
              </div>

              <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Issue Challan</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IssueChallan;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { challanService } from '@/services';
import { ViolationType } from '@/types';
import { AlertTriangle, Car, MapPin, IndianRupee, Loader2, CheckCircle2, Scale, Shield } from 'lucide-react';

const violationTypes: { type: ViolationType; label: string; amount: number; icon: any; color: string }[] = [
  { type: 'OVER_SPEEDING', label: 'Over Speeding', amount: 1000, icon: AlertTriangle, color: 'text-red-500' },
  { type: 'SIGNAL_JUMP', label: 'Signal Jump', amount: 500, icon: AlertTriangle, color: 'text-orange-500' },
  { type: 'NO_HELMET', label: 'No Helmet', amount: 500, icon: Shield, color: 'text-yellow-500' },
  { type: 'NO_SEATBELT', label: 'No Seatbelt', amount: 500, icon: Shield, color: 'text-yellow-500' },
  { type: 'DRUNK_DRIVING', label: 'Drunk Driving', amount: 10000, icon: AlertTriangle, color: 'text-red-600' },
  { type: 'WRONG_PARKING', label: 'Wrong Parking', amount: 200, icon: Car, color: 'text-blue-500' },
  { type: 'NO_LICENSE', label: 'No License', amount: 5000, icon: Scale, color: 'text-red-500' },
  { type: 'NO_INSURANCE', label: 'No Insurance', amount: 2000, icon: Shield, color: 'text-orange-500' },
  { type: 'OTHER', label: 'Other', amount: 500, icon: AlertTriangle, color: 'text-gray-500' },
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-8"
      >
        <Card className="glass-card border-success/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-primary/10 pointer-events-none" />
          <CardContent className="pt-12 pb-8 relative">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="h-24 w-24 rounded-full bg-gradient-to-br from-success to-success/50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/20"
            >
              <CheckCircle2 className="h-12 w-12 text-white" />
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-3 text-center gradient-text"
            >
              Challan Issued Successfully!
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-8 text-center"
            >
              The violation has been recorded and the vehicle owner has been notified.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 mb-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle</p>
                  <p className="text-lg font-bold font-mono">{formData.registration_number}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Fine Amount</p>
                  <p className="text-2xl font-bold gradient-text">₹{formData.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Violation Type</p>
                <p className="text-base font-semibold">{violationTypes.find(v => v.type === formData.violation_type)?.label}</p>
              </div>
              
              {formData.location && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="text-sm">{formData.location}</p>
                </div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                className="btn-gradient w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                onClick={resetForm}
              >
                Issue Another Challan
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 fade-in-up max-w-4xl mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive to-warning shadow-lg shadow-destructive/20 mb-4">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">Issue Traffic Challan</h1>
        <p className="text-muted-foreground mt-2">Record and enforce traffic violations</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-border/50 overflow-hidden relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          
          <CardHeader className="relative border-b border-border/50 bg-muted/30 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-destructive to-warning flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Violation Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-8 relative">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Vehicle Registration */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  Vehicle Registration Number
                </Label>
                <Input 
                  placeholder="e.g., MH01AB1234" 
                  value={formData.registration_number} 
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })} 
                  className="h-12 text-base bg-muted/50 border-border/50 focus:bg-muted/80 transition-all font-mono tracking-wider" 
                  required 
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Enter the vehicle's registration plate number as displayed
                </p>
              </motion.div>

              {/* Violation Type */}
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  Violation Type
                </Label>
                <Select value={formData.violation_type} onValueChange={handleViolationChange}>
                  <SelectTrigger className="h-12 text-base bg-muted/50 border-border/50 focus:bg-muted/80">
                    <SelectValue placeholder="Select violation type" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {violationTypes.map((v) => (
                      <SelectItem key={v.type} value={v.type} className="h-12">
                        <div className="flex items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-2">
                            <v.icon className={`h-4 w-4 ${v.color}`} />
                            <span className="font-medium">{v.label}</span>
                          </div>
                          <span className="text-sm font-bold gradient-text">₹{v.amount.toLocaleString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Amount and Location Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Fine Amount */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-success" />
                    </div>
                    Fine Amount
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="number" 
                      value={formData.amount} 
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} 
                      className="h-12 text-base pl-12 bg-muted/50 border-border/50 focus:bg-muted/80 transition-all font-semibold" 
                      required 
                    />
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-500" />
                    </div>
                    Location <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input 
                    placeholder="e.g., MG Road Junction, Mumbai" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    className="h-12 text-base bg-muted/50 border-border/50 focus:bg-muted/80 transition-all" 
                  />
                </motion.div>
              </div>

              {/* Summary Card */}
              <AnimatePresence>
                {formData.violation_type && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/30 backdrop-blur-sm border border-border/50"
                  >
                    <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Summary</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Violation</p>
                        <p className="text-lg font-bold">{violationTypes.find(v => v.type === formData.violation_type)?.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Penalty</p>
                        <p className="text-2xl font-bold gradient-text">₹{formData.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="btn-gradient w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <><AlertTriangle className="h-5 w-5 mr-2" /> Issue Challan</>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default IssueChallan;

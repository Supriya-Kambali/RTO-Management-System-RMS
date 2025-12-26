import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services';
import { Car, Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';
  const { toast } = useToast();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (!email || !otp) {
      toast({ title: 'Error', description: 'Invalid reset link', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, formData.password);
      setIsSuccess(true);
      toast({ title: 'Password Reset!', description: 'You can now login with your new password.' });
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset password. OTP may be invalid or expired.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Car className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold gradient-text">RTO Portal</span>
          </Link>
          <h1 className="text-2xl font-bold">{isSuccess ? 'Password Reset!' : 'Reset Password'}</h1>
          <p className="text-muted-foreground">
            {isSuccess ? 'Your password has been changed successfully' : 'Create a new secure password'}
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password (min. 6 characters)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-muted/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 bg-muted/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>At least 6 characters long</li>
                    <li>Must match the confirmation</li>
                  </ul>
                </div>

                <Button type="submit" className="btn-gradient w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <p className="text-muted-foreground">
                  Redirecting to login page...
                </p>
                <Button className="btn-gradient w-full" asChild>
                  <Link to="/auth/login">Go to Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

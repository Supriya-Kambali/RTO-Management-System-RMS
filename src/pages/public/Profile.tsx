import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Edit2, Save, X, Loader2, LogIn } from 'lucide-react';
import api from '@/services/api';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profile, setProfile] = useState(user);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user) {
        try {
          setIsFetching(true);
          const response = await api.get('/users/profile');
          if (response.data.success) {
            const profileData = response.data.data.user;
            setProfile(profileData);
            setFormData({
              name: profileData.name || '',
              phone: profileData.phone || '',
              address: profileData.address || '',
            });
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(profileData));
          }
        } catch (error: any) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile data',
            variant: 'destructive',
          });
        } finally {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.id]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.put('/users/profile', formData);
      if (response.data.success) {
        const updatedProfile = response.data.data.user;
        setProfile(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
        toast({ title: 'Success', description: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        toast({ title: 'Error', description: response.data.message || 'Update failed', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Update failed', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="glass-card max-w-md w-full">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Sign In Required</h2>
                <p className="text-muted-foreground mt-2">Please login to view your profile</p>
              </div>
              <Button className="btn-gradient w-full" onClick={() => navigate('/auth/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  if (isFetching) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />Cancel
                </Button>
                <Button className="btn-gradient" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Save</>}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <Card className="glass-card overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
            <CardContent className="-mt-16 relative">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-background shadow-xl">
                  <User className="h-16 w-16 text-primary-foreground" />
                </div>
                <div className="flex-1 pt-4 md:pt-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{profile?.name}</h2>
                      <p className="text-muted-foreground">{profile?.email}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">{profile?.role?.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4" />User ID</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono text-sm bg-muted/50 px-3 py-2 rounded-md break-all">{profile?.id}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Use this ID for vehicle transfers and other operations</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" />Full Name</Label>
                  {isEditing ? (
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-muted/50" />
                  ) : (
                    <p className="font-medium">{profile?.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" />Email Address</Label>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" />Phone Number</Label>
                  {isEditing ? (
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-muted/50" />
                  ) : (
                    <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Date of Birth</Label>
                  <p className="font-medium">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />Address</Label>
                  {isEditing ? (
                    <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="bg-muted/50" />
                  ) : (
                    <p className="font-medium">{profile?.address || 'Not provided'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><CreditCard className="h-4 w-4" />Aadhaar Number</Label>
                  <p className="font-medium">
                    {profile?.aadhaar_number 
                      ? `XXXX XXXX ${profile.aadhaar_number.slice(-4)}` 
                      : 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4" />Account Status</Label>
                  <Badge className="badge-success">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default Profile;

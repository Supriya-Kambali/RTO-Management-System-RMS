import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  const getRoleDashboard = (role: string): string => {
    switch (role) {
      case 'CITIZEN': return '/citizen/dashboard';
      case 'POLICE': return '/police/dashboard';
      case 'RTO_OFFICER': return '/officer/dashboard';
      case 'RTO_ADMIN': return '/admin/dashboard';
      case 'SUPER_ADMIN': return '/super-admin/dashboard';
      case 'AUDITOR': return '/auditor/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card text-center">
          <CardContent className="pt-12 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="h-24 w-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6"
            >
              <ShieldX className="h-12 w-12 text-destructive" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>

            {user && (
              <div className="p-4 rounded-lg bg-muted/50 mb-6">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">Role: {user.role}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />Go Back
              </Button>
              <Link to={user ? getRoleDashboard(user.role) : '/'} className="flex-1">
                <Button className="btn-gradient w-full">
                  <Home className="h-4 w-4 mr-2" />{user ? 'Go to Dashboard' : 'Go Home'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Unauthorized;

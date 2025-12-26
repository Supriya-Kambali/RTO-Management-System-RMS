import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ServerCrash, RefreshCw, Home, Mail, AlertTriangle } from 'lucide-react';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-destructive/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card border-destructive/20">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Animated Icon */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                  <ServerCrash className="h-12 w-12 text-destructive" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </motion.div>
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-bold text-destructive mb-2">500</h1>
              <h2 className="text-2xl font-semibold mb-4">Server Error</h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-8 max-w-md mx-auto"
            >
              Oops! Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again in a few moments.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')} className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </motion.div>

            {/* Technical Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="text-xs text-muted-foreground">
                Error ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleString()}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServerError;

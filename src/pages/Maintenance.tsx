import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, Bell, CheckCircle, RefreshCw } from 'lucide-react';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Animated Icon */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Wrench className="h-12 w-12 text-primary" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">Under Maintenance</h1>
              <p className="text-muted-foreground mb-8">
                We're performing scheduled maintenance to improve your experience.
              </p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated time remaining
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{String(timeRemaining.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground uppercase">Hours</div>
                </div>
                <div className="text-4xl font-bold text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground uppercase">Minutes</div>
                </div>
                <div className="text-4xl font-bold text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground uppercase">Seconds</div>
                </div>
              </div>
            </motion.div>

            {/* What's happening */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-left bg-muted/30 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                What we're improving
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Database performance optimization
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Security updates and patches
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  New feature deployments
                </li>
              </ul>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Check Status
              </Button>
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notify Me
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="text-xs text-muted-foreground">
                Thank you for your patience. For urgent matters, please contact support.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Maintenance;

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft, Search, MapPin } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestedPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: MapPin },
    { name: 'Contact', path: '/contact', icon: Search },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Animated 404 */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <motion.span
                  className="text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200%' }}
                >
                  404
                </motion.span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-4"
                >
                  <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-muted-foreground mb-2">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1 inline-block">
                {location.pathname}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
            >
              <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button onClick={() => navigate('/')} className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </motion.div>

            {/* Suggested Pages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="text-sm text-muted-foreground mb-4">Or try one of these pages:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedPages.map((page) => (
                  <Button
                    key={page.path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(page.path)}
                    className="gap-2"
                  >
                    <page.icon className="h-4 w-4" />
                    {page.name}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Fun Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xs text-muted-foreground italic"
            >
              "Not all who wander are lost, but this page definitely is."
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;

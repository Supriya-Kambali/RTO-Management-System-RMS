import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getProfilePath = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case 'CITIZEN': return '/citizen/profile';
      case 'POLICE': return '/police/profile';
      case 'RTO_OFFICER': return '/officer/profile';
      case 'RTO_ADMIN': return '/admin/profile';
      case 'SUPER_ADMIN': return '/super-admin/profile';
      case 'AUDITOR': return '/auditor/profile';
      default: return '/profile';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border backdrop-glass">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-muted/50 border-transparent focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  5
                </Badge>
              </Button>
              
              <div 
                onClick={() => navigate(getProfilePath())}
                className="hidden md:flex items-center gap-2 pl-3 border-l border-border hover:bg-muted/50 rounded-lg px-3 py-1 cursor-pointer transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

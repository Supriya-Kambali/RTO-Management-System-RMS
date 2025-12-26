import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';
import { challanService } from '@/services';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Car,
  CreditCard,
  FileText,
  Calendar,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  Users,
  Building2,
  BarChart3,
  Wallet,
  ClipboardCheck,
  Search,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const getSidebarItems = (role: string): SidebarItem[] => {
  const baseItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: 'dashboard' },
  ];

  switch (role) {
    case 'CITIZEN':
      return [
        ...baseItems,
        { icon: User, label: 'My Profile', href: 'profile' },
        { icon: Car, label: 'My Vehicles', href: 'vehicles' },
        { icon: CreditCard, label: 'Driving License', href: 'license' },
        { icon: AlertTriangle, label: 'Challans', href: 'challans' },
        { icon: Wallet, label: 'Payments', href: 'payments' },
        { icon: Calendar, label: 'Appointments', href: 'appointments' },
        { icon: FileText, label: 'Documents', href: 'documents' },
        { icon: Bell, label: 'Notifications', href: 'notifications' },
      ];

    case 'POLICE':
      return [
        ...baseItems,
        { icon: AlertTriangle, label: 'Issue Challan', href: 'issue-challan' },
        { icon: FileText, label: 'Challan List', href: 'challans' },
        { icon: BarChart3, label: 'Analytics', href: 'analytics' },
        { icon: User, label: 'Profile', href: 'profile' },
      ];

    case 'RTO_OFFICER':
      return [
        ...baseItems,
        { icon: ClipboardCheck, label: 'Applications', href: 'applications' },
        { icon: FileCheck, label: 'Document Verification', href: 'verification' },
        { icon: Search, label: 'Test Results', href: 'test-results' },
        { icon: Calendar, label: 'Appointments', href: 'appointments' },
        { icon: User, label: 'Profile', href: 'profile' },
      ];

    case 'RTO_ADMIN':
      return [
        ...baseItems,
        { icon: Car, label: 'Vehicles', href: 'vehicles' },
        { icon: CreditCard, label: 'DL Applications', href: 'dl-applications' },
        { icon: AlertTriangle, label: 'Challans', href: 'challans' },
        { icon: Wallet, label: 'Payments', href: 'payments' },
        { icon: Calendar, label: 'Appointments', href: 'appointments' },
        { icon: Bell, label: 'Notifications', href: 'notifications' },
        { icon: BarChart3, label: 'Analytics', href: 'analytics' },
        { icon: Users, label: 'Users', href: 'users' },
        { icon: User, label: 'Profile', href: 'profile' },
      ];

    case 'SUPER_ADMIN':
      return [
        ...baseItems,
        { icon: Building2, label: 'RTO Offices', href: 'offices' },
        { icon: Users, label: 'User Management', href: 'users' },
        // { icon: Shield, label: 'Role Assignment', href: 'roles' },
        { icon: BarChart3, label: 'Analytics', href: 'analytics' },
        { icon: Settings, label: 'Settings', href: 'settings' },
        { icon: User, label: 'Profile', href: 'profile' },
      ];

    case 'AUDITOR':
      return [
        ...baseItems,
        { icon: BarChart3, label: 'Analytics', href: 'analytics' },
        { icon: Wallet, label: 'Revenue Reports', href: 'revenue' },
        { icon: AlertTriangle, label: 'Violations', href: 'violations' },
        { icon: CreditCard, label: 'Payments Audit', href: 'payments' },
        { icon: User, label: 'Profile', href: 'profile' },
      ];

    default:
      return baseItems;
  }
};

const getRoleBasePath = (role: string): string => {
  switch (role) {
    case 'CITIZEN': return '/citizen';
    case 'POLICE': return '/police';
    case 'RTO_OFFICER': return '/officer';
    case 'RTO_ADMIN': return '/admin';
    case 'SUPER_ADMIN': return '/super-admin';
    case 'AUDITOR': return '/auditor';
    default: return '/citizen';
  }
};

export const DashboardSidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications(true);
  const [pendingChallansCount, setPendingChallansCount] = React.useState(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch real badge counts
  React.useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;

      try {
        // Fetch pending challans for citizen
        if (user.role === 'CITIZEN') {
          const response = await challanService.getMyChallans();
          if (response.success && response.data) {
            const challans = (response.data as any).challans || response.data || [];
            const pending = Array.isArray(challans) ? challans.filter((c: any) => c.status === 'PENDING').length : 0;
            setPendingChallansCount(pending);
          }
        }

        // Fetch pending applications for RTO Officer
        if (user.role === 'RTO_OFFICER') {
          // TODO: Add API call to get pending applications count
          // For now, set to 0 to remove mock data
          setPendingApplicationsCount(0);
        }
      } catch (error) {
        console.error('Error fetching badge counts:', error);
      }
    };

    fetchCounts();
  }, [user]);

  if (!user) return null;

  const basePath = getRoleBasePath(user.role);
  const sidebarItems = getSidebarItems(user.role).map(item => {
    // Update badges with real data
    if (item.label === 'Notifications') {
      return { ...item, badge: unreadCount > 0 ? unreadCount : undefined };
    }
    if (item.label === 'Challans' && user.role === 'CITIZEN') {
      return { ...item, badge: pendingChallansCount > 0 ? pendingChallansCount : undefined };
    }
    if (item.label === 'Applications' && user.role === 'RTO_OFFICER') {
      return { ...item, badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined };
    }
    // Remove mock badges
    return { ...item, badge: undefined };
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold gradient-text">RTO Portal</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("text-sidebar-foreground hover:bg-sidebar-accent", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === `${basePath}/${item.href}`;
            const Icon = item.icon;

            const linkContent = (
              <Link
                to={`${basePath}/${item.href}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
            <Link to={`${basePath}/profile`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="shrink-0 text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link to={`${basePath}/profile`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="w-full text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

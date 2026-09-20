import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Database, Layers, FileText, Wand2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Class Builder', icon: LayoutDashboard },
  { path: '/ai-generator', label: 'AI Generator', icon: Wand2 },
  { path: '/templates', label: 'Templates', icon: Layers },
  { path: '/moves', label: 'Moves', icon: Database },
  { path: '/combos', label: 'Combos', icon: FileText },
];

export function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#1E2530] border-b border-[rgba(184,192,204,0.14)] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo width={160} height={36} variant="light" showMark={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 font-body text-sm transition-colors ${
                      isActive
                        ? 'text-[#73D9D6] bg-[#73D9D6]/10'
                        : 'text-[#B8C0CC] hover:text-[#F7F4EF] hover:bg-[rgba(184,192,204,0.08)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-[#F7F4EF] hover:bg-[rgba(184,192,204,0.08)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[rgba(184,192,204,0.14)] pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 font-body text-sm ${
                      isActive
                        ? 'text-[#73D9D6] bg-[#73D9D6]/10'
                        : 'text-[#B8C0CC] hover:text-[#F7F4EF] hover:bg-[rgba(184,192,204,0.08)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
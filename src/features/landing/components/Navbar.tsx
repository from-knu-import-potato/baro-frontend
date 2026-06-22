import { useState } from 'react';

import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import ThemeToggle from '@/features/theme/components/ThemeToggle';
import { useTheme } from '@/features/theme/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);
  const canGoBack = location.key !== 'default';

  const handleLogoClick = () => {
    navigate(routePaths.landing);
    setIsMenuOpen(false);
  };

  const handleCtaClick = () => {
    if (isLoggedIn) {
      if (canGoBack) navigate(-1);
      else navigate(routePaths.myStores);
    } else {
      navigate(routePaths.login);
    }
    setIsMenuOpen(false);
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-baro-ivory-dark dark:border-baro-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center gap-2 outline-none">
            <img src="/assets/baro-logo.png" alt="BARO" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">BARO</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#problem"
              onClick={(e) => handleNavLinkClick(e, 'problem')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              서비스 배경
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavLinkClick(e, 'how-it-works')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              사용흐름
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavLinkClick(e, 'features')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              기능소개
            </a>
            <div className="flex items-center gap-3 ml-4">
              <Button
                className="bg-baro-blue hover:bg-baro-blue-dark text-xs rounded-full text-white"
                onClick={handleCtaClick}
              >
                {isLoggedIn ? (canGoBack ? '돌아가기' : '계정 홈으로') : '시작하기'}
              </Button>
              <ThemeToggle dark={dark} toggleTheme={toggleTheme} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-baro-ivory-dark dark:border-baro-black animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2 text-center">
            <a
              href="#problem"
              onClick={(e) => handleNavLinkClick(e, 'problem')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              서비스 배경
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavLinkClick(e, 'how-it-works')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              사용흐름
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavLinkClick(e, 'features')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              기능소개
            </a>
            <Button
              className="bg-baro-blue hover:bg-baro-blue/90 w-full h-11 text-white"
              onClick={handleCtaClick}
            >
              {isLoggedIn ? '돌아가기' : '시작하기'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

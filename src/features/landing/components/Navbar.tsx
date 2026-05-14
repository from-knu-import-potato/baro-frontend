import { useState } from 'react';

import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { Button } from '@/shadcn/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate(routePaths.landing);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate(routePaths.login);
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate(routePaths.signup);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-baro-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center gap-2 outline-none">
            <img src="/assets/baro-icon.png" alt="BARO" className="h-8 w-8" />
            <span className="text-xl font-bold text-baro-black tracking-tight">BARO</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => handleNavLinkClick(e, 'features')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              기능소개
            </a>
            <a
              href="#analytics"
              onClick={(e) => handleNavLinkClick(e, 'analytics')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              데이터분석
            </a>
            <a
              href="#guide"
              onClick={(e) => handleNavLinkClick(e, 'guide')}
              className="text-sm font-medium text-baro-black-muted hover:text-baro-blue transition-colors"
            >
              이용가이드
            </a>
            <div className="flex items-center gap-3 ml-4">
              <Button variant="outline" onClick={handleLoginClick} className="rounded-full text-xs">
                로그인
              </Button>
              <Button
                className="bg-baro-blue hover:bg-baro-blue-dark text-xs rounded-full"
                onClick={handleSignupClick}
              >
                시작하기
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-baro-black p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-baro-ivory-dark animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a
              href="#features"
              onClick={(e) => handleNavLinkClick(e, 'features')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              기능소개
            </a>
            <a
              href="#analytics"
              onClick={(e) => handleNavLinkClick(e, 'analytics')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              데이터분석
            </a>
            <a
              href="#guide"
              onClick={(e) => handleNavLinkClick(e, 'guide')}
              className="block px-3 py-2 text-base font-medium text-baro-black-muted"
            >
              이용가이드
            </a>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={handleLoginClick} className="w-full">
                로그인
              </Button>
              <Button
                className="bg-baro-blue hover:bg-baro-blue/90 w-full"
                onClick={handleSignupClick}
              >
                시작하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { Link } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const Footer = () => {
  return (
    <footer className="bg-baro-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to={routePaths.landing} className="flex items-center gap-2 mb-6">
              <img src={baroLogo} alt="BARO" className="h-8 w-8 brightness-0 invert" />
              <span className="text-xl font-bold tracking-tight">BARO</span>
            </Link>
            <p className="text-baro-black-muted text-sm leading-relaxed mb-6">
              사장님들의 가장 든든한 AI 재고 관리 파트너.
              <br />
              찍으면 바로, 분석과 예측도 바로!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-6">서비스</h4>
            <ul className="space-y-4 text-sm text-baro-black-muted">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  기능소개
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/from-knu-import-potato"
                  className="hover:text-white transition-colors"
                >
                  Github
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  성공 사례
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">고객 지원</h4>
            <ul className="space-y-4 text-sm text-baro-black-muted">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  공지사항
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  1:1 문의
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  이용 약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보 처리방침
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">문의</h4>
            <ul className="space-y-4 text-sm text-baro-black-muted">
              <li>Email: dd22dd22.yy66yy66@gmail.com</li>
              <li>Phone: -</li>
              <li>Address: -</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-baro-black-muted">© 2026 BARO. All rights reserved.</p>
          <div className="text-xs text-baro-black-muted">Made with by FROM KNU IMPORT POTATO</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

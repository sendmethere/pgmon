import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Edit3, Target } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEvaluation = location.pathname === '/app';
  const isLibrary = location.pathname === '/library';
  const isActivity = location.pathname === '/activity';

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-2 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="평가몬 로고" 
              className="w-32 object-contain cursor-pointer"
              onClick={() => navigate('/app')}
            />
            <div className="flex items-end space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">평가몬</h1>
              <p className="text-xs text-gray-600">초등학교 선생님을 위한 스마트한 평가 플랫폼</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => navigate('/app')}
              className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEvaluation
                  ? 'bg-pgm-primary text-white'
                  : 'text-gray-600 hover:text-pgm-primary hover:bg-gray-50 border'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>행발 문장 만들기</span>
            </button>
            <button
              onClick={() => navigate('/activity')}
              className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActivity
                  ? 'bg-pgm-primary text-white'
                  : 'text-gray-600 hover:text-pgm-primary hover:bg-gray-50 border'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>창체 평가하기</span>
            </button>
            <button
              onClick={() => navigate('/library')}
              className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLibrary
                  ? 'bg-pgm-primary text-white'
                  : 'text-gray-600 hover:text-pgm-primary hover:bg-gray-50 border'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>문장 라이브러리</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

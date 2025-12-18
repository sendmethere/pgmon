import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import StudentInput from './components/StudentInput';
import SubjectSelector from './components/SubjectSelector';
import EvaluationTable from './components/EvaluationTable';
import ResultsDisplay from './components/ResultsDisplay';
import SentenceLibrary from './components/SentenceLibrary';
import PasswordGate from './components/PasswordGate';
import AdminPanel from './components/AdminPanel';
import { useEvaluationStore } from './store/evaluationStore';

// 인증 확인 함수
const isAuthenticated = () => {
  return localStorage.getItem('pgm_authenticated') === 'true';
};

// Protected Route 컴포넌트
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 메인 앱 컴포넌트
function MainApp() {
  const { evaluationResults } = useEvaluationStore();

  return (
    <div className="min-h-screen bg-pgm-base font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* 학생 정보 입력과 평가 영역 선택을 한 행으로 배치 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            <StudentInput />
            <SubjectSelector />
          </div>
          
          {/* 첫 번째 divider */}
          <div className="border-t border-gray-200 my-6"></div>
          
          {/* 평가 테이블 */}
          <div className="pb-6">
            <EvaluationTable />
          </div>
          
          {/* 두 번째 divider - 결과가 있을 때만 표시 */}
          {evaluationResults.length > 0 && (
            <div className="border-t border-gray-200 my-6"></div>
          )}
          
          {/* 결과 표시 */}
          {evaluationResults.length > 0 && (
            <ResultsDisplay />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated() ? <Navigate to="/app" replace /> : <PasswordGate />
          } 
        />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } 
        />
        {/* 문장 라이브러리 페이지 */}
        <Route 
          path="/library" 
          element={
            <ProtectedRoute>
              <SentenceLibrary />
            </ProtectedRoute>
          } 
        />
        {/* 관리자 페이지 - 메뉴에 표시되지 않음 */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        {/* 모든 잘못된 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

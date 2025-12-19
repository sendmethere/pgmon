import React, { useState, useRef } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { useEvaluationStore } from '../store/evaluationStore';

const ResultsDisplay = () => {
  const { evaluationResults, exportToExcel, updateResultSentence } = useEvaluationStore();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const textareaRefs = useRef([]);
  
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setShowCopyToast(true);
      setTimeout(() => setCopiedIndex(null), 2000);
      setTimeout(() => setShowCopyToast(false), 1500);
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setShowCopyToast(true);
      setTimeout(() => setCopiedIndex(null), 2000);
      setTimeout(() => setShowCopyToast(false), 1500);
    }
  };
  
  const handleExport = () => {
    exportToExcel();
  };

  // 화살표 키로 상하 이동 + Ctrl/Cmd+C 복사
  const handleKeyDown = (e, index, text) => {
    const totalItems = evaluationResults.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, totalItems - 1);
      textareaRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      textareaRefs.current[prevIndex]?.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      // 선택된 텍스트가 없으면 전체 복사
      const selection = window.getSelection().toString();
      if (!selection && text) {
        e.preventDefault();
        handleCopy(text, index);
      }
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-pgm-primary text-white rounded-full text-sm font-semibold">
            4
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">평가 결과</h2>
            <p className="text-sm text-gray-600">{evaluationResults.length}명의 평가 문장이 생성되었습니다</p>
          </div>
        </div>
        
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Excel로 저장</span>
        </button>
      </div>
      
      {evaluationResults.length > 0 && (
        <p className="text-xs text-gray-400 mb-2">
          💡 ↑↓ 화살표로 이동, Ctrl+C (Mac: ⌘+C)로 복사
        </p>
      )}
      
      <div className="divide-y divide-gray-200">
        {evaluationResults.map((result, index) => (
          <div
            key={result.studentId}
            className="flex items-start gap-3 py-3 hover:bg-gray-50 transition-colors"
          >
            {/* 번호 */}
            <div className="flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-600 rounded-full text-sm font-medium flex-shrink-0">
              {index + 1}
            </div>
            
            {/* 이름 */}
            <div className="w-20 flex-shrink-0">
              <span className="font-medium text-gray-900">{result.studentName}</span>
            </div>
            
            {/* 생성 결과 (수정 가능) */}
            <textarea
              ref={(el) => (textareaRefs.current[index] = el)}
              value={result.sentence}
              onChange={(e) => updateResultSentence(result.studentId, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index, result.sentence)}
              className="flex-1 px-2 h-36 text-sm text-gray-800 leading-relaxed bg-transparent border border-transparent resize-none focus:outline-none focus:bg-white focus:border-2 focus:border-pgm-primary focus:rounded -mx-1"
              rows={2}
            />
            
            {/* 복사 버튼 */}
            <button
              onClick={() => handleCopy(result.sentence, index)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex-shrink-0 cursor-pointer"
            >
              {copiedIndex === index ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      {evaluationResults.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>아직 생성된 평가 문장이 없습니다.</p>
          <p className="text-sm">평가를 완료한 후 '평가 문장 생성' 버튼을 눌러주세요.</p>
        </div>
      )}

      {/* 복사 토스트 */}
      {showCopyToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50 animate-fade-in">
          <Check className="h-4 w-4 text-green-400" />
          복사되었습니다
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
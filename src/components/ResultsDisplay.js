import React, { useState } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { useEvaluationStore } from '../store/evaluationStore';

const ResultsDisplay = () => {
  const { evaluationResults, exportToExcel } = useEvaluationStore();
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
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
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };
  
  const handleExport = () => {
    exportToExcel();
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
      
      <div className="space-y-4">
        {evaluationResults.map((result, index) => (
          <div
            key={result.studentId}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{result.studentName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">평가 문장</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleCopy(result.sentence, index)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
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
            
            <div className="bg-gray-50 rounded-lg p-4">
              <textarea
                value={result.sentence}
                readOnly
                className="w-full h-20 bg-transparent border-none resize-none focus:outline-none text-gray-800 text-sm leading-relaxed"
              />
            </div>
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
    </div>
  );
};

export default ResultsDisplay;
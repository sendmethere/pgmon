import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useEvaluationStore } from '../store/evaluationStore';

const EvaluationTable = () => {
  const { students, selectedSubjects, updateStudentScore, updateStudentName, generateEvaluations, isLoading, clearScores } = useEvaluationStore();
  
  const handleScoreChange = (studentId, subjectId, value, currentInput) => {
    const score = parseInt(value) || 0;
    if (score >= 0 && score <= 5) {
      updateStudentScore(studentId, subjectId, score);
      
      // Auto-focus to next input if score is entered
      if (value !== '' && currentInput) {
        const form = currentInput.closest('table');
        const inputs = Array.from(form.querySelectorAll('input[type="number"]'));
        const currentIndex = inputs.indexOf(currentInput);
        if (currentIndex < inputs.length - 1) {
          inputs[currentIndex + 1].focus();
        }
      }
    }
  };
  
  const handleNameChange = (studentId, name) => {
    updateStudentName(studentId, name);
  };

  const handleGenerateEvaluations = () => {
    generateEvaluations();
  };

  // 화살표 키로 상하좌우 이동
  const handleKeyDown = (e, rowIndex, colIndex, totalCols) => {
    const table = e.target.closest('table');
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const totalRows = rows.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRowIndex = Math.min(rowIndex + 1, totalRows - 1);
      const nextRow = rows[nextRowIndex];
      const inputs = nextRow.querySelectorAll('input');
      if (inputs[colIndex]) {
        inputs[colIndex].focus();
        inputs[colIndex].select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRowIndex = Math.max(rowIndex - 1, 0);
      const prevRow = rows[prevRowIndex];
      const inputs = prevRow.querySelectorAll('input');
      if (inputs[colIndex]) {
        inputs[colIndex].focus();
        inputs[colIndex].select();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentRow = rows[rowIndex];
      const inputs = currentRow.querySelectorAll('input');
      const nextColIndex = Math.min(colIndex + 1, totalCols - 1);
      if (inputs[nextColIndex]) {
        inputs[nextColIndex].focus();
        inputs[nextColIndex].select();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentRow = rows[rowIndex];
      const inputs = currentRow.querySelectorAll('input');
      const prevColIndex = Math.max(colIndex - 1, 0);
      if (inputs[prevColIndex]) {
        inputs[prevColIndex].focus();
        inputs[prevColIndex].select();
      }
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-pgm-primary text-white rounded-full text-sm font-semibold">
            3
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">평가하기</h2>
          </div>
        </div>
        <button
          onClick={clearScores}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
          title="점수 초기화"
        >
          <RotateCcw className="w-3 h-3" />
          초기화
        </button>
      </div>
      
      {/* 등급 입력 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <h3 className="font-medium text-blue-900 mb-2">등급 입력 안내</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
          <div className="text-blue-800">
            <span className="font-semibold">1:</span> 뛰어남/매우 우수함
          </div>
          <div className="text-blue-800">
            <span className="font-semibold">2:</span> 적극적/우수함
          </div>
          <div className="text-blue-800">
            <span className="font-semibold">3:</span> 보통/무난함
          </div>
          <div className="text-blue-800">
            <span className="font-semibold">4:</span> 소극적/발전중
          </div>
          <div className="text-blue-800">
            <span className="font-semibold">5:</span> 소홀함/많은 노력 요함
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          입력하지 않는 항목은 빈칸 또는 '0'으로 설정하세요
        </p>
      </div>
      
      {/* 평가 테이블 */}
      {selectedSubjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">평가 영역을 선택해주세요.</p>
          <p className="text-sm">위의 "2. 평가 영역 선택"에서 평가하고 싶은 영역들을 선택하세요.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-300" style={{tableLayout: 'fixed', width: 'auto'}}>
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-900" style={{width: '50px'}}>
                  번호
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-900" style={{width: '120px'}}>
                  이름
                </th>
                {selectedSubjects.map((subject) => (
                  <th
                    key={subject.id}
                    className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-16"
                    title={subject.subject_name}
                  >
                    {subject.subject_name_short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, rowIndex) => {
                const totalCols = selectedSubjects.length + 1; // 이름 + 점수들
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2 text-center text-gray-600 text-sm" style={{width: '50px'}}>
                      {rowIndex + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2" style={{width: '120px'}}>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleNameChange(student.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, totalCols)}
                        placeholder="이름"
                        className="w-full px-2 py-1 text-center text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pgm-primary rounded"
                        maxLength="8"
                      />
                    </td>
                    {selectedSubjects.map((subject, colIndex) => (
                      <td key={subject.id} className="border border-gray-300 px-1 py-2">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={student.scores[subject.id] || ''}
                          onChange={(e) => handleScoreChange(student.id, subject.id, e.target.value, e.target)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex + 1, totalCols)}
                          className="w-full px-1 py-1 text-center text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
                          placeholder="0"
                          title={subject.subject_name}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 평가 문장 생성 버튼 */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleGenerateEvaluations}
          disabled={isLoading || students.length === 0 || selectedSubjects.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-pgm-secondary text-white rounded-lg hover:bg-pgm-secondary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>평가 문장 생성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>평가 문장 생성</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EvaluationTable;
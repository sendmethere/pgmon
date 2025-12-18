import React, { useState, useRef } from 'react';
import { Users, Plus, Upload, HelpCircle, RotateCcw } from 'lucide-react';
import { useEvaluationStore } from '../store/evaluationStore';
import * as XLSX from 'xlsx';

const StudentInput = () => {
  const { students, addMultipleStudents, removeStudent, importStudentsFromExcel, clearStudents } = useEvaluationStore();
  const [studentCount, setStudentCount] = useState(10);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleGenerateStudents = () => {
    if (studentCount >= 0 && studentCount <= 50) {
      if (studentCount > 0) {
        addMultipleStudents(studentCount);
      }
      setStudentCount(10);
    }
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let students = [];
        
        if (file.name.endsWith('.csv')) {
          // CSV 파일 처리
          const text = e.target.result;
          const lines = text.split('\n');
          const header = lines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIndex = header.findIndex(h => h.includes('이름') || h.includes('name'));
          
          students = lines
            .slice(1) // Skip header
            .filter(line => line.trim())
            .map(line => {
              const columns = line.split(',');
              const name = nameIndex >= 0 ? columns[nameIndex]?.trim() : columns[1]?.trim();
              return { name: name || '' };
            });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Excel 파일 처리
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          students = jsonData.map(row => {
            // '이름' 또는 'name' 열을 찾음
            const name = row['이름'] || row['name'] || row['Name'] || 
                        Object.values(row)[1] || ''; // 두 번째 열을 기본값으로
            return { name: String(name).trim() };
          });
        }
        
        if (students.length > 0) {
          const validStudents = students.filter(s => s.name);
          if (validStudents.length > 0) {
            importStudentsFromExcel(validStudents);
          } else {
            alert('유효한 학생 이름을 찾을 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('파일 처리 중 오류가 발생했습니다:', error);
        alert('파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  
  return (
    <div className="h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-pgm-primary text-white rounded-full text-sm font-semibold">
            1
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">학생 정보 입력</h2>
            <p className="text-xs text-gray-600">최대 50명까지 입력 가능</p>
          </div>
        </div>
        <button
          onClick={clearStudents}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
          title="학생 초기화"
        >
          <RotateCcw className="w-3 h-3" />
          초기화
        </button>
      </div>
      
      <div className="space-y-4">
        {/* 학생 수 입력 및 생성 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={studentCount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || val === '0') {
                  setStudentCount(val === '' ? '' : 0);
                } else {
                  setStudentCount(Math.max(0, Math.min(50, parseInt(val) || 0)));
                }
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
              min="0"
              max="50"
            />
            <span className="text-gray-700">명</span>
          </div>
          <button
            onClick={handleGenerateStudents}
            className="flex items-center space-x-2 px-4 py-2 bg-pgm-primary text-white rounded-md hover:bg-pgm-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>생성</span>
          </button>
        </div>
        
        {/* 파일 업로드 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm text-gray-600">또는</p>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="파일 형식 안내"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          
          {showGuide && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
              <h4 className="font-medium text-blue-900 mb-2">파일 형식 안내</h4>
              <ul className="text-blue-800 space-y-1">
                <li>• 지원 형식: .csv, .xlsx, .xls</li>
                <li>• 필수 열: '번호' 또는 '이름' 열이 있어야 합니다</li>
                <li>• 첫 번째 행은 헤더로 인식됩니다</li>
                <li>• 예시: 번호, 이름 또는 Name 열 포함</li>
              </ul>
            </div>
          )}
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors inline-flex">
            <Upload className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">학생 명부 파일 불러오기 (.csv, .xlsx)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        
        {/* 생성된 학생 수 표시 */}
        {students.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">생성된 학생 수: {students.length}명</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInput;
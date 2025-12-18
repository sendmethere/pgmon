import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, Plus, Trash2, Wand2, Upload, HelpCircle, Copy, Users, List, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Header from './Header';
import Footer from './Footer';

// 데이터 import
import activityTypes from '../data/activityType.json';
import activities from '../data/activity.json';
import activitySentences from '../data/activity_sentence.json';

// localStorage 키
const STORAGE_KEYS = {
  STUDENTS: 'activity_students',
  ITEMS: 'activity_items',
  EVALUATIONS: 'activity_evaluations',
};

const ActivityEvaluation = () => {
  // 전역 학생 목록
  const [globalStudents, setGlobalStudents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : [];
  });
  
  // 선택 상태
  const [selectedType, setSelectedType] = useState(null); // 자율/동아리/진로/모아보기
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOverview, setIsOverview] = useState(false); // 모아보기 모드
  
  // 생성된 아이템들 (타입별로 관리)
  const [createdItems, setCreatedItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return saved ? JSON.parse(saved) : { 1: [], 2: [], 3: [] };
  });
  
  // 평가 데이터 { [itemId]: { [studentNumber]: evaluation } }
  const [evaluations, setEvaluations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    return saved ? JSON.parse(saved) : {};
  });
  
  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemActivity, setNewItemActivity] = useState(null);
  
  // 학생 입력 상태
  const [studentCount, setStudentCount] = useState(10);
  const [showStudentSetup, setShowStudentSetup] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef(null);
  
  // 토스트
  const [showCopyToast, setShowCopyToast] = useState(false);

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(globalStudents));
  }, [globalStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(createdItems));
  }, [createdItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
  }, [evaluations]);

  // 현재 타입에 맞는 활동들
  const filteredActivities = useMemo(() => {
    if (!selectedType) return [];
    return activities.filter(a => a.activity_type_id === selectedType.id);
  }, [selectedType]);

  // 현재 타입의 아이템들
  const currentItems = useMemo(() => {
    if (!selectedType) return [];
    return createdItems[selectedType.id] || [];
  }, [selectedType, createdItems]);

  // 현재 선택된 활동의 문장들
  const currentSentences = useMemo(() => {
    if (!selectedItem) return [];
    return activitySentences.filter(s => s.activity_id === selectedItem.activityId);
  }, [selectedItem]);

  // 학생 생성
  const handleGenerateStudents = () => {
    if (studentCount <= 0 || studentCount > 50) return;
    
    const newStudents = Array.from({ length: studentCount }, (_, i) => ({
      number: i + 1,
      name: '',
    }));
    
    setGlobalStudents(newStudents);
    setShowStudentSetup(false);
  };

  // 파일 업로드로 학생 생성
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let students = [];
        
        if (file.name.endsWith('.csv')) {
          const text = e.target.result;
          const lines = text.split('\n');
          const header = lines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIndex = header.findIndex(h => h.includes('이름') || h.includes('name'));
          
          students = lines
            .slice(1)
            .filter(line => line.trim())
            .map((line, i) => {
              const columns = line.split(',');
              const name = nameIndex >= 0 ? columns[nameIndex]?.trim() : columns[1]?.trim();
              return { number: i + 1, name: name || '' };
            });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          students = jsonData.map((row, i) => {
            const name = row['이름'] || row['name'] || row['Name'] || Object.values(row)[1] || '';
            return { number: i + 1, name: String(name).trim() };
          });
        }
        
        if (students.length > 0) {
          setGlobalStudents(students);
          setShowStudentSetup(false);
        }
      } catch (error) {
        console.error('파일 처리 중 오류:', error);
        alert('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 학생 이름 변경
  const handleNameChange = (studentNumber, name) => {
    setGlobalStudents(prev => 
      prev.map(s => s.number === studentNumber ? { ...s, name } : s)
    );
  };

  // 아이템 추가
  const handleAddItem = () => {
    if (!newItemDate || !newItemActivity || !selectedType) return;
    
    const newItem = {
      id: Date.now(),
      date: newItemDate,
      activityId: newItemActivity.id,
      activityName: newItemActivity.name,
      label: `${newItemDate} (${newItemActivity.name})`,
      typeId: selectedType.id,
    };
    
    setCreatedItems(prev => ({
      ...prev,
      [selectedType.id]: [...prev[selectedType.id], newItem],
    }));
    
    setShowAddModal(false);
    setNewItemDate('');
    setNewItemActivity(null);
  };

  // 아이템 삭제
  const handleDeleteItem = (itemId) => {
    if (!selectedType) return;
    
    setCreatedItems(prev => ({
      ...prev,
      [selectedType.id]: prev[selectedType.id].filter(item => item.id !== itemId),
    }));
    
    setEvaluations(prev => {
      const newData = { ...prev };
      delete newData[itemId];
      return newData;
    });
    
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  // 평가 문장 변경
  const handleEvaluationChange = (itemId, studentNumber, evaluation) => {
    setEvaluations(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [studentNumber]: evaluation,
      },
    }));
  };

  // 일괄 자동 추가 (기존 문장 끝에 추가, 중복 방지 - 중복 시 다른 문장 찾아서 추가)
  const handleAutoFill = () => {
    if (!selectedItem || globalStudents.length === 0 || currentSentences.length === 0) return;
    
    const sentences = [...currentSentences];
    const currentItemEvals = evaluations[selectedItem.id] || {};
    
    const shuffle = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    
    const newEvaluations = {};
    
    globalStudents.forEach((student) => {
      const existingText = currentItemEvals[student.number] || '';
      
      // 셔플된 문장들 중에서 기존에 없는 문장 찾기
      const shuffledSentences = shuffle(sentences);
      let selectedSentence = null;
      
      for (const sentence of shuffledSentences) {
        if (!existingText.includes(sentence.text)) {
          selectedSentence = sentence.text;
          break;
        }
      }
      
      // 사용 가능한 문장이 있으면 추가
      if (selectedSentence) {
        newEvaluations[student.number] = existingText 
          ? `${existingText} ${selectedSentence}` 
          : selectedSentence;
      } else {
        // 모든 문장이 이미 사용됨
        newEvaluations[student.number] = existingText;
      }
    });
    
    setEvaluations(prev => ({
      ...prev,
      [selectedItem.id]: newEvaluations,
    }));
  };

  // 평가 초기화
  const handleClearEvaluations = () => {
    if (!selectedItem) return;
    
    const clearedEvaluations = {};
    globalStudents.forEach((student) => {
      clearedEvaluations[student.number] = '';
    });
    
    setEvaluations(prev => ({
      ...prev,
      [selectedItem.id]: clearedEvaluations,
    }));
  };

  // 복사
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 1500);
  };

  // 전체 복사
  const handleCopyAll = () => {
    if (!selectedItem) return;
    const itemEvals = evaluations[selectedItem.id] || {};
    const text = globalStudents
      .filter(s => itemEvals[s.number])
      .map(s => `${s.name || `학생${s.number}`}: ${itemEvals[s.number]}`)
      .join('\n');
    handleCopy(text);
  };

  // 모아보기에서 특정 학생의 해당 타입 평가 가져오기
  const getStudentTypeEvaluations = (studentNumber, typeId) => {
    const result = [];
    
    if (createdItems[typeId]) {
      createdItems[typeId].forEach(item => {
        const eval_ = evaluations[item.id]?.[studentNumber];
        if (eval_) {
          result.push({
            label: item.label,
            evaluation: eval_,
          });
        }
      });
    }
    
    return result;
  };

  // 모아보기 xlsx 내보내기
  const handleExportOverview = () => {
    if (!selectedType || globalStudents.length === 0) return;
    
    const data = globalStudents.map(student => {
      const typeEvals = getStudentTypeEvaluations(student.number, selectedType.id);
      const combinedText = typeEvals.map(e => e.evaluation).join(' ');
      return {
        '번호': student.number,
        '이름': student.name || '',
        [`${selectedType.name} 기록`]: combinedText,
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedType.name);
    
    // 열 너비 설정
    worksheet['!cols'] = [
      { wch: 6 },   // 번호
      { wch: 10 },  // 이름
      { wch: 80 },  // 기록
    ];
    
    XLSX.writeFile(workbook, `${selectedType.name}_모아보기.xlsx`);
  };

  // 컬럼 스타일
  const columnClass = "w-48 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto";
  const itemClass = (selected) => `px-3 py-2 cursor-pointer flex items-center justify-between text-sm ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-pgm-base font-sans flex flex-col">
      <Header />
      <div className="p-4 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">🎯 창체(자율, 동아리, 진로) 평가하기 (누가 & 발달)</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 학생 설정 영역 */}
              <div className="flex items-center gap-2 border-r pr-3">
                {globalStudents.length > 0 ? (
                  <>
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{globalStudents.length}명</span>
                    <button
                      onClick={() => setShowStudentSetup(true)}
                      className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      수정
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowStudentSetup(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    학생 설정
                  </button>
                )}
              </div>
              
              {/* 일괄 자동 추가/초기화/복사 버튼 */}
              {selectedItem && globalStudents.length > 0 && !isOverview && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutoFill}
                    disabled={currentSentences.length === 0}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" />
                    일괄 자동 추가
                  </button>
                  <button
                    onClick={handleClearEvaluations}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 cursor-pointer"
                  >
                    초기화
                  </button>
                  <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    전체 복사
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 학생 설정 모달 */}
          {showStudentSetup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                <h3 className="text-lg font-bold mb-4">학생 설정</h3>
                
                <div className="space-y-4">
                  {/* 학생 수 입력 */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={studentCount}
                        onChange={(e) => setStudentCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
                        min="1"
                        max="50"
                      />
                      <span className="text-gray-700">명</span>
                    </div>
                    <button
                      onClick={handleGenerateStudents}
                      className="flex items-center space-x-2 px-4 py-2 bg-pgm-primary text-white rounded-md hover:bg-pgm-primary/90 transition-colors cursor-pointer"
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
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {showGuide && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                        <ul className="text-blue-800 space-y-1">
                          <li>• 지원 형식: .csv, .xlsx, .xls</li>
                          <li>• 필수 열: '이름' 열</li>
                        </ul>
                      </div>
                    )}
                    
                    <label className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors inline-flex">
                      <Upload className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">명부 파일 불러오기</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* 현재 학생 목록 */}
                  {globalStudents.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-2">현재 {globalStudents.length}명 설정됨</p>
                      <button
                        onClick={() => { setGlobalStudents([]); setEvaluations({}); }}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        전체 초기화
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowStudentSetup(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Finder 스타일 컬럼 뷰 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex h-[calc(100vh-200px)] overflow-x-auto">
              
              {/* 1. 활동 유형 컬럼 */}
              <div className={columnClass}>
                <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">활동 유형</div>
                
                {activityTypes.map(type => (
                  <div
                    key={type.id}
                    onClick={() => { setSelectedType(type); setSelectedItem(null); setIsOverview(false); }}
                    className={itemClass(selectedType?.id === type.id)}
                  >
                    <span>{type.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                ))}
              </div>


              {/* 2. 날짜+활동 아이템 컬럼 */}
              {selectedType && (
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex items-center justify-between">
                    <span>활동 목록</span>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                      title="활동 추가"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 모아보기 버튼 */}
                  <div
                    onClick={() => { setIsOverview(true); setSelectedItem(null); }}
                    className={`${itemClass(isOverview)} border-b border-gray-200`}
                  >
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      <span className="font-medium">모아보기</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                  
                  {currentItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      <p>활동이 없습니다</p>
                      <p className="text-xs mt-1">+ 버튼을 눌러 추가하세요</p>
                    </div>
                  ) : (
                    currentItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => { setSelectedItem(item); setIsOverview(false); }}
                        className={`${itemClass(selectedItem?.id === item.id && !isOverview)} group`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs opacity-70">{item.date}</div>
                          <div className="truncate">{item.activityName}</div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. 모아보기 컬럼 */}
              {isOverview && selectedType && (
                <div className="flex-1 min-w-[500px] h-full overflow-y-auto">
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex items-center justify-between">
                    <span>{selectedType.name} 모아보기</span>
                    <button
                      onClick={handleExportOverview}
                      disabled={globalStudents.length === 0}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      xlsx 내보내기
                    </button>
                  </div>
                  
                  {globalStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p>학생을 먼저 설정해주세요</p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-12">번호</th>
                            <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-24">이름</th>
                            <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900">{selectedType.name} 기록</th>
                          </tr>
                        </thead>
                        <tbody>
                          {globalStudents.map((student) => {
                            const typeEvals = getStudentTypeEvaluations(student.number, selectedType.id);
                            const combinedText = typeEvals.map(e => e.evaluation).join(' ');
                            return (
                              <tr key={student.number} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 py-2 text-center text-gray-600 text-sm">
                                  {student.number}
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                  <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => handleNameChange(student.number, e.target.value)}
                                    placeholder="이름"
                                    className="w-full px-2 py-1 text-center text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pgm-primary rounded"
                                    maxLength="8"
                                  />
                                </td>
                                <td 
                                  className="border border-gray-300 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                                  onClick={() => combinedText && handleCopy(combinedText)}
                                  title={combinedText ? "클릭하여 복사" : ""}
                                >
                                  {combinedText || <span className="text-gray-400">기록 없음</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 4. 학생 평가 컬럼 */}
              {selectedItem && !isOverview && (
                <div className="flex-1 min-w-[500px] h-full overflow-y-auto">
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">
                    {selectedItem.label} - 학생 평가
                  </div>
                  
                  {globalStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p>학생을 먼저 설정해주세요</p>
                      <button
                        onClick={() => setShowStudentSetup(true)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 cursor-pointer"
                      >
                        학생 설정
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 사용 가능한 문장 목록 */}
                      <div className="px-4 py-2 bg-purple-50 border-b">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-purple-700 font-medium">
                            사용 가능한 문장 ({currentSentences.length}개)
                          </summary>
                          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                            {currentSentences.map(s => (
                              <div 
                                key={s.id} 
                                className="text-xs text-purple-600 p-1 hover:bg-purple-100 rounded cursor-pointer"
                                onClick={() => handleCopy(s.text)}
                              >
                                {s.text}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                      
                      {/* 학생 평가 테이블 */}
                      <div className="p-4">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-12">번호</th>
                              <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-24">이름</th>
                              <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900">평가 문장</th>
                              <th className="border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-900 w-12">복사</th>
                            </tr>
                          </thead>
                          <tbody>
                            {globalStudents.map((student) => (
                              <tr key={student.number} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 py-2 text-center text-gray-600 text-sm">
                                  {student.number}
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                  <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => handleNameChange(student.number, e.target.value)}
                                    placeholder="이름"
                                    className="w-full px-2 py-1 text-center text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pgm-primary rounded"
                                    maxLength="8"
                                  />
                                </td>
                                <td className="border border-gray-300 px-2 py-2">
                                  <textarea
                                    value={evaluations[selectedItem.id]?.[student.number] || ''}
                                    onChange={(e) => handleEvaluationChange(selectedItem.id, student.number, e.target.value)}
                                    placeholder="평가 문장을 입력하세요"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pgm-primary rounded resize-none"
                                    rows={2}
                                  />
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-center">
                                  <button
                                    onClick={() => handleCopy(evaluations[selectedItem.id]?.[student.number] || '')}
                                    disabled={!evaluations[selectedItem.id]?.[student.number]}
                                    className="p-1 text-gray-400 hover:text-green-500 disabled:opacity-30 cursor-pointer"
                                    title="복사"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 활동 추가 모달 */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                <h3 className="text-lg font-bold mb-4">활동 추가</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input
                      type="date"
                      value={newItemDate}
                      onChange={(e) => setNewItemDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">활동</label>
                    <select
                      value={newItemActivity?.id || ''}
                      onChange={(e) => {
                        const activity = filteredActivities.find(a => a.id === parseInt(e.target.value));
                        setNewItemActivity(activity);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgm-primary focus:border-transparent"
                    >
                      <option value="">활동 선택</option>
                      {filteredActivities.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => { setShowAddModal(false); setNewItemDate(''); setNewItemActivity(null); }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemDate || !newItemActivity}
                    className="px-4 py-2 bg-pgm-primary text-white rounded hover:bg-pgm-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 복사 토스트 */}
          {showCopyToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
              ✓ 복사되었습니다
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityEvaluation;

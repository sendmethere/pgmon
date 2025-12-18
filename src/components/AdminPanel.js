import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Download, Save, X, ChevronRight, Copy } from 'lucide-react';

// 데이터 import
import initialBehaviorSentences from '../data/behavior_sentence.json';
import initialSubjectSentences from '../data/subject_sentence.json';
import categoryData from '../data/category.json';
import subjectDetailData from '../data/subject_detail.json';
import subjectData from '../data/subject.json';
import chaptersData from '../data/chapters.json';

const AdminPanel = () => {
  // 데이터 상태
  const [behaviorSentences, setBehaviorSentences] = useState(initialBehaviorSentences);
  const [subjectSentences, setSubjectSentences] = useState(initialSubjectSentences);
  
  // 최상위 타입
  const [activeType, setActiveType] = useState('behavior'); // 'behavior' | 'subject'
  
  // 행발 선택 상태
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  
  // 교과 선택 상태
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // 편집 상태
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newText, setNewText] = useState(''); // textarea 입력
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 1500);
  };

  // 변경 사항 계산
  const behaviorChanges = useMemo(() => {
    const initialMap = new Map(initialBehaviorSentences.map(s => [s.id, s.sentence_text]));
    const currentIds = new Set(behaviorSentences.map(s => s.id));
    const added = behaviorSentences.filter(s => !initialMap.has(s.id)).length;
    const deleted = initialBehaviorSentences.filter(s => !currentIds.has(s.id)).length;
    const modified = behaviorSentences.filter(s => 
      initialMap.has(s.id) && initialMap.get(s.id) !== s.sentence_text
    ).length;
    return { added, deleted, modified, total: behaviorSentences.length };
  }, [behaviorSentences]);

  const subjectChanges = useMemo(() => {
    const initialMap = new Map(initialSubjectSentences.map(s => [s.id, s.text]));
    const currentIds = new Set(subjectSentences.map(s => s.id));
    const added = subjectSentences.filter(s => !initialMap.has(s.id)).length;
    const deleted = initialSubjectSentences.filter(s => !currentIds.has(s.id)).length;
    const modified = subjectSentences.filter(s => 
      initialMap.has(s.id) && initialMap.get(s.id) !== s.text
    ).length;
    return { added, deleted, modified, total: subjectSentences.length };
  }, [subjectSentences]);

  // 행발: 세부영역 목록
  const subjectDetails = useMemo(() => {
    if (!selectedCategory) return [];
    return subjectDetailData.filter(sd => sd.category_id === selectedCategory.id);
  }, [selectedCategory]);

  // 행발: 등급별 문장
  const behaviorByGrade = useMemo(() => {
    if (!selectedSubjectDetail) return {};
    const filtered = behaviorSentences.filter(s => s.subject_id_id === selectedSubjectDetail.id);
    return {
      1: filtered.filter(s => s.sentence_grade === 1),
      2: filtered.filter(s => s.sentence_grade === 2),
      3: filtered.filter(s => s.sentence_grade === 3),
      4: filtered.filter(s => s.sentence_grade === 4),
      5: filtered.filter(s => s.sentence_grade === 5),
    };
  }, [selectedSubjectDetail, behaviorSentences]);

  // 행발: 선택된 등급의 문장들
  const currentBehaviorSentences = useMemo(() => {
    if (!selectedGrade || !selectedSubjectDetail) return [];
    if (selectedGrade === 'all') {
      // 전체 등급: 등급순 정렬
      return behaviorSentences
        .filter(s => s.subject_id_id === selectedSubjectDetail.id)
        .sort((a, b) => a.sentence_grade - b.sentence_grade);
    }
    return behaviorSentences.filter(s => 
      s.subject_id_id === selectedSubjectDetail.id && s.sentence_grade === selectedGrade
    );
  }, [selectedSubjectDetail, selectedGrade, behaviorSentences]);

  // 교과: 학년 목록
  const gradeLevels = useMemo(() => {
    if (!selectedSubject) return [];
    const grades = [...new Set(chaptersData
      .filter(ch => ch.subject_id === selectedSubject.id)
      .map(ch => ch.grade))];
    return grades.sort((a, b) => parseInt(a) - parseInt(b));
  }, [selectedSubject]);

  // 교과: 학기 목록
  const textbooks = useMemo(() => {
    if (!selectedSubject || !selectedGradeLevel) return [];
    return [...new Set(chaptersData
      .filter(ch => ch.subject_id === selectedSubject.id && ch.grade === selectedGradeLevel)
      .map(ch => ch.textbook))];
  }, [selectedSubject, selectedGradeLevel]);

  // 교과: 단원 목록
  const chapters = useMemo(() => {
    if (!selectedSubject || !selectedGradeLevel || !selectedTextbook) return [];
    return chaptersData
      .filter(ch => ch.subject_id === selectedSubject.id && ch.grade === selectedGradeLevel && ch.textbook === selectedTextbook)
      .sort((a, b) => a.chapter_no - b.chapter_no);
  }, [selectedSubject, selectedGradeLevel, selectedTextbook]);

  // 교과: 선택된 단원의 문장들
  const currentSubjectSentences = useMemo(() => {
    if (!selectedChapter) return [];
    return subjectSentences.filter(s => s.chapter_id === selectedChapter.id);
  }, [selectedChapter, subjectSentences]);

  // 타입 변경
  const handleTypeChange = (type) => {
    setActiveType(type);
    // 초기화
    setSelectedCategory(null);
    setSelectedSubjectDetail(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedGradeLevel(null);
    setSelectedTextbook(null);
    setSelectedChapter(null);
    setEditingId(null);
    setNewText('');
  };

  // 입력된 텍스트를 줄 단위로 파싱 (최대 10개)
  const parseLines = (text) => {
    return text.split('\n').map(s => s.trim()).filter(s => s !== '').slice(0, 10);
  };

  // 문장 추가
  const handleAddSentences = () => {
    const texts = parseLines(newText);
    if (texts.length === 0) return;

    if (activeType === 'behavior' && selectedSubjectDetail && selectedGrade) {
      let maxId = Math.max(...behaviorSentences.map(s => s.id), 0);
      const newItems = texts.map(text => ({
        id: ++maxId,
        sentence_text: text,
        sentence_grade: selectedGrade,
        subject_id_id: selectedSubjectDetail.id,
      }));
      setBehaviorSentences([...behaviorSentences, ...newItems]);
    } else if (activeType === 'subject' && selectedChapter) {
      let maxId = Math.max(...subjectSentences.map(s => s.id), 0);
      const now = new Date().toISOString().replace('T', ' ').slice(0, -1);
      const newItems = texts.map(text => ({
        id: ++maxId,
        text: text,
        chapter_id: selectedChapter.id,
        score: 1,
        created_at: now,
        updated_at: now,
        sentence_owner_id: 1,
      }));
      setSubjectSentences([...subjectSentences, ...newItems]);
    }
    setNewText('');
  };

  // 문장 수정
  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    if (activeType === 'behavior') {
      setBehaviorSentences(behaviorSentences.map(s => 
        s.id === id ? { ...s, sentence_text: editText.trim() } : s
      ));
    } else {
      const now = new Date().toISOString().replace('T', ' ').slice(0, -1);
      setSubjectSentences(subjectSentences.map(s => 
        s.id === id ? { ...s, text: editText.trim(), updated_at: now } : s
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  // 문장 삭제
  const handleDelete = (id) => {
    if (activeType === 'behavior') {
      setBehaviorSentences(behaviorSentences.filter(s => s.id !== id));
    } else {
      setSubjectSentences(subjectSentences.filter(s => s.id !== id));
    }
  };

  // JSON 내보내기
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBehavior = () => {
    downloadJSON(behaviorSentences, 'behavior_sentence.json');
  };

  const handleExportSubject = () => {
    downloadJSON(subjectSentences, 'subject_sentence.json');
  };


  // 등급 색상
  const gradeColors = {
    1: 'bg-green-500',
    2: 'bg-blue-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };

  // 컬럼 스타일
  const columnClass = "w-48 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto";
  const itemClass = (selected) => `px-3 py-2 cursor-pointer flex items-center justify-between text-sm ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">📋 평가문장 관리</h1>
            <div className="flex gap-1">
              <button
                onClick={() => handleTypeChange('behavior')}
                className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'behavior' ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🏃 행발
              </button>
              <button
                onClick={() => handleTypeChange('subject')}
                className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'subject' ? 'bg-emerald-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                📚 교과
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
            <a href="/app" className="text-sm text-gray-500 hover:text-gray-700">← 메인</a>
          </div>
        </div>

        {/* Finder 스타일 컬럼 뷰 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-180px)] overflow-x-auto">
            
            {activeType === 'behavior' ? (
              <>
                {/* 카테고리 컬럼 */}
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">카테고리</div>
                  {categoryData.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat); setSelectedSubjectDetail(null); setSelectedGrade(null); }}
                      className={itemClass(selectedCategory?.id === cat.id)}
                    >
                      <span>{cat.category_name}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  ))}
                </div>

                {/* 세부영역 컬럼 */}
                {selectedCategory && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">세부영역</div>
                    {subjectDetails.map(sd => (
                      <div
                        key={sd.id}
                        onClick={() => { setSelectedSubjectDetail(sd); setSelectedGrade(null); }}
                        className={itemClass(selectedSubjectDetail?.id === sd.id)}
                      >
                        <span>{sd.subject_name_short}</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 등급 컬럼 */}
                {selectedSubjectDetail && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">등급</div>
                    {/* 전체 등급 */}
                    <div
                      onClick={() => setSelectedGrade('all')}
                      className={itemClass(selectedGrade === 'all')}
                    >
                      <span>전체</span>
                      <span className="text-xs opacity-70">
                        {Object.values(behaviorByGrade).flat().length}
                      </span>
                    </div>
                    {[1, 2, 3, 4, 5].map(g => (
                      <div
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={itemClass(selectedGrade === g)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${gradeColors[g]}`}></span>
                          <span>{g}등급</span>
                        </div>
                        <span className="text-xs opacity-70">{behaviorByGrade[g]?.length || 0}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 문장 컬럼 */}
                {selectedGrade && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                      <span>문장 ({currentBehaviorSentences.length})</span>
                    </div>
                    
                    {/* 문장 목록 */}
                    <div className="divide-y divide-gray-100">
                      {currentBehaviorSentences.map(s => (
                        <div key={s.id} className="p-2 hover:bg-gray-50 group">
                          {editingId === s.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(s.id)}
                              />
                              <button onClick={() => handleUpdate(s.id)} className="text-blue-500 text-sm cursor-pointer">저장</button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm cursor-pointer">취소</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {/* 전체 등급일 때 등급 표시 */}
                              {selectedGrade === 'all' && (
                                <span className={`w-5 h-5 flex items-center justify-center text-xs text-white rounded-full flex-shrink-0 ${gradeColors[s.sentence_grade]}`}>
                                  {s.sentence_grade}
                                </span>
                              )}
                              <span 
                                className="flex-1 text-sm cursor-pointer hover:text-blue-600"
                                onClick={() => handleCopy(s.sentence_text)}
                              >
                                {s.sentence_text}
                              </span>
                              <button
                                onClick={() => handleCopy(s.sentence_text)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-500 cursor-pointer"
                                title="복사"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setEditingId(s.id); setEditText(s.sentence_text); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 새 문장 추가 - 특정 등급 선택 시에만 표시 */}
                    {selectedGrade !== 'all' && (
                    <div className="p-3 border-t bg-gray-50">
                      <div className="text-xs text-gray-500 mb-2">
                        새 문장 추가 <span className="text-gray-400">(줄바꿈으로 구분, 최대 10개)</span>
                      </div>
                      <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="문장을 입력하세요...&#10;여러 줄을 붙여넣기하면 각 줄이 문장이 됩니다."
                        className="w-full px-2 py-2 border rounded text-sm resize-none"
                        rows={6}
                      />
                      <button
                        onClick={handleAddSentences}
                        disabled={!parseLines(newText).length}
                        className="mt-2 w-full py-1.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        저장 ({parseLines(newText).length}개)
                      </button>
                    </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 과목 컬럼 */}
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">과목</div>
                  {subjectData.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { setSelectedSubject(s); setSelectedGradeLevel(null); setSelectedTextbook(null); setSelectedChapter(null); }}
                      className={itemClass(selectedSubject?.id === s.id)}
                    >
                      <span>{s.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  ))}
                </div>

                {/* 학년 컬럼 */}
                {selectedSubject && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">학년</div>
                    {gradeLevels.map(g => (
                      <div
                        key={g}
                        onClick={() => { setSelectedGradeLevel(g); setSelectedTextbook(null); setSelectedChapter(null); }}
                        className={itemClass(selectedGradeLevel === g)}
                      >
                        <span>{g}학년</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 학기 컬럼 */}
                {selectedGradeLevel && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">학기</div>
                    {textbooks.map(tb => (
                      <div
                        key={tb}
                        onClick={() => { setSelectedTextbook(tb); setSelectedChapter(null); }}
                        className={itemClass(selectedTextbook === tb)}
                      >
                        <span>{tb}</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 단원 컬럼 */}
                {selectedTextbook && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">단원</div>
                    {chapters.map(ch => {
                      const sentenceCount = subjectSentences.filter(s => s.chapter_id === ch.id).length;
                      return (
                        <div
                          key={ch.id}
                          onClick={() => setSelectedChapter(ch)}
                          className={itemClass(selectedChapter?.id === ch.id)}
                        >
                          <span className="truncate">{ch.chapter_no}. {ch.name}</span>
                          <span className="text-xs opacity-70 flex-shrink-0">{sentenceCount}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 문장 컬럼 */}
                {selectedChapter && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">
                      문장 ({currentSubjectSentences.length})
                    </div>
                    
                    {/* 문장 목록 */}
                    <div className="divide-y divide-gray-100">
                      {currentSubjectSentences.map(s => (
                        <div key={s.id} className="p-2 hover:bg-gray-50 group">
                          {editingId === s.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(s.id)}
                              />
                              <button onClick={() => handleUpdate(s.id)} className="text-blue-500 text-sm cursor-pointer">저장</button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm cursor-pointer">취소</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span 
                                className="flex-1 text-sm cursor-pointer hover:text-blue-600"
                                onClick={() => handleCopy(s.text)}
                              >
                                {s.text}
                              </span>
                              <button
                                onClick={() => handleCopy(s.text)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-500 cursor-pointer"
                                title="복사"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setEditingId(s.id); setEditText(s.text); }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 새 문장 추가 */}
                    <div className="p-3 border-t bg-gray-50">
                      <div className="text-xs text-gray-500 mb-2">
                        새 문장 추가 <span className="text-gray-400">(줄바꿈으로 구분, 최대 10개)</span>
                      </div>
                      <textarea
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="문장을 입력하세요...&#10;여러 줄을 붙여넣기하면 각 줄이 문장이 됩니다."
                        className="w-full px-2 py-2 border rounded text-sm resize-none"
                        rows={6}
                      />
                      <button
                        onClick={handleAddSentences}
                        disabled={!parseLines(newText).length}
                        className="mt-2 w-full py-1.5 bg-emerald-500 text-white text-sm rounded hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        저장 ({parseLines(newText).length}개)
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Export 모달 */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">📦 JSON 내보내기</h3>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* 행발 섹션 */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-amber-800">🏃 행발 문장</span>
                    <span className="text-sm text-amber-600">{behaviorChanges.total}개</span>
                  </div>
                  <div className="text-sm text-amber-700 mb-3">
                    {behaviorChanges.added > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">+{behaviorChanges.added}개</span>
                        <span>새로 추가됨</span>
                      </div>
                    )}
                    {behaviorChanges.modified > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">~{behaviorChanges.modified}개</span>
                        <span>수정됨</span>
                      </div>
                    )}
                    {behaviorChanges.deleted > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-red-600">-{behaviorChanges.deleted}개</span>
                        <span>삭제됨</span>
                      </div>
                    )}
                    {behaviorChanges.added === 0 && behaviorChanges.modified === 0 && behaviorChanges.deleted === 0 && (
                      <span className="text-gray-500">변경 사항 없음</span>
                    )}
                  </div>
                  <button
                    onClick={handleExportBehavior}
                    className="w-full py-2 bg-amber-500 text-white rounded hover:bg-amber-600 cursor-pointer text-sm font-medium"
                  >
                    behavior_sentence.json 다운로드
                  </button>
                </div>

                {/* 교과 섹션 */}
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-emerald-800">📚 교과 문장</span>
                    <span className="text-sm text-emerald-600">{subjectChanges.total}개</span>
                  </div>
                  <div className="text-sm text-emerald-700 mb-3">
                    {subjectChanges.added > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">+{subjectChanges.added}개</span>
                        <span>새로 추가됨</span>
                      </div>
                    )}
                    {subjectChanges.modified > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">~{subjectChanges.modified}개</span>
                        <span>수정됨</span>
                      </div>
                    )}
                    {subjectChanges.deleted > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-red-600">-{subjectChanges.deleted}개</span>
                        <span>삭제됨</span>
                      </div>
                    )}
                    {subjectChanges.added === 0 && subjectChanges.modified === 0 && subjectChanges.deleted === 0 && (
                      <span className="text-gray-500">변경 사항 없음</span>
                    )}
                  </div>
                  <button
                    onClick={handleExportSubject}
                    className="w-full py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer text-sm font-medium"
                  >
                    subject_sentence.json 다운로드
                  </button>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500 text-center">
                  다운로드한 파일을 <code className="bg-gray-200 px-1 rounded">src/data/</code> 폴더에 교체하세요
                </p>
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
  );
};

export default AdminPanel;

import React, { useState, useMemo } from 'react';
import { ChevronRight, Copy, Search } from 'lucide-react';
import Header from './Header';

// 데이터 import
import behaviorSentences from '../data/behavior_sentence.json';
import subjectSentences from '../data/subject_sentence.json';
import categoryData from '../data/category.json';
import subjectDetailData from '../data/subject_detail.json';
import subjectData from '../data/subject.json';
import chaptersData from '../data/chapters.json';
import activityTypes from '../data/activityType.json';
import activities from '../data/activity.json';
import activitySentences from '../data/activity_sentence.json';

const SentenceLibrary = () => {
  // 최상위 타입
  const [activeType, setActiveType] = useState('behavior'); // 'behavior' | 'subject' | 'activity'
  
  // 행발 선택 상태
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  
  // 교과 선택 상태
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // 창체 선택 상태
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // 검색
  const [searchQuery, setSearchQuery] = useState('');
  
  // 토스트
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 1500);
  };

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
  }, [selectedSubjectDetail]);

  // 행발: 선택된 등급의 문장들
  const currentBehaviorSentences = useMemo(() => {
    if (!selectedGrade || !selectedSubjectDetail) return [];
    let sentences;
    if (selectedGrade === 'all') {
      sentences = behaviorSentences
        .filter(s => s.subject_id_id === selectedSubjectDetail.id)
        .sort((a, b) => a.sentence_grade - b.sentence_grade);
    } else {
      sentences = behaviorSentences.filter(s => 
        s.subject_id_id === selectedSubjectDetail.id && s.sentence_grade === selectedGrade
      );
    }
    // 검색 필터 적용
    if (searchQuery) {
      sentences = sentences.filter(s => 
        s.sentence_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sentences;
  }, [selectedSubjectDetail, selectedGrade, searchQuery]);

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
    let sentences = subjectSentences.filter(s => s.chapter_id === selectedChapter.id);
    // 검색 필터 적용
    if (searchQuery) {
      sentences = sentences.filter(s => 
        s.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sentences;
  }, [selectedChapter, searchQuery]);

  // 창체: 활동 목록
  const filteredActivities = useMemo(() => {
    if (!selectedActivityType) return [];
    return activities.filter(a => a.activity_type_id === selectedActivityType.id);
  }, [selectedActivityType]);

  // 창체: 선택된 활동의 문장들
  const currentActivitySentences = useMemo(() => {
    if (!selectedActivity) return [];
    let sentences = activitySentences.filter(s => s.activity_id === selectedActivity.id);
    // 검색 필터 적용
    if (searchQuery) {
      sentences = sentences.filter(s => 
        s.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sentences;
  }, [selectedActivity, searchQuery]);

  // 타입 변경
  const handleTypeChange = (type) => {
    setActiveType(type);
    setSelectedCategory(null);
    setSelectedSubjectDetail(null);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedGradeLevel(null);
    setSelectedTextbook(null);
    setSelectedChapter(null);
    setSelectedActivityType(null);
    setSelectedActivity(null);
    setSearchQuery('');
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

  // 현재 보여줄 문장 목록
  const showSentences = activeType === 'behavior' ? selectedGrade : 
                        activeType === 'subject' ? selectedChapter : 
                        selectedActivity;

  return (
    <div className="min-h-screen bg-pgm-base font-sans">
      <Header />
      <div className="p-4">
        <div className="max-w-full mx-auto">
          {/* 필터 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">📖 문장 라이브러리</h1>
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
              <button
                onClick={() => handleTypeChange('activity')}
                className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'activity' ? 'bg-violet-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                🎯 창체
              </button>
            </div>
          </div>
          
          {/* 검색 - 문장 표시 시에만 */}
          {showSentences && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="문장 검색..."
                className="pl-9 pr-3 py-1.5 text-sm border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Finder 스타일 컬럼 뷰 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-240px)] overflow-x-auto">
            
            {activeType === 'behavior' ? (
              <>
                {/* 카테고리 컬럼 */}
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">카테고리</div>
                  {categoryData.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat); setSelectedSubjectDetail(null); setSelectedGrade(null); setSearchQuery(''); }}
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
                        onClick={() => { setSelectedSubjectDetail(sd); setSelectedGrade(null); setSearchQuery(''); }}
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
                    <div
                      onClick={() => { setSelectedGrade('all'); setSearchQuery(''); }}
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
                        onClick={() => { setSelectedGrade(g); setSearchQuery(''); }}
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
                    
                    <div className="divide-y divide-gray-100">
                      {currentBehaviorSentences.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          {searchQuery ? '검색 결과가 없습니다' : '문장이 없습니다'}
                        </div>
                      ) : (
                        currentBehaviorSentences.map(s => (
                          <div key={s.id} className="p-2 hover:bg-gray-50 group">
                            <div className="flex items-center gap-2">
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : activeType === 'subject' ? (
              <>
                {/* 과목 컬럼 */}
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">과목</div>
                  {subjectData.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { setSelectedSubject(s); setSelectedGradeLevel(null); setSelectedTextbook(null); setSelectedChapter(null); setSearchQuery(''); }}
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
                        onClick={() => { setSelectedGradeLevel(g); setSelectedTextbook(null); setSelectedChapter(null); setSearchQuery(''); }}
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
                        onClick={() => { setSelectedTextbook(tb); setSelectedChapter(null); setSearchQuery(''); }}
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
                          onClick={() => { setSelectedChapter(ch); setSearchQuery(''); }}
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
                    
                    <div className="divide-y divide-gray-100">
                      {currentSubjectSentences.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          {searchQuery ? '검색 결과가 없습니다' : '문장이 없습니다'}
                        </div>
                      ) : (
                        currentSubjectSentences.map(s => (
                          <div key={s.id} className="p-2 hover:bg-gray-50 group">
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* 창체: 활동 유형 컬럼 */}
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">활동 유형</div>
                  {activityTypes.map(type => (
                    <div
                      key={type.id}
                      onClick={() => { setSelectedActivityType(type); setSelectedActivity(null); setSearchQuery(''); }}
                      className={itemClass(selectedActivityType?.id === type.id)}
                    >
                      <span>{type.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  ))}
                </div>

                {/* 창체: 활동 컬럼 */}
                {selectedActivityType && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">활동</div>
                    {filteredActivities.map(a => {
                      const sentenceCount = activitySentences.filter(s => s.activity_id === a.id).length;
                      return (
                        <div
                          key={a.id}
                          onClick={() => { setSelectedActivity(a); setSearchQuery(''); }}
                          className={itemClass(selectedActivity?.id === a.id)}
                        >
                          <span>{a.name}</span>
                          <span className="text-xs opacity-70">{sentenceCount}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 창체: 문장 컬럼 */}
                {selectedActivity && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">
                      문장 ({currentActivitySentences.length})
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {currentActivitySentences.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          {searchQuery ? '검색 결과가 없습니다' : '문장이 없습니다'}
                        </div>
                      ) : (
                        currentActivitySentences.map(s => (
                          <div key={s.id} className="p-2 hover:bg-gray-50 group">
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

          {/* 복사 토스트 */}
          {showCopyToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
              ✓ 복사되었습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentenceLibrary;

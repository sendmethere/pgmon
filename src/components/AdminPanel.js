import React, { useState, useMemo } from 'react';
import { Trash2, Edit2, Download, X, ChevronRight, Copy, Plus } from 'lucide-react';

// 데이터 import
import initialBehaviorSentences from '../data/behavior_sentence.json';
import initialSubjectSentences from '../data/subject_sentence.json';
import initialActivitySentences from '../data/activity_sentence.json';
import initialCategoryData from '../data/category.json';
import initialSubjectDetailData from '../data/subject_detail.json';
import initialSubjectData from '../data/subject.json';
import initialChaptersData from '../data/chapters.json';
import initialActivityTypeData from '../data/activityType.json';
import initialActivityData from '../data/activity.json';

const AdminPanel = () => {
  // 문장 데이터 상태
  const [behaviorSentences, setBehaviorSentences] = useState(initialBehaviorSentences);
  const [subjectSentences, setSubjectSentences] = useState(initialSubjectSentences);
  const [activitySentences, setActivitySentences] = useState(initialActivitySentences);
  
  // 분류 데이터 상태
  const [categoryData, setCategoryData] = useState(initialCategoryData);
  const [subjectDetailData, setSubjectDetailData] = useState(initialSubjectDetailData);
  const [subjectData, setSubjectData] = useState(initialSubjectData);
  const [chaptersData, setChaptersData] = useState(initialChaptersData);
  const [activityTypeData, setActivityTypeData] = useState(initialActivityTypeData);
  const [activityData, setActivityData] = useState(initialActivityData);
  
  // 최상위 타입
  const [activeType, setActiveType] = useState('behavior');
  
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
  
  // 편집 상태
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newText, setNewText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  // 분류 추가 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemShortName, setNewItemShortName] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 1500);
  };

  // ========== 변경 사항 계산 ==========
  // 문장 변경
  const behaviorChanges = useMemo(() => {
    const initialMap = new Map(initialBehaviorSentences.map(s => [s.id, s.sentence_text]));
    const currentIds = new Set(behaviorSentences.map(s => s.id));
    return {
      added: behaviorSentences.filter(s => !initialMap.has(s.id)).length,
      deleted: initialBehaviorSentences.filter(s => !currentIds.has(s.id)).length,
      modified: behaviorSentences.filter(s => initialMap.has(s.id) && initialMap.get(s.id) !== s.sentence_text).length,
      total: behaviorSentences.length
    };
  }, [behaviorSentences]);

  const subjectChanges = useMemo(() => {
    const initialMap = new Map(initialSubjectSentences.map(s => [s.id, s.text]));
    const currentIds = new Set(subjectSentences.map(s => s.id));
    return {
      added: subjectSentences.filter(s => !initialMap.has(s.id)).length,
      deleted: initialSubjectSentences.filter(s => !currentIds.has(s.id)).length,
      modified: subjectSentences.filter(s => initialMap.has(s.id) && initialMap.get(s.id) !== s.text).length,
      total: subjectSentences.length
    };
  }, [subjectSentences]);

  const activityChanges = useMemo(() => {
    const initialMap = new Map(initialActivitySentences.map(s => [s.id, s.text]));
    const currentIds = new Set(activitySentences.map(s => s.id));
    return {
      added: activitySentences.filter(s => !initialMap.has(s.id)).length,
      deleted: initialActivitySentences.filter(s => !currentIds.has(s.id)).length,
      modified: activitySentences.filter(s => initialMap.has(s.id) && initialMap.get(s.id) !== s.text).length,
      total: activitySentences.length
    };
  }, [activitySentences]);

  // 분류 변경
  const categoryChanges = useMemo(() => {
    const initialIds = new Set(initialCategoryData.map(c => c.id));
    const currentIds = new Set(categoryData.map(c => c.id));
    return {
      added: categoryData.filter(c => !initialIds.has(c.id)).length,
      deleted: initialCategoryData.filter(c => !currentIds.has(c.id)).length,
      total: categoryData.length
    };
  }, [categoryData]);

  const subjectDetailChanges = useMemo(() => {
    const initialIds = new Set(initialSubjectDetailData.map(s => s.id));
    const currentIds = new Set(subjectDetailData.map(s => s.id));
    return {
      added: subjectDetailData.filter(s => !initialIds.has(s.id)).length,
      deleted: initialSubjectDetailData.filter(s => !currentIds.has(s.id)).length,
      total: subjectDetailData.length
    };
  }, [subjectDetailData]);

  const subjectDataChanges = useMemo(() => {
    const initialIds = new Set(initialSubjectData.map(s => s.id));
    const currentIds = new Set(subjectData.map(s => s.id));
    return {
      added: subjectData.filter(s => !initialIds.has(s.id)).length,
      deleted: initialSubjectData.filter(s => !currentIds.has(s.id)).length,
      total: subjectData.length
    };
  }, [subjectData]);

  const chaptersChanges = useMemo(() => {
    const initialIds = new Set(initialChaptersData.map(c => c.id));
    const currentIds = new Set(chaptersData.map(c => c.id));
    return {
      added: chaptersData.filter(c => !initialIds.has(c.id)).length,
      deleted: initialChaptersData.filter(c => !currentIds.has(c.id)).length,
      total: chaptersData.length
    };
  }, [chaptersData]);

  const activityTypeChanges = useMemo(() => {
    const initialIds = new Set(initialActivityTypeData.map(a => a.id));
    const currentIds = new Set(activityTypeData.map(a => a.id));
    return {
      added: activityTypeData.filter(a => !initialIds.has(a.id)).length,
      deleted: initialActivityTypeData.filter(a => !currentIds.has(a.id)).length,
      total: activityTypeData.length
    };
  }, [activityTypeData]);

  const activityDataChanges = useMemo(() => {
    const initialIds = new Set(initialActivityData.map(a => a.id));
    const currentIds = new Set(activityData.map(a => a.id));
    return {
      added: activityData.filter(a => !initialIds.has(a.id)).length,
      deleted: initialActivityData.filter(a => !currentIds.has(a.id)).length,
      total: activityData.length
    };
  }, [activityData]);

  // ========== 필터링 ==========
  const subjectDetails = useMemo(() => {
    if (!selectedCategory) return [];
    return subjectDetailData.filter(sd => sd.category_id === selectedCategory.id);
  }, [selectedCategory, subjectDetailData]);

  const behaviorByGrade = useMemo(() => {
    if (!selectedSubjectDetail) return {};
    const filtered = behaviorSentences.filter(s => s.subject_id_id === selectedSubjectDetail.id);
    return { 1: filtered.filter(s => s.sentence_grade === 1), 2: filtered.filter(s => s.sentence_grade === 2), 3: filtered.filter(s => s.sentence_grade === 3), 4: filtered.filter(s => s.sentence_grade === 4), 5: filtered.filter(s => s.sentence_grade === 5) };
  }, [selectedSubjectDetail, behaviorSentences]);

  const currentBehaviorSentences = useMemo(() => {
    if (!selectedGrade || !selectedSubjectDetail) return [];
    if (selectedGrade === 'all') {
      return behaviorSentences.filter(s => s.subject_id_id === selectedSubjectDetail.id).sort((a, b) => a.sentence_grade - b.sentence_grade);
    }
    return behaviorSentences.filter(s => s.subject_id_id === selectedSubjectDetail.id && s.sentence_grade === selectedGrade);
  }, [selectedSubjectDetail, selectedGrade, behaviorSentences]);

  const gradeLevels = useMemo(() => {
    if (!selectedSubject) return [];
    const grades = [...new Set(chaptersData.filter(ch => ch.subject_id === selectedSubject.id).map(ch => ch.grade))];
    return grades.sort((a, b) => parseInt(a) - parseInt(b));
  }, [selectedSubject, chaptersData]);

  const textbooks = useMemo(() => {
    if (!selectedSubject || !selectedGradeLevel) return [];
    return [...new Set(chaptersData.filter(ch => ch.subject_id === selectedSubject.id && ch.grade === selectedGradeLevel).map(ch => ch.textbook))];
  }, [selectedSubject, selectedGradeLevel, chaptersData]);

  const chapters = useMemo(() => {
    if (!selectedSubject || !selectedGradeLevel || !selectedTextbook) return [];
    return chaptersData.filter(ch => ch.subject_id === selectedSubject.id && ch.grade === selectedGradeLevel && ch.textbook === selectedTextbook).sort((a, b) => a.chapter_no - b.chapter_no);
  }, [selectedSubject, selectedGradeLevel, selectedTextbook, chaptersData]);

  const currentSubjectSentences = useMemo(() => {
    if (!selectedChapter) return [];
    return subjectSentences.filter(s => s.chapter_id === selectedChapter.id);
  }, [selectedChapter, subjectSentences]);

  const activities = useMemo(() => {
    if (!selectedActivityType) return [];
    return activityData.filter(a => a.activity_type_id === selectedActivityType.id);
  }, [selectedActivityType, activityData]);

  const currentActivitySentences = useMemo(() => {
    if (!selectedActivity) return [];
    return activitySentences.filter(s => s.activity_id === selectedActivity.id);
  }, [selectedActivity, activitySentences]);

  // ========== 핸들러 ==========
  const handleTypeChange = (type) => {
    setActiveType(type);
    setSelectedCategory(null); setSelectedSubjectDetail(null); setSelectedGrade(null);
    setSelectedSubject(null); setSelectedGradeLevel(null); setSelectedTextbook(null); setSelectedChapter(null);
    setSelectedActivityType(null); setSelectedActivity(null);
    setEditingId(null); setNewText('');
  };

  const parseLines = (text) => text.split('\n').map(s => s.trim()).filter(s => s !== '').slice(0, 30);

  const handleAddSentences = () => {
    const texts = parseLines(newText);
    if (texts.length === 0) return;

    if (activeType === 'behavior' && selectedSubjectDetail && selectedGrade && selectedGrade !== 'all') {
      let maxId = Math.max(...behaviorSentences.map(s => s.id), 0);
      const newItems = texts.map(text => ({ id: ++maxId, sentence_text: text, sentence_grade: selectedGrade, subject_id_id: selectedSubjectDetail.id }));
      setBehaviorSentences([...behaviorSentences, ...newItems]);
    } else if (activeType === 'subject' && selectedChapter) {
      let maxId = Math.max(...subjectSentences.map(s => s.id), 0);
      const now = new Date().toISOString().replace('T', ' ').slice(0, -1);
      const newItems = texts.map(text => ({ id: ++maxId, text, chapter_id: selectedChapter.id, score: 1, created_at: now, updated_at: now, sentence_owner_id: 1 }));
      setSubjectSentences([...subjectSentences, ...newItems]);
    } else if (activeType === 'activity' && selectedActivity) {
      let maxId = Math.max(...activitySentences.map(s => s.id), 0);
      const newItems = texts.map(text => ({ id: ++maxId, text, activity_id: selectedActivity.id }));
      setActivitySentences([...activitySentences, ...newItems]);
    }
    setNewText('');
  };

  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    if (activeType === 'behavior') {
      setBehaviorSentences(behaviorSentences.map(s => s.id === id ? { ...s, sentence_text: editText.trim() } : s));
    } else if (activeType === 'subject') {
      const now = new Date().toISOString().replace('T', ' ').slice(0, -1);
      setSubjectSentences(subjectSentences.map(s => s.id === id ? { ...s, text: editText.trim(), updated_at: now } : s));
    } else if (activeType === 'activity') {
      setActivitySentences(activitySentences.map(s => s.id === id ? { ...s, text: editText.trim() } : s));
    }
    setEditingId(null); setEditText('');
  };

  const handleDelete = (id) => {
    if (activeType === 'behavior') setBehaviorSentences(behaviorSentences.filter(s => s.id !== id));
    else if (activeType === 'subject') setSubjectSentences(subjectSentences.filter(s => s.id !== id));
    else if (activeType === 'activity') setActivitySentences(activitySentences.filter(s => s.id !== id));
  };

  // ========== 분류 추가/삭제 ==========
  const openAddModal = (type) => {
    setAddModalType(type);
    setNewItemName('');
    setNewItemShortName('');
    setShowAddModal(true);
  };

  const handleAddCategory = () => {
    if (!newItemName.trim()) return;
    
    switch (addModalType) {
      case 'category': {
        const maxId = Math.max(...categoryData.map(c => c.id), 0);
        setCategoryData([...categoryData, { id: maxId + 1, category_name: newItemName.trim() }]);
        break;
      }
      case 'subjectDetail': {
        if (!selectedCategory) return;
        const maxId = Math.max(...subjectDetailData.map(s => s.id), 0);
        setSubjectDetailData([...subjectDetailData, { 
          id: maxId + 1, 
          subject_name: newItemName.trim(),
          subject_name_short: newItemShortName.trim() || newItemName.trim(),
          category_id: selectedCategory.id 
        }]);
        break;
      }
      case 'subject': {
        const maxId = Math.max(...subjectData.map(s => s.id), 0);
        setSubjectData([...subjectData, { id: maxId + 1, name: newItemName.trim() }]);
        break;
      }
      case 'chapter': {
        if (!selectedSubject || !selectedGradeLevel || !selectedTextbook) return;
        const maxId = Math.max(...chaptersData.map(c => c.id), 0);
        const existingChapters = chaptersData.filter(c => c.subject_id === selectedSubject.id && c.grade === selectedGradeLevel && c.textbook === selectedTextbook);
        const maxChapterNo = Math.max(...existingChapters.map(c => c.chapter_no), 0);
        setChaptersData([...chaptersData, {
          id: maxId + 1,
          name: newItemName.trim(),
          chapter_no: maxChapterNo + 1,
          subject_id: selectedSubject.id,
          grade: selectedGradeLevel,
          textbook: selectedTextbook
        }]);
        break;
      }
      case 'activityType': {
        const maxId = Math.max(...activityTypeData.map(a => a.id), 0);
        setActivityTypeData([...activityTypeData, { id: maxId + 1, name: newItemName.trim(), code: newItemName.trim().toLowerCase() }]);
        break;
      }
      case 'activity': {
        if (!selectedActivityType) return;
        const maxId = Math.max(...activityData.map(a => a.id), 0);
        setActivityData([...activityData, { id: maxId + 1, name: newItemName.trim(), activity_type_id: selectedActivityType.id }]);
        break;
      }
      default:
        break;
    }
    setShowAddModal(false);
  };

  const handleDeleteCategory = (type, id) => {
    if (!window.confirm('정말 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.')) return;
    
    switch (type) {
      case 'category':
        setCategoryData(categoryData.filter(c => c.id !== id));
        if (selectedCategory?.id === id) { setSelectedCategory(null); setSelectedSubjectDetail(null); setSelectedGrade(null); }
        break;
      case 'subjectDetail':
        setSubjectDetailData(subjectDetailData.filter(s => s.id !== id));
        if (selectedSubjectDetail?.id === id) { setSelectedSubjectDetail(null); setSelectedGrade(null); }
        break;
      case 'subject':
        setSubjectData(subjectData.filter(s => s.id !== id));
        if (selectedSubject?.id === id) { setSelectedSubject(null); setSelectedGradeLevel(null); setSelectedTextbook(null); setSelectedChapter(null); }
        break;
      case 'chapter':
        setChaptersData(chaptersData.filter(c => c.id !== id));
        if (selectedChapter?.id === id) setSelectedChapter(null);
        break;
      case 'activityType':
        setActivityTypeData(activityTypeData.filter(a => a.id !== id));
        if (selectedActivityType?.id === id) { setSelectedActivityType(null); setSelectedActivity(null); }
        break;
      case 'activity':
        setActivityData(activityData.filter(a => a.id !== id));
        if (selectedActivity?.id === id) setSelectedActivity(null);
        break;
      default:
        break;
    }
  };

  // ========== JSON 내보내기 ==========
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 스타일
  const gradeColors = { 1: 'bg-green-500', 2: 'bg-blue-500', 3: 'bg-yellow-500', 4: 'bg-orange-500', 5: 'bg-red-500' };
  const columnClass = "w-48 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto";
  const itemClass = (selected) => `px-3 py-2 cursor-pointer flex items-center justify-between text-sm group ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`;

  // 분류 항목 렌더링
  const renderCategoryItem = (item, type, nameField, selected, onClick) => (
    <div key={item.id} onClick={onClick} className={itemClass(selected)}>
      <span className="truncate">{item[nameField]}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(type, item.id); }}
          className={`opacity-0 group-hover:opacity-100 ${selected ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-red-500'} cursor-pointer`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <ChevronRight className="w-4 h-4 opacity-50" />
      </div>
    </div>
  );

  // 문장 렌더링
  const renderSentenceItem = (s, textField) => (
    <div key={s.id} className="p-2 hover:bg-gray-50 group">
      {editingId === s.id ? (
        <div className="flex gap-2">
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleUpdate(s.id)} />
          <button onClick={() => handleUpdate(s.id)} className="text-blue-500 text-sm cursor-pointer">저장</button>
          <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm cursor-pointer">취소</button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {activeType === 'behavior' && selectedGrade === 'all' && (
            <span className={`w-5 h-5 flex items-center justify-center text-xs text-white rounded-full flex-shrink-0 ${gradeColors[s.sentence_grade]}`}>{s.sentence_grade}</span>
          )}
          <span className="flex-1 text-sm cursor-pointer hover:text-blue-600" onClick={() => handleCopy(s[textField])}>{s[textField]}</span>
          <button onClick={() => handleCopy(s[textField])} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-500 cursor-pointer" title="복사"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={() => { setEditingId(s.id); setEditText(s[textField]); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
          <button onClick={() => handleDelete(s.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}
    </div>
  );

  // 새 문장 추가 섹션
  const renderAddSection = (color) => (
    <div className="p-3 border-t bg-gray-50">
      <div className="text-xs text-gray-500 mb-2">새 문장 추가 <span className="text-gray-400">(줄바꿈으로 구분, 최대 30개)</span></div>
      <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="문장을 입력하세요...&#10;여러 줄을 붙여넣기하면 각 줄이 문장이 됩니다." className="w-full px-2 py-2 border rounded text-sm resize-none" rows={6} />
      <button onClick={handleAddSentences} disabled={!parseLines(newText).length} className={`mt-2 w-full py-1.5 ${color} text-white text-sm rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}>저장 ({parseLines(newText).length}개)</button>
    </div>
  );

  // 변경사항 표시
  const renderChanges = (changes, showModified = false) => (
    <div className="text-sm mb-2">
      {changes.added > 0 && <span className="text-green-600 mr-2">+{changes.added}</span>}
      {showModified && changes.modified > 0 && <span className="text-blue-600 mr-2">~{changes.modified}</span>}
      {changes.deleted > 0 && <span className="text-red-600 mr-2">-{changes.deleted}</span>}
      {changes.added === 0 && (!showModified || changes.modified === 0) && changes.deleted === 0 && <span className="text-gray-400">변경없음</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">📋 평가문장 관리</h1>
            <div className="flex gap-1">
              <button onClick={() => handleTypeChange('behavior')} className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'behavior' ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>🏃 행발</button>
              <button onClick={() => handleTypeChange('subject')} className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'subject' ? 'bg-emerald-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>📚 교과</button>
              <button onClick={() => handleTypeChange('activity')} className={`px-3 py-1.5 text-sm rounded cursor-pointer ${activeType === 'activity' ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>🎯 창체</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowExportModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 cursor-pointer"><Download className="w-4 h-4" />JSON</button>
            <a href="/app" className="text-sm text-gray-500 hover:text-gray-700">← 메인</a>
          </div>
        </div>

        {/* Finder 스타일 컬럼 뷰 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-180px)] overflow-x-auto">
            
            {/* ===== 행발 ===== */}
            {activeType === 'behavior' && (
              <>
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                    <span>카테고리</span>
                    <button onClick={() => openAddModal('category')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                  {categoryData.map(cat => renderCategoryItem(cat, 'category', 'category_name', selectedCategory?.id === cat.id, () => { setSelectedCategory(cat); setSelectedSubjectDetail(null); setSelectedGrade(null); }))}
                </div>

                {selectedCategory && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                      <span>세부영역</span>
                      <button onClick={() => openAddModal('subjectDetail')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                    </div>
                    {subjectDetails.map(sd => renderCategoryItem(sd, 'subjectDetail', 'subject_name_short', selectedSubjectDetail?.id === sd.id, () => { setSelectedSubjectDetail(sd); setSelectedGrade(null); }))}
                  </div>
                )}

                {selectedSubjectDetail && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">등급</div>
                    <div onClick={() => setSelectedGrade('all')} className={itemClass(selectedGrade === 'all')}><span>전체</span><span className="text-xs opacity-70">{Object.values(behaviorByGrade).flat().length}</span></div>
                    {[1, 2, 3, 4, 5].map(g => (
                      <div key={g} onClick={() => setSelectedGrade(g)} className={itemClass(selectedGrade === g)}>
                        <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${gradeColors[g]}`}></span><span>{g}등급</span></div>
                        <span className="text-xs opacity-70">{behaviorByGrade[g]?.length || 0}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedGrade && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">문장 ({currentBehaviorSentences.length})</div>
                    <div className="divide-y divide-gray-100">{currentBehaviorSentences.map(s => renderSentenceItem(s, 'sentence_text'))}</div>
                    {selectedGrade !== 'all' && renderAddSection('bg-amber-500')}
                  </div>
                )}
              </>
            )}

            {/* ===== 교과 ===== */}
            {activeType === 'subject' && (
              <>
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                    <span>과목</span>
                    <button onClick={() => openAddModal('subject')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                  {subjectData.map(s => renderCategoryItem(s, 'subject', 'name', selectedSubject?.id === s.id, () => { setSelectedSubject(s); setSelectedGradeLevel(null); setSelectedTextbook(null); setSelectedChapter(null); }))}
                </div>

                {selectedSubject && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">학년</div>
                    {gradeLevels.map(g => (
                      <div key={g} onClick={() => { setSelectedGradeLevel(g); setSelectedTextbook(null); setSelectedChapter(null); }} className={itemClass(selectedGradeLevel === g)}>
                        <span>{g}학년</span><ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}

                {selectedGradeLevel && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">학기</div>
                    {textbooks.map(tb => (
                      <div key={tb} onClick={() => { setSelectedTextbook(tb); setSelectedChapter(null); }} className={itemClass(selectedTextbook === tb)}>
                        <span>{tb}</span><ChevronRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                )}

                {selectedTextbook && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                      <span>단원</span>
                      <button onClick={() => openAddModal('chapter')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                    </div>
                    {chapters.map(ch => {
                      const count = subjectSentences.filter(s => s.chapter_id === ch.id).length;
                      return (
                        <div key={ch.id} onClick={() => setSelectedChapter(ch)} className={itemClass(selectedChapter?.id === ch.id)}>
                          <span className="truncate">{ch.chapter_no}. {ch.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-70">{count}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory('chapter', ch.id); }} className={`opacity-0 group-hover:opacity-100 ${selectedChapter?.id === ch.id ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-red-500'} cursor-pointer`}><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedChapter && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">문장 ({currentSubjectSentences.length})</div>
                    <div className="divide-y divide-gray-100">{currentSubjectSentences.map(s => renderSentenceItem(s, 'text'))}</div>
                    {renderAddSection('bg-emerald-500')}
                  </div>
                )}
              </>
            )}

            {/* ===== 창체 ===== */}
            {activeType === 'activity' && (
              <>
                <div className={columnClass}>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                    <span>활동유형</span>
                    <button onClick={() => openAddModal('activityType')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                  {activityTypeData.map(at => renderCategoryItem(at, 'activityType', 'name', selectedActivityType?.id === at.id, () => { setSelectedActivityType(at); setSelectedActivity(null); }))}
                </div>

                {selectedActivityType && (
                  <div className={columnClass}>
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0 flex justify-between items-center">
                      <span>활동</span>
                      <button onClick={() => openAddModal('activity')} className="text-gray-400 hover:text-blue-500 cursor-pointer"><Plus className="w-4 h-4" /></button>
                    </div>
                    {activities.map(a => {
                      const count = activitySentences.filter(s => s.activity_id === a.id).length;
                      return (
                        <div key={a.id} onClick={() => setSelectedActivity(a)} className={itemClass(selectedActivity?.id === a.id)}>
                          <span>{a.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-70">{count}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory('activity', a.id); }} className={`opacity-0 group-hover:opacity-100 ${selectedActivity?.id === a.id ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-red-500'} cursor-pointer`}><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedActivity && (
                  <div className="flex-1 min-w-80 h-full overflow-y-auto">
                    <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500 sticky top-0">문장 ({currentActivitySentences.length})</div>
                    <div className="divide-y divide-gray-100">{currentActivitySentences.map(s => renderSentenceItem(s, 'text'))}</div>
                    {renderAddSection('bg-purple-500')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 분류 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">
                  {addModalType === 'category' && '카테고리 추가'}
                  {addModalType === 'subjectDetail' && '세부영역 추가'}
                  {addModalType === 'subject' && '과목 추가'}
                  {addModalType === 'chapter' && '단원 추가'}
                  {addModalType === 'activityType' && '활동유형 추가'}
                  {addModalType === 'activity' && '활동 추가'}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="이름"
                  className="w-full px-3 py-2 border rounded text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                {addModalType === 'subjectDetail' && (
                  <input
                    type="text"
                    value={newItemShortName}
                    onChange={(e) => setNewItemShortName(e.target.value)}
                    placeholder="짧은 이름 (선택)"
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                )}
              </div>
              <div className="p-4 border-t flex gap-2 justify-end">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">취소</button>
                <button onClick={handleAddCategory} disabled={!newItemName.trim()} className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer">추가</button>
              </div>
            </div>
          </div>
        )}

        {/* Export 모달 */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
                <h3 className="font-semibold text-gray-900">📦 JSON 내보내기</h3>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-4 space-y-3">
                {/* 행발 섹션 */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="font-medium text-amber-800 mb-2">🏃 행발</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>카테고리 ({categoryChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(categoryChanges)}<button onClick={() => downloadJSON(categoryData, 'category.json')} className="text-amber-600 hover:text-amber-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>세부영역 ({subjectDetailChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(subjectDetailChanges)}<button onClick={() => downloadJSON(subjectDetailData, 'subject_detail.json')} className="text-amber-600 hover:text-amber-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>문장 ({behaviorChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(behaviorChanges, true)}<button onClick={() => downloadJSON(behaviorSentences, 'behavior_sentence.json')} className="text-amber-600 hover:text-amber-800 cursor-pointer">다운로드</button></div>
                    </div>
                  </div>
                </div>

                {/* 교과 섹션 */}
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="font-medium text-emerald-800 mb-2">📚 교과</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>과목 ({subjectDataChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(subjectDataChanges)}<button onClick={() => downloadJSON(subjectData, 'subject.json')} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>단원 ({chaptersChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(chaptersChanges)}<button onClick={() => downloadJSON(chaptersData, 'chapters.json')} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>문장 ({subjectChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(subjectChanges, true)}<button onClick={() => downloadJSON(subjectSentences, 'subject_sentence.json')} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">다운로드</button></div>
                    </div>
                  </div>
                </div>

                {/* 창체 섹션 */}
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-800 mb-2">🎯 창체</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>활동유형 ({activityTypeChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(activityTypeChanges)}<button onClick={() => downloadJSON(activityTypeData, 'activityType.json')} className="text-purple-600 hover:text-purple-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>활동 ({activityDataChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(activityDataChanges)}<button onClick={() => downloadJSON(activityData, 'activity.json')} className="text-purple-600 hover:text-purple-800 cursor-pointer">다운로드</button></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>문장 ({activityChanges.total})</span>
                      <div className="flex items-center gap-2">{renderChanges(activityChanges, true)}<button onClick={() => downloadJSON(activitySentences, 'activity_sentence.json')} className="text-purple-600 hover:text-purple-800 cursor-pointer">다운로드</button></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-500 text-center">다운로드한 파일을 <code className="bg-gray-200 px-1 rounded">src/data/</code> 폴더에 교체하세요</p>
              </div>
            </div>
          </div>
        )}

        {/* 복사 토스트 */}
        {showCopyToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">✓ 복사되었습니다</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

import React from 'react';
import { Target } from 'lucide-react';
import { useEvaluationStore } from '../store/evaluationStore';

const SubjectSelector = () => {
  const { categories, selectedSubjects, selectSubject, removeSubject } = useEvaluationStore();
  
  const handleSubjectToggle = (subject) => {
    const isSelected = selectedSubjects.some(s => s.id === subject.id);
    if (isSelected) {
      removeSubject(subject.id);
    } else {
      selectSubject(subject);
    }
  };
  
  return (
    <div className="h-fit">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-pgm-primary text-white rounded-full text-sm font-semibold">
          2
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">평가 영역 선택</h2>
          <p className="text-xs text-gray-600">최대 15개까지 선택 가능</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* 선택된 평가 영역 수만 표시 */}
        {selectedSubjects.length > 0 && (
          <p className="text-sm text-gray-600 mb-2">
            선택된 평가 영역: {selectedSubjects.length}/15
          </p>
        )}
        
        {/* 카테고리별 과목 선택 */}
        <div>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id}>
                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{category.category_name}</span>
                </h3>
                <div className="flex flex-wrap gap-2 pb-2">
                  {category.subjects.map((subject) => {
                    const isSelected = selectedSubjects.some(s => s.id === subject.id);
                    const isDisabled = !isSelected && selectedSubjects.length >= 15;
                    
                    return (
                      <button
                        key={subject.id}
                        onClick={() => !isDisabled && handleSubjectToggle(subject)}
                        disabled={isDisabled}
                        className={`px-2 py-1 rounded-full border text-xs transition-all ${
                          isSelected
                            ? 'border-pgm-primary bg-pgm-primary text-white'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-pgm-primary hover:bg-pgm-primary/5'
                        }`}
                        title={subject.subject_name}
                      >
                        {subject.subject_name_short}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
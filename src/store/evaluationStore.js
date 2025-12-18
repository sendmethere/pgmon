import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as XLSX from 'xlsx';
import categoryData from '../data/category.json';
import subjectDetailData from '../data/subject_detail.json';
import behaviorSentenceData from '../data/behavior_sentence.json';

export const useEvaluationStore = create(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      students: [],
      selectedSubjects: [],
      evaluationResults: [],
      categories: categoryData.map(category => ({
        ...category,
        subjects: subjectDetailData.filter(subject => subject.category_id === category.id)
      })),
      isLoading: false,
      
      // Actions
      addStudent: (name = '') => {
        set((state) => {
          const newStudent = {
            id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            scores: {}
          };
          return {
            students: [...state.students, newStudent]
          };
        });
      },
      
      addMultipleStudents: (count, names = []) => {
        set((state) => {
          const newStudents = [];
          for (let i = 0; i < count && i < 50; i++) {
            newStudents.push({
              id: `student_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              name: names[i] || '',
              scores: {}
            });
          }
          return {
            students: [...state.students, ...newStudents]
          };
        });
      },
      
      removeStudent: (id) => {
        set((state) => ({
          students: state.students.filter(student => student.id !== id)
        }));
      },
      
      updateStudentName: (id, name) => {
        set((state) => ({
          students: state.students.map(student =>
            student.id === id ? { ...student, name } : student
          )
        }));
      },
      
      updateStudentScore: (studentId, subjectId, score) => {
        set((state) => ({
          students: state.students.map(student =>
            student.id === studentId 
              ? { 
                  ...student, 
                  scores: { 
                    ...student.scores, 
                    [subjectId]: score === 0 ? undefined : score 
                  } 
                }
              : student
          )
        }));
      },
      
      selectSubject: (subject) => {
        set((state) => {
          if (state.selectedSubjects.length >= 15) return state;
          if (state.selectedSubjects.some(s => s.id === subject.id)) return state;
          
          return {
            selectedSubjects: [...state.selectedSubjects, subject]
          };
        });
      },
      
      removeSubject: (subjectId) => {
        set((state) => ({
          selectedSubjects: state.selectedSubjects.filter(s => s.id !== subjectId),
          students: state.students.map(student => ({
            ...student,
            scores: Object.fromEntries(
              Object.entries(student.scores).filter(([id]) => parseInt(id) !== subjectId)
            )
          }))
        }));
      },
      
      generateEvaluations: () => {
        const { students, selectedSubjects } = get();
        set({ isLoading: true });
        
        setTimeout(() => {
          const results = students.map(student => {
            // Generate sentences based on scores
            const sentences = [];
            
            selectedSubjects.forEach(subject => {
              const score = student.scores[subject.id] || 0;
              if (score > 0 && score <= 5) {
                const subjectSentences = behaviorSentenceData.filter(
                  sentence => sentence.subject_id_id === subject.id && sentence.sentence_grade === score
                );
                if (subjectSentences.length > 0) {
                  const randomSentence = subjectSentences[Math.floor(Math.random() * subjectSentences.length)];
                  sentences.push(randomSentence.sentence_text);
                }
              }
            });
            
            return {
              studentId: student.id,
              studentName: student.name || '이름없음',
              sentence: sentences.join(' ')
            };
          });
          
          set({
            evaluationResults: results,
            isLoading: false
          });
        }, 1000);
      },
      
      clearResults: () => {
        set({ evaluationResults: [] });
      },
      
      resetAll: () => {
        set({
          students: [],
          selectedSubjects: [],
          evaluationResults: []
        });
      },
      
      importStudentsFromExcel: (studentsData) => {
        set((state) => {
          const newStudents = studentsData.map((data, index) => ({
            id: `imported_${Date.now()}_${index}`,
            name: data.name || '',
            scores: {}
          }));
          
          return {
            students: newStudents
          };
        });
      },
      
      updateResultSentence: (studentId, newSentence) => {
        set((state) => ({
          evaluationResults: state.evaluationResults.map(result =>
            result.studentId === studentId
              ? { ...result, sentence: newSentence }
              : result
          )
        }));
      },
      
      exportToExcel: () => {
        const { evaluationResults } = get();
        
        // 데이터 준비
        const data = [
          ['번호', '이름', '평가 문장'],
          ...evaluationResults.map((result, index) => [
            index + 1,
            result.studentName,
            result.sentence
          ])
        ];
        
        // 워크시트 생성
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // 열 너비 설정
        ws['!cols'] = [
          { wch: 6 },   // 번호
          { wch: 12 },  // 이름
          { wch: 100 }  // 평가 문장
        ];
        
        // 워크북 생성
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '행발 평가');
        
        // 파일 다운로드
        XLSX.writeFile(wb, '평가몬-행발-결과.xlsx');
      }
      }),
      {
        name: 'pgm-evaluation-store',
        partialize: (state) => ({
          students: state.students,
          selectedSubjects: state.selectedSubjects,
          evaluationResults: state.evaluationResults
        })
      }
    ),
    {
      name: 'evaluation-store'
    }
  )
);
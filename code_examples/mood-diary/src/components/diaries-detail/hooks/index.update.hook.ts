import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 수정 폼 스키마 정의
 */
const updateDiarySchema = z.object({
  emotion: z.nativeEnum(EmotionType),
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: '제목을 입력해주세요.'
    }),
  content: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: '내용을 입력해주세요.'
    })
});

/**
 * 일기 수정 폼 타입
 */
export type UpdateDiaryFormData = z.infer<typeof updateDiarySchema>;

/**
 * 일기 데이터 인터페이스
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 수정 훅 반환 타입
 */
export interface UseUpdateReturn {
  // 수정 모드 상태
  isEditMode: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  
  // 폼 관련
  register: ReturnType<typeof useForm<UpdateDiaryFormData>>['register'];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isValid: boolean;
  errors: ReturnType<typeof useForm<UpdateDiaryFormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<UpdateDiaryFormData>>['watch'];
  setValue: ReturnType<typeof useForm<UpdateDiaryFormData>>['setValue'];
}

/**
 * 일기 수정 훅
 * 
 * react-hook-form과 zod를 사용하여 일기 수정 폼을 관리하고
 * 로컬스토리지의 데이터를 업데이트하는 훅
 * 
 * @param diaryId - 수정할 일기 ID
 * @param currentDiary - 현재 일기 데이터
 * @returns 수정 모드 상태 및 폼 관리 함수
 */
export const useUpdate = (
  diaryId: string,
  currentDiary: DiaryData | null
): UseUpdateReturn => {
  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // react-hook-form 설정
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm<UpdateDiaryFormData>({
    resolver: zodResolver(updateDiarySchema),
    mode: 'onChange',
    defaultValues: {
      emotion: currentDiary?.emotion || EmotionType.HAPPY,
      title: currentDiary?.title || '',
      content: currentDiary?.content || ''
    }
  });

  /**
   * 수정 모드 시작
   */
  const startEdit = () => {
    if (!currentDiary) {
      return;
    }

    // 현재 일기 데이터로 폼 초기화
    setValue('emotion', currentDiary.emotion);
    setValue('title', currentDiary.title);
    setValue('content', currentDiary.content);
    
    setIsEditMode(true);
  };

  /**
   * 수정 모드 취소
   */
  const cancelEdit = () => {
    // 폼 초기화
    if (currentDiary) {
      reset({
        emotion: currentDiary.emotion,
        title: currentDiary.title,
        content: currentDiary.content
      });
    }
    
    setIsEditMode(false);
  };

  /**
   * 로컬스토리지에서 기존 일기 목록 조회
   */
  const getExistingDiaries = (): DiaryData[] => {
    try {
      const data = localStorage.getItem('diaries');
      if (!data) {
        return [];
      }
      
      const diaries = JSON.parse(data);
      if (!Array.isArray(diaries)) {
        return [];
      }
      
      return diaries;
    } catch (error) {
      console.error('일기 데이터 조회 중 오류:', error);
      return [];
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = hookFormHandleSubmit(async (data: UpdateDiaryFormData) => {
    try {
      if (!currentDiary) {
        throw new Error('수정할 일기 데이터가 없습니다.');
      }

      // 기존 일기 목록 조회
      const existingDiaries = getExistingDiaries();
      
      // 현재 일기 ID와 일치하는 일기 찾아서 업데이트
      const targetId = parseInt(diaryId, 10);
      const updatedDiaries = existingDiaries.map(diary => {
        if (diary.id === targetId) {
          return {
            ...diary,
            emotion: data.emotion,
            title: data.title,
            content: data.content
          };
        }
        return diary;
      });
      
      // 로컬스토리지에 저장
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      
      // 수정 모드 종료
      setIsEditMode(false);
      
      // 로컬스토리지 저장 완료를 보장하기 위한 짧은 지연
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('일기 수정 중 오류:', error);
      alert('일기 수정 중 오류가 발생했습니다.');
    }
  });

  return {
    isEditMode,
    startEdit,
    cancelEdit,
    register,
    handleSubmit,
    isValid,
    errors,
    watch,
    setValue
  };
};


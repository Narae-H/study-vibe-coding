import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * 회고 폼 스키마 정의
 */
const retrospectFormSchema = z.object({
  content: z
    .string()
    .min(1, '회고 내용을 입력해주세요.')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: '회고 내용을 입력해주세요.'
    })
});

/**
 * 회고 폼 타입
 */
export type RetrospectFormData = z.infer<typeof retrospectFormSchema>;

/**
 * 로컬스토리지에 저장될 회고 데이터 인터페이스
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 훅 반환 타입
 */
export interface UseRetrospectFormReturn {
  register: ReturnType<typeof useForm<RetrospectFormData>>['register'];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isValid: boolean;
  errors: ReturnType<typeof useForm<RetrospectFormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<RetrospectFormData>>['watch'];
}

/**
 * 회고 폼 등록 훅
 * 
 * react-hook-form과 zod를 사용하여 회고 폼을 관리하고
 * 로컬스토리지에 데이터를 저장하는 훅
 * 
 * @param diaryId - 연결할 일기 ID
 * @returns 폼 관리 함수 및 상태
 */
export const useRetrospectForm = (diaryId: string): UseRetrospectFormReturn => {
  // react-hook-form 설정
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    mode: 'onChange',
    defaultValues: {
      content: ''
    }
  });

  /**
   * 로컬스토리지에서 기존 회고 데이터 조회
   */
  const getExistingRetrospects = (): RetrospectData[] => {
    try {
      const data = localStorage.getItem('retrospects');
      if (!data) {
        return [];
      }
      
      const retrospects = JSON.parse(data);
      if (!Array.isArray(retrospects)) {
        return [];
      }
      
      return retrospects;
    } catch (error) {
      console.error('회고 데이터 조회 중 오류:', error);
      return [];
    }
  };

  /**
   * 다음 회고 ID 생성
   * 기존 회고가 있으면 가장 큰 ID + 1, 없으면 1
   */
  const getNextId = (retrospects: RetrospectData[]): number => {
    if (retrospects.length === 0) {
      return 1;
    }
    
    const maxId = Math.max(...retrospects.map(r => r.id));
    return maxId + 1;
  };

  /**
   * 현재 날짜를 'YYYY. MM. DD' 형식으로 반환
   */
  const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}. ${month}. ${day}`;
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = hookFormHandleSubmit(async (data: RetrospectFormData) => {
    try {
      // 기존 회고 데이터 조회
      const existingRetrospects = getExistingRetrospects();
      
      // 새 회고 데이터 생성
      const newRetrospect: RetrospectData = {
        id: getNextId(existingRetrospects),
        content: data.content,
        diaryId: parseInt(diaryId, 10),
        createdAt: getCurrentDate()
      };
      
      // 기존 배열에 추가
      const updatedRetrospects = [...existingRetrospects, newRetrospect];
      
      // 로컬스토리지에 저장
      localStorage.setItem('retrospects', JSON.stringify(updatedRetrospects));
      
      // 폼 초기화
      reset();
      
      // 로컬스토리지 저장 완료를 보장하기 위한 짧은 지연
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('회고 등록 중 오류:', error);
      alert('회고 등록 중 오류가 발생했습니다.');
    }
  });

  return {
    register,
    handleSubmit,
    isValid,
    errors,
    watch
  };
};


'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmotionType } from '@/commons/constants/enum';
import { URL_PATH } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';

// 폼 값 타입
export interface DiaryFormValues {
  emotion: EmotionType;
  title: string;
  content: string;
}

// zod 스키마 정의
const diaryFormSchema = z.object({
  emotion: z.nativeEnum(EmotionType),
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.'),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해주세요.'),
});

// 로컬스토리지 키
const DIARIES_STORAGE_KEY = 'diaries';

/**
 * 안전한 로컬스토리지 읽기
 */
const readDiariesFromStorage = (): Array<unknown> | null => {
  try {
    const raw = window.localStorage.getItem(DIARIES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * 안전한 로컬스토리지 쓰기
 */
const writeDiariesToStorage = (diaries: Array<unknown>): void => {
  window.localStorage.setItem(DIARIES_STORAGE_KEY, JSON.stringify(diaries));
};

/**
 * 신규 ID 생성 (가장 큰 id + 1, 없으면 1)
 */
const generateNextDiaryId = (existing: Array<unknown> | null): number => {
  if (!existing || existing.length === 0) return 1;
  const maxId = existing.reduce((max: number, item: unknown) => {
    const record = item as Record<string, unknown>;
    const idNum = typeof record?.id === 'number' ? record.id : Number(record?.id);
    return Number.isFinite(idNum) && idNum > max ? idNum : max;
  }, 0);
  return maxId + 1;
};

/**
 * 일기쓰기 폼 훅
 * - react-hook-form + zod 검증
 * - 로컬스토리지에 일기 저장
 * - 저장 성공 모달 노출 후 상세 페이지로 이동 및 모든 모달 닫기
 */
export const useDiaryForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  const defaultValues = useMemo<DiaryFormValues>(() => ({
    emotion: EmotionType.HAPPY,
    title: '',
    content: '',
  }), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isSubmitting, errors },
  } = useForm<DiaryFormValues>({
    resolver: zodResolver(diaryFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const onValidSubmit = useCallback((values: DiaryFormValues) => {
    const existing = readDiariesFromStorage();
    const nextId = generateNextDiaryId(existing);

    const nextDiary = {
      id: nextId,
      title: values.title,
      content: values.content,
      emotion: values.emotion,
      createdAt: new Date().toISOString(),
    };

    const nextList = existing ? [...existing, nextDiary] : [nextDiary];
    writeDiariesToStorage(nextList);

    // 등록 완료 모달 노출
    openModal(
      <div data-testid="submit-success-modal">
        <Modal
          variant="info"
          actions="single"
          theme="light"
          title="등록이 완료되었습니다."
          description="작성한 일기가 등록되었어요."
          primaryButtonText="확인"
          onPrimaryClick={() => {
            // 상세 페이지 이동 후 모든 모달 닫기
            router.push(URL_PATH.DIARIES.DETAIL(nextId));
            closeAllModals();
          }}
        />
      </div>
    );
  }, [openModal, closeAllModals, router]);

  // onClick에 바로 연결 가능한 제출 핸들러
  const onSubmit = useMemo(() => handleSubmit(onValidSubmit), [handleSubmit, onValidSubmit]);

  // 라디오 선택 헬퍼 (감정 선택)
  const handleEmotionSelect = useCallback((emotion: EmotionType) => {
    setValue('emotion', emotion, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  }, [setValue]);

  const selectedEmotion = watch('emotion');

  return {
    register,
    errors,
    isValid,
    isSubmitting,
    onSubmit,
    handleEmotionSelect,
    selectedEmotion,
  } as const;
};

export default useDiaryForm;



'use client';

import React from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';
import { useLinkModalClose } from './hooks/index.link.modal.close.hook';
import { useDiaryForm } from './hooks/index.form.hook';

/**
 * 일기 작성 페이지 컴포넌트
 * 
 * 피그마 디자인을 기반으로 구현된 일기 작성 폼
 * - 감정 선택 (라디오 버튼)
 * - 제목 입력
 * - 내용 입력
 * - 닫기/등록하기 버튼
 */
const DiariesNew: React.FC = () => {
  // 닫기 모달 훅 사용
  const { handleLinkModalClose } = useLinkModalClose();
  
  // 폼 훅 사용
  const {
    register,
    isValid,
    isSubmitting,
    onSubmit,
    handleEmotionSelect,
    selectedEmotion,
  } = useDiaryForm();

  /**
   * 감정 선택 핸들러
   */
  const handleEmotionChange = (emotion: EmotionType) => {
    handleEmotionSelect(emotion);
  };

  /**
   * 등록하기 버튼 핸들러
   */
  const handleSubmit = onSubmit;

  return (
    <div className={styles.wrapper}>
      {/* header: full * 24 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기 쓰기</h1>
      </div>

      {/* gap: full * 24 (피그마: header와 emotion-box 사이) */}
      <div className={styles.gap24}></div>

      {/* emotion-box: full * 204 (피그마: 기분 선택 영역) */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionRadioGroup}>
          {Object.entries(EMOTION_DATA).map(([key, data]) => {
            const emotionType = key as EmotionType;
            return (
              <label key={emotionType} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="emotion"
                  value={emotionType}
                  checked={selectedEmotion === emotionType}
                  onChange={() => handleEmotionChange(emotionType)}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{data.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* gap: full * 24 (피그마: emotion-box와 텍스트 영역 사이) */}
      <div className={styles.gap24}></div>

      {/* input-title: full * 64 (피그마: Frame 64) */}
      <div className={styles.inputTitle}>
        <label className={styles.inputLabel}>제목</label>
        <Input
          variant="primary"
          theme="light"
          size="medium"
          placeholder="제목을 입력합니다."
          {...register('title')}
        />
      </div>

      {/* gap: full * 16 (피그마: Frame 64와 Frame 65 사이) */}
      <div className={styles.gap16}></div>

      {/* input-content: full * 152 (피그마: Frame 65) */}
      <div className={styles.inputContent}>
        <label className={styles.inputLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          {...register('content')}
          className={styles.contentTextarea}
        />
      </div>

      {/* gap: full * 24 (피그마: 텍스트 영역과 버튼 영역 사이) */}
      <div className={styles.gap24}></div>

      {/* footer: full * 40 (피그마: 버튼 영역) */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          theme="light"
          size="large"
          onClick={handleLinkModalClose}
          className={styles.footerButton}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="large"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={styles.footerButton}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default DiariesNew;

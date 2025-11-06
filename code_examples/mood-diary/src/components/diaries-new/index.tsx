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

      {/* gap: full * 40 */}
      <div className={styles.gap40}></div>

      {/* emotion-box: full * 64 */}
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

      {/* gap: full * 40 */}
      <div className={styles.gap40}></div>

      {/* input-title: full * 76 */}
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

      {/* gap: full * 24 */}
      <div className={styles.gap24}></div>

      {/* input-content: full * 156 */}
      <div className={styles.inputContent}>
        <label className={styles.inputLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          {...register('content')}
          className={styles.contentTextarea}
        />
      </div>

      {/* gap: full * 40 */}
      <div className={styles.gap40}></div>

      {/* footer: full * 48 */}
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

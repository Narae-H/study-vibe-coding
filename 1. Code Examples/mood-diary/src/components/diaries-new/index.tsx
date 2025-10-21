'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { Input } from '../../commons/components/input';
import { Button } from '../../commons/components/button';
import { EmotionType, EMOTION_DATA } from '../../commons/constants/enum';

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
  // 선택된 감정 상태
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(EmotionType.HAPPY);
  // 제목 입력 상태
  const [title, setTitle] = useState('');
  // 내용 입력 상태
  const [content, setContent] = useState('');

  /**
   * 감정 선택 핸들러
   */
  const handleEmotionChange = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  /**
   * 닫기 버튼 핸들러
   */
  const handleClose = () => {
    // 닫기 로직 구현
    console.log('닫기 버튼 클릭');
  };

  /**
   * 등록하기 버튼 핸들러
   */
  const handleSubmit = () => {
    // 등록 로직 구현
    console.log('등록하기 버튼 클릭', {
      emotion: selectedEmotion,
      title,
      content
    });
  };

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* gap: full * 24 */}
      <div className={styles.gap24}></div>

      {/* input-content: full * 156 */}
      <div className={styles.inputContent}>
        <label className={styles.inputLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
          onClick={handleClose}
          className={styles.footerButton}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="large"
          onClick={handleSubmit}
          className={styles.footerButton}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default DiariesNew;

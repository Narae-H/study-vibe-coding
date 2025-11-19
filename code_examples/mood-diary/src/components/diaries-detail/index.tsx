'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';
import { useBinding } from './hooks/index.binding.hook';
import { useRetrospectForm } from './hooks/index.retrospect.form.hook';
import { useRetrospectBinding } from './hooks/index.retrospect.binding.hook';
import { useUpdate } from './hooks/index.update.hook';
import styles from './styles.module.css';

/**
 * 컴포넌트 Props 인터페이스
 */
interface DiariesDetailProps {
  id: string;
}

/**
 * 일기 상세 데이터 인터페이스
 */
interface DiaryDetailData {
  id: string;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 컴포넌트 설정 객체 - @01-common.mdc 룰 적용
 */
const COMPONENT_CONFIG = {
  // Mock 데이터 그룹화
  mockData: {
    id: '1',
    title: '이것은 타이틀 입니다.',
    content: '내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다',
    emotion: EmotionType.HAPPY,
    createdAt: '2024. 07. 12'
  } as DiaryDetailData,
  
  // 버튼 설정 그룹화
  buttonProps: {
    edit: {
      variant: 'secondary' as const,
      size: 'medium' as const,
      theme: 'light' as const
    },
    delete: {
      variant: 'secondary' as const,
      size: 'medium' as const,
      theme: 'light' as const
    },
    retrospectSubmit: {
      variant: 'primary' as const,
      size: 'large' as const,
      theme: 'light' as const
    }
  },
  
  // Input 설정 그룹화
  inputProps: {
    retrospect: {
      variant: 'primary' as const,
      size: 'medium' as const,
      theme: 'light' as const
    }
  },
  
  // 아이콘 경로 그룹화
  icons: {
    copy: '/icons/copy_outline_light_m.svg'
  },
  
  // 텍스트 라벨 그룹화
  labels: {
    content: '내용',
    copyButton: '내용 복사',
    editButton: '수정',
    deleteButton: '삭제',
    dateLabel: '작성',
    retrospectLabel: '회고',
    retrospectPlaceholder: '회고를 남겨보세요.',
    retrospectSubmit: '입력'
  }
} as const;

/**
 * 일기 상세 페이지 컴포넌트
 * Figma 디자인을 기반으로 구현된 UI - @01-common.mdc 룰 적용
 */
const DiariesDetail: React.FC<DiariesDetailProps> = ({ id }) => {
  // 실제 데이터 바인딩
  const { diary } = useBinding(id);
  
  // 회고 폼 훅
  const { 
    register: registerRetrospect, 
    handleSubmit: handleRetrospectSubmit, 
    isValid: isRetrospectValid, 
    watch: watchRetrospect 
  } = useRetrospectForm(id);
  
  // 회고 목록 바인딩
  const { retrospects } = useRetrospectBinding(id);
  
  // 수정 기능 훅
  const {
    isEditMode,
    startEdit,
    cancelEdit,
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    isValid: isUpdateValid,
    watch: watchUpdate
  } = useUpdate(id, diary);
  
  // 구조화된 데이터 사용
  const { buttonProps, inputProps, icons, labels } = COMPONENT_CONFIG;
  
  // 실제 데이터가 있으면 사용, 없으면 기본값 사용
  const currentData = diary || {
    id: '',
    title: '',
    content: '',
    emotion: EmotionType.HAPPY,
    createdAt: ''
  };
  
  const emotionData = EMOTION_DATA[currentData.emotion];
  
  // 회고 입력 상태 관리 (watch를 통해 실시간 값 확인)
  const retrospectInput = watchRetrospect('content') || '';
  
  // 수정 폼 데이터 상태 관리
  const updateTitle = watchUpdate('title') || '';
  const updateContent = watchUpdate('content') || '';

  /**
   * 내용 복사 핸들러
   */
  const handleCopyContent = () => {
    if (currentData.content) {
      navigator.clipboard.writeText(currentData.content);
      // TODO: 복사 완료 알림 추가
    }
  };

  /**
   * 수정 버튼 핸들러
   */
  const handleEdit = () => {
    startEdit();
  };

  /**
   * 삭제 버튼 핸들러
   */
  const handleDelete = () => {
    // TODO: 삭제 확인 모달 표시
    console.log('삭제 버튼 클릭');
  };

  return (
    <div className={styles.container} data-testid="diary-detail-container">
      {/* 64px gap */}
      <div className={styles.gap64}></div>
      
      {/* 수정 모드일 때 수정 UI 표시 (Figma 3:1224) */}
      {isEditMode && (
        <form className={styles.editModeContainer} onSubmit={handleUpdateSubmit} data-testid="edit-mode-container">
          {/* 기분 선택 영역 */}
          <div className={styles.emotionSelectionArea}>
            <h2 className={styles.emotionSelectionLabel}>오늘 기분은 어땟나요?</h2>
            <div className={styles.emotionRadioGroup} data-testid="emotion-radio-group">
              {Object.values(EmotionType).map((emotionType) => {
                const emotion = EMOTION_DATA[emotionType];
                return (
                  <label key={emotionType} className={styles.radioLabel}>
                    <input
                      type="radio"
                      value={emotionType}
                      {...registerUpdate('emotion')}
                      className={styles.radioInput}
                      data-testid={`emotion-radio-${emotionType}`}
                    />
                    <span className={styles.radioText}>{emotion.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 24px gap */}
          <div className={styles.gap24}></div>

          {/* 제목 입력 */}
          <div className={styles.editFieldWrapper}>
            <label className={styles.editFieldLabel}>제목</label>
            <input
              type="text"
              {...registerUpdate('title')}
              className={styles.editTitleInput}
              data-testid="edit-title-input"
            />
          </div>

          {/* 24px gap */}
          <div className={styles.gap24}></div>

          {/* 내용 입력 */}
          <div className={styles.editFieldWrapper}>
            <label className={styles.editFieldLabel}>내용</label>
            <textarea
              {...registerUpdate('content')}
              className={styles.editContentTextarea}
              data-testid="edit-content-textarea"
            />
          </div>

          {/* 24px gap */}
          <div className={styles.gap24}></div>

          {/* 버튼 영역 */}
          <div className={styles.editButtonArea}>
            <Button
              variant="secondary"
              size="large"
              theme="light"
              type="button"
              onClick={cancelEdit}
              className={styles.cancelButton}
              data-testid="cancel-button"
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="large"
              theme="light"
              type="submit"
              disabled={!isUpdateValid || !updateTitle.trim() || !updateContent.trim()}
              className={styles.updateButton}
              data-testid="update-button"
            >
              수정 하기
            </Button>
          </div>
        </form>
      )}

      {/* 일반 모드일 때 일기 상세 영역 (Figma 3:1124) */}
      {!isEditMode && (
        <div className={styles.diaryDetailWrapper}>
        {/* detail-title: 1168 * 84 */}
        <div className={styles.detailTitle}>
          <div className={styles.titleSection}>
            <h1 className={styles.title} data-testid="diary-title">{currentData.title || '제목 없음'}</h1>
          </div>
          <div className={styles.emotionAndDate}>
            <div className={styles.emotionInfo}>
              <Image
                src={emotionData.imageSmall}
                alt={emotionData.label}
                width={32}
                height={32}
                className={styles.emotionIcon}
                data-testid="diary-emotion-icon"
              />
              <span className={styles.emotionText} data-testid="diary-emotion-text">{emotionData.label}</span>
            </div>
            <div className={styles.dateInfo}>
              <span className={styles.dateText} data-testid="diary-created-at">{currentData.createdAt || '날짜 없음'}</span>
              <span className={styles.dateLabel}>{labels.dateLabel}</span>
            </div>
          </div>
        </div>
        
        {/* 24px gap */}
        <div className={styles.gap24}></div>
        
        {/* detail-content: 1168 * 169 */}
        <div className={styles.detailContent}>
          <div className={styles.contentArea}>
            <h2 className={styles.contentLabel}>{labels.content}</h2>
            <p className={styles.contentText} data-testid="diary-content">{currentData.content || '내용이 없습니다.'}</p>
          </div>
          <div className={styles.copyButtonArea}>
            <button 
              className={styles.copyButton}
              onClick={handleCopyContent}
            >
              <Image
                src={icons.copy}
                alt="복사"
                width={24}
                height={24}
              />
              <span className={styles.copyButtonText}>{labels.copyButton}</span>
            </button>
          </div>
        </div>
        
        {/* 24px gap */}
        <div className={styles.gap24}></div>
        
        {/* detail-footer: 1168 * 56 */}
        <div className={styles.detailFooter}>
          <div className={styles.buttonGroup}>
            <Button
              {...buttonProps.edit}
              onClick={handleEdit}
              className={styles.editButton}
              data-testid="edit-button"
            >
              {labels.editButton}
            </Button>
            <Button
              {...buttonProps.delete}
              onClick={handleDelete}
              className={styles.deleteButton}
            >
              {labels.deleteButton}
            </Button>
          </div>
        </div>
        </div>
      )}
      
      {/* 24px gap */}
      <div className={styles.gap24}></div>
      
      {/* retrospect-input: 1168 * 85 - 수정중일 때 비활성화 (Figma 3:1249) */}
      <form className={styles.retrospectInput} onSubmit={handleRetrospectSubmit}>
        <h2 className={styles.retrospectLabel}>{labels.retrospectLabel}</h2>
        <div className={styles.retrospectInputArea}>
          {isEditMode ? (
            <>
              {/* 수정중일 때 비활성화된 입력창 */}
              <div className={styles.retrospectDisabledInput}>
                <span className={styles.retrospectDisabledMessage} data-testid="retrospect-disabled-message">
                  수정중일땐 회고를 작성할 수 없어요.
                </span>
              </div>
              <Button
                {...buttonProps.retrospectSubmit}
                type="button"
                disabled={true}
                className={styles.retrospectSubmitButton}
                data-testid="retrospect-submit-button"
              >
                {labels.retrospectSubmit}
              </Button>
            </>
          ) : (
            <>
              <Input
                {...inputProps.retrospect}
                {...registerRetrospect('content')}
                placeholder={labels.retrospectPlaceholder}
                className={styles.retrospectInputField}
                data-testid="retrospect-input"
              />
              <Button
                {...buttonProps.retrospectSubmit}
                type="submit"
                disabled={!isRetrospectValid || !retrospectInput.trim()}
                className={styles.retrospectSubmitButton}
                data-testid="retrospect-submit-button"
              >
                {labels.retrospectSubmit}
              </Button>
            </>
          )}
        </div>
      </form>
      
      {/* 16px gap */}
      <div className={styles.gap16}></div>
      
      {/* retrospect-list: 1168 * auto */}
      <div className={styles.retrospectList}>
        {retrospects.map((retrospect, index) => (
          <div key={retrospect.id} data-testid="retrospect-item">
            <div className={styles.retrospectItem}>
              <span className={styles.retrospectContent} data-testid="retrospect-content">{retrospect.content}</span>
              <span className={styles.retrospectDate} data-testid="retrospect-date">[{retrospect.createdAt}]</span>
            </div>
            {index < retrospects.length - 1 && <div className={styles.retrospectDivider}></div>}
          </div>
        ))}
      </div>
      
      {/* 64px gap */}
      <div className={styles.gap64}></div>
    </div>
  );
};

export default DiariesDetail;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';
import styles from './styles.module.css';

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
 * 회고 데이터 인터페이스
 */
interface RetrospectData {
  id: string;
  content: string;
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
  
  // Mock 회고 데이터 그룹화
  mockRetrospects: [
    {
      id: '1',
      content: '3년이 지나고 다시 보니 이때가 그립다.',
      createdAt: '2024. 09. 24'
    },
    {
      id: '2', 
      content: '3년이 지나고 다시 보니 이때가 그립다.',
      createdAt: '2024. 09. 24'
    }
  ] as RetrospectData[],
  
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
      size: 'medium' as const,
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
const DiariesDetail: React.FC = () => {
  // 구조화된 데이터 사용
  const { mockData, mockRetrospects, buttonProps, inputProps, icons, labels } = COMPONENT_CONFIG;
  const emotionData = EMOTION_DATA[mockData.emotion];
  
  // 회고 입력 상태 관리
  const [retrospectInput, setRetrospectInput] = useState<string>('');
  const [retrospects, setRetrospects] = useState<RetrospectData[]>(mockRetrospects);

  /**
   * 내용 복사 핸들러
   */
  const handleCopyContent = () => {
    navigator.clipboard.writeText(mockData.content);
    // TODO: 복사 완료 알림 추가
  };

  /**
   * 수정 버튼 핸들러
   */
  const handleEdit = () => {
    // TODO: 수정 페이지로 이동
    console.log('수정 버튼 클릭');
  };

  /**
   * 삭제 버튼 핸들러
   */
  const handleDelete = () => {
    // TODO: 삭제 확인 모달 표시
    console.log('삭제 버튼 클릭');
  };

  /**
   * 회고 입력 핸들러
   */
  const handleRetrospectSubmit = () => {
    if (retrospectInput.trim()) {
      const newRetrospect: RetrospectData = {
        id: Date.now().toString(),
        content: retrospectInput.trim(),
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '. ').replace(/ $/, '')
      };
      setRetrospects([newRetrospect, ...retrospects]);
      setRetrospectInput('');
    }
  };

  /**
   * 회고 입력 변경 핸들러
   */
  const handleRetrospectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetrospectInput(e.target.value);
  };

  /**
   * Enter 키 입력 핸들러
   */
  const handleRetrospectKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRetrospectSubmit();
    }
  };

  return (
    <div className={styles.container}>
      {/* 64px gap */}
      <div className={styles.gap64}></div>
      
      {/* Frame 79 - 전체 일기 상세 영역 */}
      <div className={styles.diaryDetailWrapper}>
        {/* detail-title: 1168 * 84 */}
        <div className={styles.detailTitle}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{mockData.title}</h1>
          </div>
          <div className={styles.emotionAndDate}>
            <div className={styles.emotionInfo}>
              <Image
                src={emotionData.imageSmall}
                alt={emotionData.label}
                width={32}
                height={32}
                className={styles.emotionIcon}
              />
              <span className={styles.emotionText}>{emotionData.label}</span>
            </div>
            <div className={styles.dateInfo}>
              <span className={styles.dateText}>{mockData.createdAt}</span>
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
            <p className={styles.contentText}>{mockData.content}</p>
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
      
      {/* 24px gap */}
      <div className={styles.gap24}></div>
      
      {/* retrospect-input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <h2 className={styles.retrospectLabel}>{labels.retrospectLabel}</h2>
        <div className={styles.retrospectInputArea}>
          <Input
            {...inputProps.retrospect}
            value={retrospectInput}
            onChange={handleRetrospectChange}
            onKeyPress={handleRetrospectKeyPress}
            placeholder={labels.retrospectPlaceholder}
            className={styles.retrospectInputField}
          />
          <Button
            {...buttonProps.retrospectSubmit}
            onClick={handleRetrospectSubmit}
            className={styles.retrospectSubmitButton}
          >
            {labels.retrospectSubmit}
          </Button>
        </div>
      </div>
      
      {/* 16px gap */}
      <div className={styles.gap16}></div>
      
      {/* retrospect-list: 1168 * auto */}
      <div className={styles.retrospectList}>
        {retrospects.map((retrospect, index) => (
          <div key={retrospect.id}>
            <div className={styles.retrospectItem}>
              <span className={styles.retrospectContent}>{retrospect.content}</span>
              <span className={styles.retrospectDate}>[{retrospect.createdAt}]</span>
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

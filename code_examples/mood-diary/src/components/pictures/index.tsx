'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Selectbox } from '@/commons/components/selectbox';
import { useDogImages } from './hooks/index.binding.hook';
import styles from './styles.module.css';

// Mock 데이터 - 필터 옵션 (SelectBox 컴포넌트용)
const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '행복한' },
  { value: 'sad', label: '슬픈' },
  { value: 'cute', label: '귀여운' },
  { value: 'playful', label: '활발한' }
];

/**
 * Pictures 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 강아지 사진 갤러리를 제공합니다.
 * - Filter Area: SelectBox 컴포넌트 적용 (120x48px)
 * - Main Content: 강아지 사진 그리드 레이아웃 (640x640px 각 이미지)
 * - API: dog.ceo API를 사용하여 실제 강아지 이미지 표시
 * - 무한 스크롤: 마지막 2개 이미지 남았을 때 추가 로드
 */
export const Pictures: React.FC = () => {
  // 현재 선택된 필터 상태 관리
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // 강아지 이미지 API 훅 사용
  const { 
    dogImages, 
    isLoading, 
    isError, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useDogImages();
  
  // 무한 스크롤을 위한 Intersection Observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);

  /**
   * 필터 변경 핸들러
   * 
   * @param value 선택된 필터 값
   */
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  /**
   * 무한 스크롤 구현
   * 마지막에서 2번째 이미지가 보이면 다음 페이지 로드
   */
  useEffect(() => {
    // 로딩 중이거나 다음 페이지가 없으면 실행하지 않음
    if (isLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }

    // Intersection Observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 마지막에서 2번째 이미지가 화면에 보이면 다음 페이지 로드
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '200px', // 200px 미리 로드
        threshold: 0.1
      }
    );

    // 마지막에서 2번째 이미지를 관찰
    const currentRef = lastImageRef.current;
    if (currentRef && observerRef.current) {
      observerRef.current.observe(currentRef);
    }

    // 클린업
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [dogImages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  /**
   * 스플래시 스크린 렌더링 (로딩 중)
   */
  const renderSplashScreens = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div 
        key={`splash-${index}`} 
        className={styles.splashScreen}
        data-testid="splash-screen"
      />
    ));
  };

  /**
   * 에러 메시지 렌더링
   */
  const renderError = () => {
    return (
      <div className={styles.errorMessage} data-testid="error-message">
        <p>강아지 이미지를 불러오는데 실패했습니다.</p>
        <p>{error?.message}</p>
      </div>
    );
  };

  return (
    <div className={styles.container} data-testid="pictures-container">
      {/* Top Gap Area */}
      <div className={styles.gapTop}></div>
      
      {/* Filter Section */}
      <div className={styles.filter}>
        <Selectbox
          variant="primary"
          size="medium"
          theme="light"
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          placeholder="기본"
          className={styles.filterSelect}
        />
      </div>
      
      {/* Middle Gap Area */}
      <div className={styles.gapMiddle}></div>
      
      {/* Main Content Area */}
      <div className={styles.main}>
        <div className={styles.imageGrid}>
          {/* 에러 상태 */}
          {isError && renderError()}
          
          {/* 로딩 중 - 스플래시 스크린 표시 */}
          {isLoading && renderSplashScreens()}
          
          {/* 강아지 이미지 표시 */}
          {!isLoading && !isError && dogImages.map((image, index) => {
            // 마지막에서 2번째 이미지에 ref 할당 (무한 스크롤 트리거)
            const isSecondToLast = index === dogImages.length - 2;
            
            return (
              <div 
                key={image.id} 
                className={styles.imageItem}
                ref={isSecondToLast ? lastImageRef : null}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={640}
                  height={640}
                  className={styles.dogImage}
                  data-testid="dog-image"
                  unoptimized // 외부 이미지이므로 Next.js 최적화 비활성화
                />
              </div>
            );
          })}
          
          {/* 추가 로딩 중 - 무한 스크롤 */}
          {isFetchingNextPage && renderSplashScreens()}
        </div>
      </div>
      
      {/* Bottom Gap Area */}
      <div className={styles.gapBottom}></div>
    </div>
  );
};

export default Pictures;
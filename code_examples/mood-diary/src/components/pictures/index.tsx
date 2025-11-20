'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { Selectbox, SelectOption } from '@/commons/components/selectbox';
import { useDogImages } from './hooks/index.binding.hook';
import { useFilter } from './hooks/index.filter.hook';
import styles from './styles.module.css';

/**
 * 필터 옵션 데이터
 * 강아지 사진 크기 필터링을 위한 선택 옵션 배열
 */
const filterOptions: SelectOption[] = [
  { value: 'default', label: '기본' },
  { value: 'horizontal', label: '가로형' },
  { value: 'vertical', label: '세로형' }
];

/**
 * Pictures 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 강아지 사진 갤러리를 제공합니다.
 * Dog CEO API를 사용하여 실제 강아지 이미지를 표시하고,
 * 무한 스크롤을 통해 추가 이미지를 자동으로 로드합니다.
 * 
 * 주요 기능:
 * - Filter Area: SelectBox 컴포넌트 적용 (120x48px)
 * - Main Content: 강아지 사진 그리드 레이아웃 (640x640px 각 이미지)
 * - API 연동: dog.ceo API를 사용하여 실제 강아지 이미지 표시
 * - 무한 스크롤: 마지막 2개 이미지 남았을 때 추가 로드
 * - 로딩 상태: 스플래시 스크린 애니메이션
 * - 에러 처리: 사용자 친화적인 에러 메시지
 * 
 * @returns 강아지 사진 갤러리 컴포넌트
 */
export const Pictures: React.FC = () => {
  // 필터 훅 사용
  const { selectedFilter, handleFilterChange } = useFilter();
  
  // 강아지 이미지 데이터 바인딩 훅 사용
  const { 
    dogImages, 
    isLoading, 
    isError, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useDogImages();
  
  // 무한 스크롤을 위한 Intersection Observer Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement | null>(null);

  /**
   * 무한 스크롤 구현 Effect
   * 
   * Intersection Observer를 사용하여 마지막에서 2번째 이미지가 
   * 화면에 보이면 자동으로 다음 페이지를 로드합니다.
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
   * 스플래시 스크린 렌더링
   * 
   * 로딩 중 표시되는 6개의 스플래시 스크린을 렌더링합니다.
   * 현재 선택된 필터의 이미지 크기에 맞춰 렌더링됩니다.
   * 
   * @returns 스플래시 스크린 배열
   */
  const renderSplashScreens = (): JSX.Element[] => {
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
   * 
   * API 요청 실패 시 표시되는 에러 메시지를 렌더링합니다.
   * 
   * @returns 에러 메시지 컴포넌트
   */
  const renderError = (): JSX.Element => {
    return (
      <div className={styles.errorMessage} data-testid="error-message">
        <p>강아지 이미지를 불러오는데 실패했습니다.</p>
        <p>{error?.message}</p>
      </div>
    );
  };

  return (
    <div className={styles.container} data-testid="pictures-container">
      {/* Gap */}
      <div className={styles.gapTop}></div>
      
      {/* Filter */}
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
          data-testid="filter-selectbox"
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gapMiddle}></div>
      
      {/* Main */}
      <div className={styles.main}>
        <div className={`${styles.imageGrid} ${styles[selectedFilter]}`}>
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
                data-testid="image-item"
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
      
      {/* Gap */}
      <div className={styles.gapBottom}></div>
    </div>
  );
};

export default Pictures;
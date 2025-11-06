'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Selectbox } from '@/commons/components/selectbox';
import styles from './styles.module.css';

// Mock 데이터 - 필터 옵션 (SelectBox 컴포넌트용)
const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '행복한' },
  { value: 'sad', label: '슬픈' },
  { value: 'cute', label: '귀여운' },
  { value: 'playful', label: '활발한' }
];

// Mock 데이터 - 강아지 이미지 배열 (640x640px 크기로 통일)
const dogImages = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  src: '/images/dog-1.jpg',
  alt: `강아지 사진 ${index + 1}`
}));

/**
 * Pictures 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 강아지 사진 갤러리를 제공합니다.
 * - Filter Area: SelectBox 컴포넌트 적용 (120x48px)
 * - Main Content: 강아지 사진 그리드 레이아웃 (640x640px 각 이미지)
 */
export const Pictures: React.FC = () => {
  // 현재 선택된 필터 상태 관리
  const [selectedFilter, setSelectedFilter] = useState('all');

  /**
   * 필터 변경 핸들러
   * 
   * @param value 선택된 필터 값
   */
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className={styles.container}>
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
          {dogImages.map((image) => (
            <div key={image.id} className={styles.imageItem}>
              <Image
                src={image.src}
                alt={image.alt}
                width={640}
                height={640}
                className={styles.dogImage}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Gap Area */}
      <div className={styles.gapBottom}></div>
    </div>
  );
};

export default Pictures;
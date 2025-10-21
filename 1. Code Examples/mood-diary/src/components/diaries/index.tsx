'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { Selectbox, SelectOption } from '@/commons/components/selectbox';
import { Searchbar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';

// 필터 옵션 데이터
const filterOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '기쁨' },
  { value: 'sad', label: '슬픔' },
  { value: 'angry', label: '화남' },
  { value: 'surprise', label: '놀람' },
  { value: 'etc', label: '기타' },
];

/**
 * Diaries 컴포넌트
 * 
 * 일기 목록 페이지의 와이어프레임 구조를 구현합니다.
 * 검색, 메인 콘텐츠, 페이지네이션 영역으로 구성되어 있습니다.
 * 
 * @returns {JSX.Element} 일기 목록 와이어프레임 컴포넌트
 */
export default function Diaries(): JSX.Element {
  // 검색 상태 관리
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * 필터 변경 핸들러
   * @param {string} value - 선택된 필터 값
   */
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  /**
   * 검색어 변경 핸들러
   * @param {React.ChangeEvent<HTMLInputElement>} event - 입력 이벤트
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  /**
   * 일기쓰기 버튼 클릭 핸들러
   */
  const handleWriteDiary = () => {
    // TODO: 일기 작성 페이지로 이동
    console.log('일기쓰기 버튼 클릭');
  };

  return (
    <div className={styles.container}>
      {/* Gap */}
      <div className={styles.gap32} />
      
      {/* Search */}
      <div className={styles.search}>
        <div className={styles.searchContent}>
          {/* 필터 선택박스 */}
          <Selectbox
            variant="primary"
            size="medium"
            theme="light"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          />
          
          {/* 검색바 */}
          <Searchbar
            variant="primary"
            size="medium"
            theme="light"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          
          {/* 일기쓰기 버튼 */}
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteDiary}
            icon={
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt="plus"
                width={24}
                height={24}
              />
            }
            iconPosition="left"
            className={styles.writeButton}
          >
            일기쓰기
          </Button>
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap42} />
      
      {/* Main */}
      <div className={styles.main}>
        <div className={styles.mainPlaceholder}>메인 콘텐츠 영역</div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap40} />
      
      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationPlaceholder}>페이지네이션 영역</div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap40} />
    </div>
  );
}

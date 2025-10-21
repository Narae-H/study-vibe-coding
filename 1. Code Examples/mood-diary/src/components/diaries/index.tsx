'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { Selectbox, SelectOption } from '@/commons/components/selectbox';
import { Searchbar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';

// 일기 데이터 인터페이스
interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  emotion: EmotionType;
  imageUrl: string;
}

// 필터 옵션 데이터
const filterOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '기쁨' },
  { value: 'sad', label: '슬픔' },
  { value: 'angry', label: '화남' },
  { value: 'surprise', label: '놀람' },
  { value: 'etc', label: '기타' },
];

// Mock 일기 데이터
const mockDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.SAD,
    imageUrl: '/images/dog-1.jpg',
  },
  {
    id: '2',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.SURPRISE,
    imageUrl: '/images/dog-2.jpg',
  },
  {
    id: '3',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.ANGRY,
    imageUrl: '/images/dog-3.jpg',
  },
  {
    id: '4',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.HAPPY,
    imageUrl: '/images/dog-4.jpg',
  },
  {
    id: '5',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.ETC,
    imageUrl: '/images/dog-5.jpg',
  },
  {
    id: '6',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.SURPRISE,
    imageUrl: '/images/dog-6.jpg',
  },
  {
    id: '7',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.ANGRY,
    imageUrl: '/images/dog-7.jpg',
  },
  {
    id: '8',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.HAPPY,
    imageUrl: '/images/dog-8.jpg',
  },
  {
    id: '9',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.SAD,
    imageUrl: '/images/dog-9.jpg',
  },
  {
    id: '10',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.SURPRISE,
    imageUrl: '/images/dog-10.jpg',
  },
  {
    id: '11',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.ANGRY,
    imageUrl: '/images/dog-1.jpg',
  },
  {
    id: '12',
    title: '타이틀 영역 입니다.',
    date: '2024. 03. 12',
    emotion: EmotionType.HAPPY,
    imageUrl: '/images/dog-2.jpg',
  },
];

/**
 * 일기 카드 컴포넌트
 * 
 * 개별 일기 항목을 카드 형태로 표시합니다.
 * 
 * @param {DiaryEntry} entry - 일기 데이터
 * @returns {JSX.Element} 일기 카드 컴포넌트
 */
function DiaryCard({ entry }: { entry: DiaryEntry }): JSX.Element {
  // 감정 데이터 가져오기
  const emotionData = EMOTION_DATA[entry.emotion];

  /**
   * 카드 클릭 핸들러
   */
  const handleCardClick = () => {
    // TODO: 일기 상세 페이지로 이동
    console.log('일기 카드 클릭:', entry.id);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   * @param {React.MouseEvent} event - 클릭 이벤트
   */
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 카드 클릭 이벤트 방지
    // TODO: 일기 삭제 확인 모달 표시
    console.log('일기 삭제 클릭:', entry.id);
  };

  return (
    <div className={styles.diaryCard} onClick={handleCardClick}>
      {/* 이미지 영역 */}
      <div className={styles.cardImageContainer}>
        <Image
          src={entry.imageUrl}
          alt={entry.title}
          width={274}
          height={208}
          className={styles.cardImage}
        />
        {/* 삭제 버튼 */}
        <button
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          aria-label="일기 삭제"
        >
          <Image
            src="/icons/close_outline_light_m.svg"
            alt="삭제"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 텍스트 영역 */}
      <div className={styles.cardContent}>
        {/* 감정과 날짜 */}
        <div className={styles.cardMeta}>
          <span 
            className={styles.emotionText}
            style={{ color: emotionData.color }}
          >
            {emotionData.label}
          </span>
          <span className={styles.dateText}>{entry.date}</span>
        </div>
        
        {/* 제목 */}
        <div className={styles.cardTitle}>
          <span className={styles.titleText}>{entry.title}</span>
        </div>
      </div>
    </div>
  );
}

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
          {/* SelectBox와 SearchBar 묶음 */}
          <div className={styles.searchGroup}>
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
          </div>
          
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
        <div className={styles.diaryGrid}>
          {mockDiaryEntries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
        </div>
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

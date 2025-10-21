'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { Selectbox, SelectOption } from '@/commons/components/selectbox';
import { Searchbar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';

// 필터 옵션 데이터
const filterOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'happy', label: '기쁨' },
  { value: 'sad', label: '슬픔' },
  { value: 'angry', label: '화남' },
  { value: 'surprise', label: '놀람' },
  { value: 'etc', label: '기타' },
];

// 일기 데이터 인터페이스
interface DiaryEntry {
  id: string;
  emotion: EmotionType;
  date: string;
  title: string;
  image: string;
}

// Mock 데이터 생성
const mockDiaries: DiaryEntry[] = [
  {
    id: '1',
    emotion: EmotionType.SAD,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: EMOTION_DATA[EmotionType.SAD].imageMedium
  },
  {
    id: '2',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.SURPRISE].imageMedium
  },
  {
    id: '3',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.ANGRY].imageMedium
  },
  {
    id: '4',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.HAPPY].imageMedium
  },
  {
    id: '5',
    emotion: EmotionType.ETC,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: EMOTION_DATA[EmotionType.ETC].imageMedium
  },
  {
    id: '6',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.SURPRISE].imageMedium
  },
  {
    id: '7',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.ANGRY].imageMedium
  },
  {
    id: '8',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.HAPPY].imageMedium
  },
  {
    id: '9',
    emotion: EmotionType.SAD,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: EMOTION_DATA[EmotionType.SAD].imageMedium
  },
  {
    id: '10',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.SURPRISE].imageMedium
  },
  {
    id: '11',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.ANGRY].imageMedium
  },
  {
    id: '12',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: EMOTION_DATA[EmotionType.HAPPY].imageMedium
  },
];

/**
 * 일기 카드 컴포넌트
 * 
 * 개별 일기 항목을 표시하는 카드 컴포넌트입니다.
 * 피그마 디자인에 따라 이미지, 감정, 날짜, 제목을 표시합니다.
 * 
 * @param {DiaryEntry} diary - 일기 데이터
 * @returns {JSX.Element} 일기 카드 컴포넌트
 */
function DiaryCard({ diary }: { diary: DiaryEntry }): JSX.Element {
  const emotionData = EMOTION_DATA[diary.emotion];

  /**
   * 일기 카드 클릭 핸들러
   */
  const handleCardClick = () => {
    // TODO: 일기 상세 페이지로 이동
    console.log('일기 카드 클릭:', diary.id);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    // TODO: 일기 삭제 로직
    console.log('일기 삭제:', diary.id);
  };

  return (
    <div className={styles.diaryCard} onClick={handleCardClick}>
      {/* 이미지 영역 */}
      <div className={styles.imageContainer}>
        {/* 이미지 헤더 - 삭제 버튼 */}
        <div className={styles.imageHeader}>
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
        {/* 일기 이미지 */}
        <Image
          src={diary.image}
          alt={diary.title}
          width={274}
          height={160}
          className={styles.diaryImage}
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className={styles.cardContent}>
        {/* 감정과 날짜 */}
        <div className={styles.metaInfo}>
          <span 
            className={styles.emotionText}
            style={{ color: emotionData.color }}
          >
            {emotionData.label}
          </span>
          <span className={styles.dateText}>{diary.date}</span>
        </div>

        {/* 제목 */}
        <div className={styles.titleContainer}>
          <h3 className={styles.cardTitle}>{diary.title}</h3>
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
  
  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;

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

  /**
   * 페이지 변경 핸들러
   * @param {number} page - 변경될 페이지 번호
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: 페이지에 따른 일기 목록 데이터 로딩
    console.log('페이지 변경:', page);
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
          {mockDiaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap40} />
      
      {/* Pagination */}
      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="primary"
          size="medium"
          theme="light"
          maxPages={5}
          className={styles.paginationComponent}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap40} />
    </div>
  );
}

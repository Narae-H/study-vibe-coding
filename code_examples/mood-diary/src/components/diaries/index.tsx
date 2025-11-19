'use client';

import React from 'react';
import Image from 'next/image';

import { Selectbox, SelectOption } from '@/commons/components/selectbox';
import { Searchbar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { EMOTION_DATA } from '@/commons/constants/enum';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useDiaryModalLink } from './hooks/index.link.modal.hook';
import { useDiaryBinding, DiaryEntry } from './hooks/index.binding.hook';
import { useDiaryLinkRouting } from './hooks/index.link.routing.hook';
import { useDiarySearch } from './hooks/index.search.hook';
import { useDiaryFilter } from './hooks/index.filter.hook';
import { useDiaryPagination } from './hooks/index.pagination.hook';
import { useDiaryDelete } from './hooks/index.delete.hook';
import styles from './styles.module.css';

/**
 * 필터 옵션 데이터
 * 감정별 필터링을 위한 선택 옵션 배열
 * enum.ts의 EmotionType과 EMOTION_DATA를 기반으로 생성
 */
const filterOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'HAPPY', label: EMOTION_DATA.HAPPY.label },
  { value: 'SAD', label: EMOTION_DATA.SAD.label },
  { value: 'SURPRISE', label: EMOTION_DATA.SURPRISE.label },
  { value: 'ANGRY', label: EMOTION_DATA.ANGRY.label },
];


/**
 * 일기 카드 컴포넌트
 * 
 * 개별 일기 항목을 표시하는 카드 컴포넌트입니다.
 * 피그마 디자인에 따라 이미지, 감정, 날짜, 제목을 표시합니다.
 * 
 * @param diary - 일기 데이터
 * @param isLoggedIn - 로그인 여부
 * @param onDeleteClick - 삭제 버튼 클릭 핸들러
 * @returns 일기 카드 컴포넌트
 */
const DiaryCard = ({ 
  diary, 
  isLoggedIn, 
  onDeleteClick 
}: { 
  diary: DiaryEntry;
  isLoggedIn: boolean;
  onDeleteClick: (diaryId: number | string) => void;
}): JSX.Element => {
  const emotionData = EMOTION_DATA[diary.emotion];
  const { handleDiaryCardClick } = useDiaryLinkRouting();

  /**
   * 일기 카드 클릭 핸들러
   * 새로운 링크 라우팅 훅을 사용하여 상세 페이지로 이동
   */
  const handleCardClick = () => {
    handleDiaryCardClick(diary.id);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   * @param e - 마우스 클릭 이벤트 (카드 클릭 이벤트 전파 방지)
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onDeleteClick(diary.id);
  };

  return (
    <div 
      className={styles.diaryCard} 
      onClick={handleCardClick}
      data-testid="diary-card"
    >
      {/* 이미지 영역 */}
      <div className={styles.imageContainer}>
        {/* 삭제 버튼 - 로그인 유저에게만 표시 */}
        {isLoggedIn && (
          <div className={styles.deleteButtonWrapper}>
            <button 
              className={styles.deleteButton}
              onClick={handleDeleteClick}
              aria-label="일기 삭제"
              data-testid="diary-delete-button"
            >
              <Image
                src="/icons/close_outline_light_m.svg"
                alt="삭제"
                width={24}
                height={24}
              />
            </button>
          </div>
        )}
        {/* 일기 이미지 */}
        <Image
          src={diary.image}
          alt={diary.title}
          width={274}
          height={208}
          className={styles.diaryImage}
          data-testid="diary-image"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className={styles.cardContent}>
        {/* 감정과 날짜 */}
        <div className={styles.metaInfo}>
          <span 
            className={styles.emotionText}
            style={{ color: emotionData.color }}
            data-testid="diary-emotion"
          >
            {emotionData.label}
          </span>
          <span className={styles.dateText} data-testid="diary-date">{diary.date}</span>
        </div>

        {/* 제목 */}
        <div className={styles.titleContainer}>
          <h3 className={styles.cardTitle} data-testid="diary-title">{diary.title}</h3>
        </div>
      </div>
    </div>
  );
};

/**
 * Diaries 컴포넌트
 * 
 * 일기 목록 페이지의 와이어프레임 구조를 구현합니다.
 * 검색, 메인 콘텐츠, 페이지네이션 영역으로 구성되어 있습니다.
 * 
 * @returns 일기 목록 와이어프레임 컴포넌트
 */
const Diaries = (): JSX.Element => {
  // 인증 상태 확인
  const { isLoggedIn } = useAuth();
  
  // 모달 훅 사용
  const { openDiaryModal } = useDiaryModalLink();
  
  // 일기 삭제 훅 사용
  const { openDeleteModal } = useDiaryDelete();
  
  // 일기 데이터 바인딩 훅 사용
  const { diaries, loading, error, refresh } = useDiaryBinding();
  
  // 검색 훅 사용 - 먼저 검색 필터링
  const {
    filteredDiaries: searchedDiaries,
    searchQuery,
    handleSearchChange,
    handleSearch,
    handleKeyPress
  } = useDiarySearch(diaries);
  
  // 필터 훅 사용 - 검색 결과에 대해 감정 필터링
  const {
    filteredDiaries,
    selectedFilter,
    handleFilterChange
  } = useDiaryFilter(searchedDiaries);
  
  // 페이지네이션 훅 사용 - 필터링된 결과를 페이지 단위로 분할
  const {
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange
  } = useDiaryPagination(filteredDiaries);

  /**
   * 일기쓰기 버튼 클릭 핸들러
   * 일기 작성 모달을 엽니다
   */
  const handleWriteDiary = () => {
    openDiaryModal();
  };

  return (
    <div className={styles.container} data-testid="diaries-container">
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
              data-testid="filter-select"
            />
            
            {/* 검색바 래퍼 */}
            <div className={styles.searchbarWrapper}>
              {/* 검색바 */}
              <Searchbar
                variant="primary"
                size="medium"
                theme="light"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className={styles.searchInput}
                data-testid="search-input"
              />
              {/* 돋보기 버튼 */}
              <button
                className={styles.searchButton}
                onClick={handleSearch}
                aria-label="검색"
                data-testid="search-button"
              >
                <Image
                  src="/icons/search_outline_light_m.svg"
                  alt="search"
                  width={24}
                  height={24}
                />
              </button>
            </div>
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
        {loading ? (
          // 로딩 상태 표시
          <div className={styles.loadingContainer}>
            <p>일기를 불러오는 중...</p>
          </div>
        ) : error ? (
          // 에러 상태 표시
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={refresh} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        ) : paginatedDiaries.length === 0 ? (
          // 빈 상태 표시
          <div className={styles.emptyContainer} data-testid="empty-container">
            <p>아직 작성한 일기가 없습니다.</p>
            <p>첫 번째 일기를 작성해보세요!</p>
          </div>
        ) : (
          // 일기 데이터 표시
          <div className={styles.diaryGrid}>
            {paginatedDiaries.map((diary) => (
              <DiaryCard 
                key={diary.id} 
                diary={diary} 
                isLoggedIn={isLoggedIn}
                onDeleteClick={openDeleteModal}
              />
            ))}
          </div>
        )}
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
};

export default Diaries;

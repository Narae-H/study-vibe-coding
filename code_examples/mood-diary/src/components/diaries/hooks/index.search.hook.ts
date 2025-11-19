'use client';

import { useState, useCallback, useEffect } from 'react';
import { DiaryEntry } from './index.binding.hook';

/**
 * 검색 결과 인터페이스
 */
export interface SearchResult {
  // 검색된 일기 목록
  filteredDiaries: DiaryEntry[];
  // 현재 검색어
  searchQuery: string;
  // 검색어 변경 핸들러
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // 검색 실행 핸들러
  handleSearch: () => void;
  // 엔터키 핸들러
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * 일기 검색 기능을 제공하는 커스텀 훅
 * 
 * 로컬스토리지의 diaries 데이터에서 title이 검색어에 포함되는 일기를 필터링합니다.
 * 검색은 엔터키 또는 검색 버튼 클릭으로 실행됩니다.
 * 
 * @param diaries - 전체 일기 목록
 * @returns 검색 관련 상태와 핸들러 함수들
 */
export const useDiarySearch = (diaries: DiaryEntry[]): SearchResult => {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 필터링된 일기 목록 상태
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryEntry[]>(diaries);

  /**
   * 검색어에 따라 일기를 필터링하는 함수
   */
  const filterDiaries = useCallback((query: string) => {
    if (!query.trim()) {
      // 검색어가 없으면 전체 일기 표시
      setFilteredDiaries(diaries);
      return;
    }

    // title에 검색어가 포함된 일기만 필터링
    const filtered = diaries.filter((diary) => 
      diary.title.includes(query.trim())
    );
    
    setFilteredDiaries(filtered);
  }, [diaries]);

  /**
   * 검색어 입력 핸들러
   * @param event - 입력 이벤트
   */
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  /**
   * 검색 실행 핸들러
   * 엔터키 또는 검색 버튼 클릭 시 호출됩니다.
   */
  const handleSearch = useCallback(() => {
    filterDiaries(searchQuery);
  }, [searchQuery, filterDiaries]);

  /**
   * 엔터키 입력 핸들러
   * @param event - 키보드 이벤트
   */
  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  /**
   * diaries 변경 시 필터링 결과 업데이트
   * 새로운 일기가 추가되거나 삭제된 경우 자동으로 검색 결과를 업데이트합니다.
   */
  useEffect(() => {
    filterDiaries(searchQuery);
  }, [diaries, searchQuery, filterDiaries]);

  return {
    filteredDiaries,
    searchQuery,
    handleSearchChange,
    handleSearch,
    handleKeyPress
  };
};


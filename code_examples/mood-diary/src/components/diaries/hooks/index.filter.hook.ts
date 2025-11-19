'use client';

import { useState, useCallback, useEffect } from 'react';
import { DiaryEntry } from './index.binding.hook';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 필터 결과 인터페이스
 */
export interface FilterResult {
  // 필터링된 일기 목록
  filteredDiaries: DiaryEntry[];
  // 현재 선택된 필터 값
  selectedFilter: string;
  // 필터 변경 핸들러
  handleFilterChange: (value: string) => void;
}

/**
 * 일기 필터 기능을 제공하는 커스텀 훅
 * 
 * 감정 타입에 따라 일기를 필터링합니다.
 * '전체' 선택 시 모든 일기를 표시하고,
 * 특정 감정 선택 시 해당 감정의 일기만 필터링합니다.
 * 
 * @param diaries - 전체 일기 목록
 * @returns 필터 관련 상태와 핸들러 함수들
 */
export const useDiaryFilter = (diaries: DiaryEntry[]): FilterResult => {
  // 필터 상태 (기본값: 'all')
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // 필터링된 일기 목록 상태
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryEntry[]>(diaries);

  /**
   * 필터에 따라 일기를 필터링하는 함수
   */
  const filterDiaries = useCallback((filterValue: string) => {
    // '전체' 선택 시 모든 일기 표시
    if (filterValue === 'all') {
      setFilteredDiaries(diaries);
      return;
    }

    // EmotionType enum 값으로 필터링
    const filtered = diaries.filter((diary) => 
      diary.emotion === filterValue as EmotionType
    );
    
    setFilteredDiaries(filtered);
  }, [diaries]);

  /**
   * 필터 변경 핸들러
   * @param value - 선택된 필터 값
   */
  const handleFilterChange = useCallback((value: string) => {
    setSelectedFilter(value);
    filterDiaries(value);
  }, [filterDiaries]);

  /**
   * diaries 변경 시 필터링 결과 업데이트
   * 새로운 일기가 추가되거나 삭제된 경우 자동으로 필터링 결과를 업데이트합니다.
   */
  useEffect(() => {
    filterDiaries(selectedFilter);
  }, [diaries, selectedFilter, filterDiaries]);

  return {
    filteredDiaries,
    selectedFilter,
    handleFilterChange
  };
};


'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DiaryEntry } from './index.binding.hook';

/**
 * 페이지네이션 결과 인터페이스
 */
export interface PaginationResult {
  // 현재 페이지의 일기 목록
  paginatedDiaries: DiaryEntry[];
  // 현재 페이지 번호
  currentPage: number;
  // 전체 페이지 수
  totalPages: number;
  // 페이지 변경 핸들러
  handlePageChange: (page: number) => void;
}

/**
 * 한 페이지당 표시할 일기 개수
 * 요구사항: 3행 4열 = 12개
 */
const ITEMS_PER_PAGE = 12;

/**
 * 일기 페이지네이션 기능을 제공하는 커스텀 훅
 * 
 * 필터링 및 검색된 일기 목록을 페이지 단위로 분할하여 표시합니다.
 * - 한 페이지당 12개(3행 4열)의 일기 카드 표시
 * - 페이지 번호는 5개 단위로 표시
 * - 검색 또는 필터 변경 시 자동으로 1페이지로 리셋
 * 
 * @param diaries - 전체 일기 목록 (필터링/검색 결과)
 * @returns 페이지네이션 관련 상태와 핸들러 함수들
 */
export const useDiaryPagination = (diaries: DiaryEntry[]): PaginationResult => {
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState<number>(1);

  /**
   * 전체 페이지 수 계산
   */
  const totalPages = useMemo(() => {
    return Math.ceil(diaries.length / ITEMS_PER_PAGE);
  }, [diaries.length]);

  /**
   * 현재 페이지에 표시할 일기 목록 계산
   */
  const paginatedDiaries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return diaries.slice(startIndex, endIndex);
  }, [diaries, currentPage]);

  /**
   * 페이지 변경 핸들러
   * @param page - 변경될 페이지 번호
   */
  const handlePageChange = useCallback((page: number) => {
    // 유효한 페이지 범위 체크
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  /**
   * diaries 배열이 변경되면 1페이지로 리셋
   * 검색이나 필터가 변경되어 목록이 바뀌면 첫 페이지로 이동
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [diaries.length]);

  return {
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange
  };
};


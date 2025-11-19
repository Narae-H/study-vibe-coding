import { useState } from 'react';

/**
 * 필터 타입 정의
 * - default: 기본 (640x640)
 * - horizontal: 가로형 (640x480)
 * - vertical: 세로형 (480x640)
 */
export type FilterType = 'default' | 'horizontal' | 'vertical';

/**
 * 이미지 크기 타입
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 필터별 이미지 크기 매핑
 */
const FILTER_SIZE_MAP: Record<FilterType, ImageSize> = {
  default: { width: 640, height: 640 },
  horizontal: { width: 640, height: 480 },
  vertical: { width: 480, height: 640 },
};

/**
 * 필터 훅 반환 타입
 */
export interface UseFilterReturn {
  // 현재 선택된 필터
  selectedFilter: FilterType;
  // 현재 이미지 크기
  imageSize: ImageSize;
  // 필터 변경 핸들러
  handleFilterChange: (filterValue: string) => void;
}

/**
 * 강아지 사진 필터 훅
 * 
 * 사진 필터 선택 상태를 관리하고, 선택된 필터에 따라 이미지 크기를 반환합니다.
 * 
 * 기능:
 * - 필터 선택 상태 관리 (기본, 가로형, 세로형)
 * - 선택된 필터에 따른 이미지 크기 제공
 * - 필터 변경 핸들러
 * 
 * @returns {UseFilterReturn} 필터 상태 및 핸들러
 * 
 * @example
 * ```tsx
 * const { selectedFilter, imageSize, handleFilterChange } = useFilter();
 * 
 * // 이미지 크기 사용
 * <Image width={imageSize.width} height={imageSize.height} />
 * 
 * // 필터 변경
 * <Selectbox onChange={handleFilterChange} />
 * ```
 */
export const useFilter = (): UseFilterReturn => {
  // 필터 상태 (기본값: default)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('default');

  /**
   * 필터 변경 핸들러
   * 
   * SelectBox의 onChange 콜백으로 전달되어 사용됩니다.
   * 
   * @param filterValue - 선택된 필터 값 (default | horizontal | vertical)
   */
  const handleFilterChange = (filterValue: string): void => {
    // 유효한 필터 타입인지 확인
    if (filterValue === 'default' || filterValue === 'horizontal' || filterValue === 'vertical') {
      setSelectedFilter(filterValue as FilterType);
    }
  };

  // 현재 선택된 필터에 대한 이미지 크기
  const imageSize = FILTER_SIZE_MAP[selectedFilter];

  return {
    selectedFilter,
    imageSize,
    handleFilterChange,
  };
};


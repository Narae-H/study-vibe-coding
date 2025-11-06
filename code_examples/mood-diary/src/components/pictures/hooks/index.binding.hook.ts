'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Dog API 응답 타입
 */
interface DogApiResponse {
  message: string[];
  status: string;
}

/**
 * 강아지 이미지 데이터 타입
 */
export interface DogImage {
  id: string;
  src: string;
  alt: string;
}

/**
 * useDogImages 훅 반환 타입
 */
export interface UseDogImagesReturn {
  dogImages: DogImage[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

/**
 * 강아지 사진 API 호출 함수
 * 
 * @param pageParam - 페이지 번호 (무한 스크롤용, 미사용)
 * @returns 강아지 이미지 배열
 */
const fetchDogImages = async (pageParam: number = 0): Promise<DogImage[]> => {
  const response = await fetch('https://dog.ceo/api/breeds/image/random/6');
  
  if (!response.ok) {
    throw new Error('강아지 이미지를 불러오는데 실패했습니다.');
  }
  
  const data: DogApiResponse = await response.json();
  
  if (data.status !== 'success') {
    throw new Error('API 응답이 올바르지 않습니다.');
  }
  
  // 이미지 배열을 DogImage 형태로 변환
  return data.message.map((imageUrl, index) => ({
    id: `${Date.now()}-${pageParam}-${index}`,
    src: imageUrl,
    alt: `강아지 사진 ${pageParam * 6 + index + 1}`
  }));
};

/**
 * 강아지 사진 목록 조회 훅 (무한 스크롤 지원)
 * 
 * Dog CEO API를 사용하여 강아지 이미지를 조회하고,
 * 무한 스크롤을 통해 추가 이미지를 로드합니다.
 * 
 * @returns 강아지 이미지 목록, 로딩 상태, 에러, 다음 페이지 로드 함수 등
 * - dogImages: UI 표시용 강아지 이미지 배열
 * - isLoading: 초기 로딩 상태
 * - isError: 에러 발생 여부
 * - error: 에러 객체 (에러가 없으면 null)
 * - fetchNextPage: 다음 페이지 로드 함수
 * - hasNextPage: 다음 페이지 존재 여부
 * - isFetchingNextPage: 추가 페이지 로딩 상태
 * 
 * @example
 * ```tsx
 * const { 
 *   dogImages, 
 *   isLoading, 
 *   isError, 
 *   error,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage
 * } = useDogImages();
 * ```
 */
export const useDogImages = (): UseDogImagesReturn => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['dogImages'],
    queryFn: ({ pageParam }) => fetchDogImages(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 무한 스크롤 계속 진행
      return allPages.length;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
  });

  // 모든 페이지의 이미지를 하나의 배열로 합침
  const dogImages: DogImage[] = data?.pages.flat() ?? [];

  return {
    dogImages,
    isLoading,
    isError,
    error: error as Error | null,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

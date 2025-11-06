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
 * @returns {object} 강아지 이미지 목록, 로딩 상태, 에러, 다음 페이지 로드 함수 등
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
export const useDogImages = () => {
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

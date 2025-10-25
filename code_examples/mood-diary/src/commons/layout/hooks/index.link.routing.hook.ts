import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { URL_PATH } from '../../constants/url';

/**
 * Layout Link Routing Hook
 * 
 * Layout 컴포넌트의 링크 라우팅 기능을 제공하는 커스텀 훅
 * URL 상수를 사용하여 페이지 이동을 처리
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRouterReady, setIsRouterReady] = useState(false);

  // 라우터가 완전히 초기화될 때까지 대기
  useEffect(() => {
    if (router && pathname !== null) {
      setIsRouterReady(true);
    }
  }, [router, pathname]);

  /**
   * 일기 목록 페이지로 이동
   */
  const navigateToDiaries = useCallback(() => {
    if (isRouterReady && router) {
      router.push(URL_PATH.DIARIES.LIST);
    } else {
      // 라우터가 준비되지 않았을 때는 강제로 페이지 이동
      window.location.href = URL_PATH.DIARIES.LIST;
    }
  }, [router, isRouterReady]);

  /**
   * 사진 목록 페이지로 이동
   */
  const navigateToPictures = useCallback(() => {
    if (isRouterReady && router) {
      router.push(URL_PATH.PICTURES.LIST);
    } else {
      // 라우터가 준비되지 않았을 때는 강제로 페이지 이동
      window.location.href = URL_PATH.PICTURES.LIST;
    }
  }, [router, isRouterReady]);

  /**
   * 로고 클릭 핸들러 (일기 목록 페이지로 이동)
   */
  const handleLogoClick = useCallback(() => {
    navigateToDiaries();
  }, [navigateToDiaries]);

  /**
   * 일기보관함 탭 클릭 핸들러
   */
  const handleDiariesTabClick = useCallback(() => {
    navigateToDiaries();
  }, [navigateToDiaries]);

  /**
   * 사진보관함 탭 클릭 핸들러
   */
  const handlePicturesTabClick = useCallback(() => {
    navigateToPictures();
  }, [navigateToPictures]);

  /**
   * 현재 경로가 일기 목록 페이지인지 확인
   * 루트 경로(/)에서도 일기보관함을 기본 활성 상태로 설정
   */
  const isDiariesActive = pathname === '/' || pathname === URL_PATH.DIARIES.LIST || pathname.startsWith('/diaries');

  /**
   * 현재 경로가 사진 목록 페이지인지 확인
   */
  const isPicturesActive = pathname === URL_PATH.PICTURES.LIST || pathname.startsWith('/pictures');

  return {
    // 네비게이션 함수들
    navigateToDiaries,
    navigateToPictures,
    
    // 이벤트 핸들러들
    handleLogoClick,
    handleDiariesTabClick,
    handlePicturesTabClick,
    
    // 활성 상태 확인
    isDiariesActive,
    isPicturesActive,
    
    // 현재 경로 정보
    currentPath: pathname,
    
    // 라우터 준비 상태
    isRouterReady,
  };
};

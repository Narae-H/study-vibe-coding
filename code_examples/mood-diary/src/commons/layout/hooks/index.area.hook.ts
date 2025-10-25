'use client';

import { usePathname } from 'next/navigation';
import { PAGE_METADATA, UIVisibility } from '../../constants/url';

/**
 * Layout Area Hook
 * 
 * Layout 컴포넌트의 영역별 노출 제어 기능을 제공하는 커스텀 훅
 * URL 경로에 따라 Header, Banner, Navigation, Footer 영역의 표시 여부를 결정
 */
export const useArea = () => {
  const pathname = usePathname();

  /**
   * 현재 경로에 해당하는 UI 가시성 설정을 반환
   */
  const getVisibilityForPath = (path: string): UIVisibility => {
    // 일기 상세 페이지 패턴 매칭 (/diaries/[id])
    if (path.startsWith('/diaries/') && path !== '/diaries') {
      return PAGE_METADATA.DIARIES.DETAIL.visibility;
    }

    // 정확한 경로 매칭
    switch (path) {
      case PAGE_METADATA.AUTH.LOGIN.path:
        return PAGE_METADATA.AUTH.LOGIN.visibility;
      
      case PAGE_METADATA.AUTH.SIGNUP.path:
        return PAGE_METADATA.AUTH.SIGNUP.visibility;
      
      case PAGE_METADATA.DIARIES.LIST.path:
        return PAGE_METADATA.DIARIES.LIST.visibility;
      
      case PAGE_METADATA.PICTURES.LIST.path:
        return PAGE_METADATA.PICTURES.LIST.visibility;
      
      // 홈 페이지(/)는 일기 목록과 동일한 설정
      case '/':
        return PAGE_METADATA.DIARIES.LIST.visibility;
      
      // 기본값: 모든 영역 표시
      default:
        return {
          header: true,
          logo: true,
          darkModeToggle: false,
          banner: true,
          navigation: true,
          footer: true,
        };
    }
  };

  // 현재 경로에 따른 가시성 설정 가져오기
  const visibility = getVisibilityForPath(pathname);

  return {
    // 영역별 표시 여부
    showHeader: visibility.header,
    showLogo: visibility.logo,
    showDarkModeToggle: visibility.darkModeToggle,
    showBanner: visibility.banner,
    showNavigation: visibility.navigation,
    showFooter: visibility.footer,
    
    // 전체 가시성 설정 (필요시 사용)
    visibility,
    
    // 현재 경로 정보
    currentPath: pathname,
  };
}

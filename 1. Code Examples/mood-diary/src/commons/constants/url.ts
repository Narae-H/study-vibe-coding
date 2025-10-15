/**
 * URL Foundation
 * 
 * URL 경로와 관련된 모든 것을 한 번에 관리
 * 다이나믹 라우팅 및 링크 이동에 사용
 */

/**
 * 접근 권한 타입
 */
export enum AccessType {
  PUBLIC = 'PUBLIC',        // 누구나 접근 가능
  MEMBER_ONLY = 'MEMBER_ONLY', // 회원 전용
}

/**
 * UI 노출 설정 인터페이스
 */
export interface UIVisibility {
  header: boolean;           // 헤더 표시 여부
  logo: boolean;            // 로고 표시 여부
  darkModeToggle: boolean;  // 다크모드 토글 표시 여부
  banner: boolean;          // 배너 표시 여부
  navigation: boolean;      // 네비게이션 표시 여부
  footer: boolean;          // 푸터 표시 여부
}

/**
 * 페이지 메타데이터 인터페이스
 */
export interface PageMetadata {
  path: string;
  accessType: AccessType;
  visibility: UIVisibility;
}

/**
 * URL 경로 상수
 */
export const URL_PATH = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  
  // 일기 관련
  DIARIES: {
    LIST: '/diaries',
    DETAIL: (id: string | number) => `/diaries/${id}`,
  },
  
  // 사진 관련
  PICTURES: {
    LIST: '/pictures',
  },
} as const;

/**
 * 페이지별 메타데이터
 */
export const PAGE_METADATA = {
  // 인증 관련
  AUTH: {
    // 로그인 페이지
    LOGIN: {
      path: URL_PATH.AUTH.LOGIN,
      accessType: AccessType.PUBLIC,
      visibility: {
        header: false,
        logo: false,
        darkModeToggle: false,
        banner: false,
        navigation: false,
        footer: false,
      },
    },
    
    // 회원가입 페이지
    SIGNUP: {
      path: URL_PATH.AUTH.SIGNUP,
      accessType: AccessType.PUBLIC,
      visibility: {
        header: false,
        logo: false,
        darkModeToggle: false,
        banner: false,
        navigation: false,
        footer: false,
      },
    },
  },
  
  // 일기 관련
  DIARIES: {
    // 일기 목록 페이지
    LIST: {
      path: URL_PATH.DIARIES.LIST,
      accessType: AccessType.PUBLIC,
      visibility: {
        header: true,
        logo: true,
        darkModeToggle: false,
        banner: true,
        navigation: true,
        footer: true,
      },
    },
    
    // 일기 상세 페이지
    DETAIL: {
      path: '/diaries/[id]',
      accessType: AccessType.MEMBER_ONLY,
      visibility: {
        header: true,
        logo: true,
        darkModeToggle: false,
        banner: false,
        navigation: false,
        footer: true,
      },
    },
  },
  
  // 사진 관련
  PICTURES: {
    // 사진 목록 페이지
    LIST: {
      path: URL_PATH.PICTURES.LIST,
      accessType: AccessType.PUBLIC,
      visibility: {
        header: true,
        logo: true,
        darkModeToggle: false,
        banner: true,
        navigation: true,
        footer: true,
      },
    },
  },
} as const;

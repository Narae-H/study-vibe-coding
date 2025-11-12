import { useAuth } from '@/commons/providers/auth/auth.provider';

/**
 * Layout에서 사용하는 인증 관련 hook
 * 
 * AuthProvider의 useAuth를 래핑하여 Layout 컴포넌트에서 필요한 인증 기능을 제공합니다.
 * - 로그인 페이지로 이동
 * - 로그아웃 처리
 * - 로그인 상태 확인
 * - 유저 정보 조회
 */
export const useAuthStatus = () => {
  const { login, logout, isLoggedIn, user } = useAuth();

  return {
    /**
     * 로그인 페이지로 이동
     */
    handleLogin: login,
    
    /**
     * 로그아웃 처리 (토큰 및 유저 정보 제거 후 로그인 페이지로 이동)
     */
    handleLogout: logout,
    
    /**
     * 로그인 상태 여부
     */
    isLoggedIn,
    
    /**
     * 현재 로그인한 유저 정보
     */
    user,
  };
};


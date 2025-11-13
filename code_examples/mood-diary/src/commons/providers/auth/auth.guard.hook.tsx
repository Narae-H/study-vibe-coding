'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { URL_PATH } from '@/commons/constants/url';

/**
 * 테스트 환경 변수 타입 정의
 */
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

/**
 * Guard Hook 반환 타입
 */
interface UseAuthGuardReturn {
  /**
   * 권한 검증 함수
   * @returns 권한이 있으면 true, 없으면 false
   */
  checkAuth: () => boolean;
  
  /**
   * 권한 검증 후 콜백 실행
   * @param callback - 권한이 있을 때 실행할 콜백 함수
   */
  withAuth: (callback: () => void) => void;
}

/**
 * 인증 Guard Hook
 * 
 * 권한 여부를 검증하는 GUARD 기능을 제공합니다.
 * - 로그인 상태 확인
 * - 테스트 환경 우회 지원
 * - 인가 실패 시 로그인 모달 노출 (한 번만)
 * 
 * @example
 * const { checkAuth, withAuth } = useAuthGuard();
 * 
 * // 방법 1: boolean 반환
 * if (!checkAuth()) return;
 * 
 * // 방법 2: 콜백 실행
 * withAuth(() => {
 *   // 권한이 필요한 작업
 * });
 */
export const useAuthGuard = (): UseAuthGuardReturn => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  // 모달이 이미 표시되었는지 추적 (한 번만 표시)
  const hasShownModalRef = useRef(false);

  /**
   * 테스트 환경 여부 확인
   * - NEXT_PUBLIC_TEST_ENV=test인 경우 테스트 환경으로 판단
   */
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test';

  /**
   * 테스트 환경에서 로그인 검사 우회 여부 확인
   * - 테스트 환경에서는 기본값이 로그인 유저 (우회)
   * - window.__TEST_BYPASS__가 false면 검사 수행 (비로그인 유저)
   * - window.__TEST_BYPASS__가 undefined 또는 true면 검사 패스 (로그인 유저)
   */
  const shouldBypassAuth = () => {
    if (typeof window === 'undefined') return false;
    if (!isTestEnv) return false; // 실제 환경에서는 항상 검사
    return window.__TEST_BYPASS__ !== false; // false가 아니면 우회 (기본값: 로그인 유저)
  };

  /**
   * 로그인 모달 표시
   * - 모달은 한 번만 표시됨
   */
  const showLoginModal = useCallback(() => {
    // 이미 모달을 표시했다면 다시 표시하지 않음
    if (hasShownModalRef.current) return;
    
    hasShownModalRef.current = true;

    openModal(
      <div data-testid="auth-guard-login-modal">
        <Modal
          variant="info"
          actions="dual"
          theme="light"
          title="로그인하시겠습니까"
          description="이 기능은 회원 전용 기능입니다. 로그인이 필요합니다."
          secondaryButtonText="취소"
          primaryButtonText="로그인하러가기"
          onSecondaryClick={() => {
            // 취소: 모든 모달 닫기
            closeAllModals();
          }}
          onPrimaryClick={() => {
            // 로그인하러가기: 모든 모달 닫고 로그인 페이지로 이동
            closeAllModals();
            router.push(URL_PATH.AUTH.LOGIN);
          }}
        />
      </div>
    );
  }, [openModal, closeAllModals, router]);

  /**
   * 권한 검증 함수
   * 
   * @returns 권한이 있으면 true, 없으면 false
   * 
   * 검증 순서:
   * 1. 테스트 환경에서 우회 설정이 있으면 통과
   * 2. 로그인 상태 확인
   * 3. 로그인하지 않았으면 로그인 모달 표시
   */
  const checkAuth = useCallback((): boolean => {
    // 1. 테스트 환경 우회 확인
    if (shouldBypassAuth()) {
      return true;
    }

    // 2. 로그인 상태 확인
    if (isLoggedIn) {
      return true;
    }

    // 3. 인가 실패: 로그인 모달 표시
    showLoginModal();
    return false;
  }, [isLoggedIn, showLoginModal, shouldBypassAuth]);

  /**
   * 권한 검증 후 콜백 실행
   * 
   * @param callback - 권한이 있을 때 실행할 콜백 함수
   * 
   * 권한이 있는 경우에만 콜백을 실행합니다.
   * 권한이 없으면 로그인 모달을 표시하고 콜백을 실행하지 않습니다.
   */
  const withAuth = useCallback((callback: () => void) => {
    if (checkAuth()) {
      callback();
    }
  }, [checkAuth]);

  return {
    checkAuth,
    withAuth,
  };
};

export default useAuthGuard;

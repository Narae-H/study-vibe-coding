'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { PAGE_METADATA, AccessType, URL_PATH } from '@/commons/constants/url';

/**
 * AuthGuard 컴포넌트 props
 */
interface AuthGuardProps {
  /**
   * Provider로 감쌀 하위 컴포넌트들
   */
  children: ReactNode;
}

/**
 * AuthGuard 컴포넌트
 * 
 * 페이지별 권한을 검증하여 접근을 제어합니다.
 * - 페이지 로드 시 권한 검증 진행
 * - 권한이 없는 경우 로그인 모달 표시 및 로그인 페이지로 이동
 * - 테스트 환경에서는 모든 페이지 접근 허용
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasShownModalRef = useRef(false);

  useEffect(() => {
    // AuthProvider 초기화 대기
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // 테스트 환경 체크
    const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test';
    
    // 테스트 환경에서는 모든 페이지 접근 허용
    if (isTestEnv) {
      setIsAuthorized(true);
      return;
    }

    // 현재 페이지의 접근 권한 타입 찾기
    const findAccessType = (): AccessType | null => {
      // PAGE_METADATA를 순회하며 현재 경로와 매칭되는 페이지 찾기
      for (const category of Object.values(PAGE_METADATA)) {
        for (const page of Object.values(category)) {
          // 다이나믹 라우팅 경로 처리 ([id] 등)
          const pagePath = page.path.replace(/\[.*?\]/g, '[^/]+');
          const regex = new RegExp(`^${pagePath}$`);
          
          if (regex.test(pathname)) {
            return page.accessType;
          }
        }
      }
      return null;
    };

    const accessType = findAccessType();

    // 접근 권한이 PUBLIC이거나 정의되지 않은 경우 접근 허용
    if (!accessType || accessType === AccessType.PUBLIC) {
      setIsAuthorized(true);
      return;
    }

    // MEMBER_ONLY 페이지인 경우
    if (accessType === AccessType.MEMBER_ONLY) {
      if (isLoggedIn) {
        // 로그인 상태면 접근 허용
        setIsAuthorized(true);
        hasShownModalRef.current = false;
      } else {
        // 비로그인 상태면 모달 표시 (한 번만)
        setIsAuthorized(false);
        
        if (!hasShownModalRef.current) {
          hasShownModalRef.current = true;
          
          openModal(
            <Modal
              variant="info"
              actions="single"
              title="로그인해주세요"
              description="이 페이지는 로그인이 필요합니다."
              primaryButtonText="확인"
              onPrimaryClick={() => {
                closeAllModals();
                router.push(URL_PATH.AUTH.LOGIN);
              }}
            />
          );
        }
      }
    }
  }, [isInitialized, pathname, isLoggedIn, openModal, closeAllModals, router]);

  // 초기화 전이거나 권한 검증 실패 시 빈 화면 표시
  if (!isInitialized || !isAuthorized) {
    return <div style={{ width: '100%', height: '100vh' }} />;
  }

  return <>{children}</>;
};

export default AuthGuard;

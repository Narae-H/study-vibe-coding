'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { URL_PATH } from '@/commons/constants/url';

/**
 * 로그인 유저 정보 구조
 */
interface User {
  /**
   * 유저 고유 식별자
   */
  _id: string;
  
  /**
   * 유저 이름
   */
  name: string;
}

/**
 * Auth 컨텍스트 타입 정의
 */
interface AuthContextType {
  /**
   * 로그인 페이지로 이동
   */
  login: () => void;
  
  /**
   * 로그아웃 처리 (토큰 및 유저 정보 제거 후 로그인 페이지로 이동)
   */
  logout: () => void;
  
  /**
   * 로그인 상태 여부
   */
  isLoggedIn: boolean;
  
  /**
   * 현재 로그인한 유저 정보
   */
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider 컴포넌트 props
 */
interface AuthProviderProps {
  /**
   * Provider로 감쌀 하위 컴포넌트들
   */
  children: ReactNode;
}

/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태 관리 시스템을 제공합니다.
 * - 로그인/로그아웃 기능
 * - 로그인 상태 실시간 감지
 * - 유저 정보 실시간 동기화
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /**
   * 로컬스토리지에서 인증 상태 확인
   */
  const checkAuthStatus = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // accessToken 유무로 로그인 상태 확인
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
    
    // user 정보 조회
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  /**
   * 로그인 페이지로 이동
   */
  const login = useCallback(() => {
    router.push(URL_PATH.AUTH.LOGIN);
  }, [router]);

  /**
   * 로그아웃 처리
   * - accessToken 제거
   * - user 정보 제거
   * - 로그인 페이지로 이동
   */
  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // 로컬스토리지에서 인증 정보 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // 상태 업데이트
    setIsLoggedIn(false);
    setUser(null);
    
    // 로그인 페이지로 이동
    router.push(URL_PATH.AUTH.LOGIN);
  }, [router]);

  // 초기 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 로컬스토리지 변경 실시간 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      // accessToken 또는 user 변경 시 상태 업데이트
      if (e.key === 'accessToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider 
      value={{ 
        login, 
        logout, 
        isLoggedIn,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

/**
 * 개별 모달 데이터 구조
 */
interface Modal {
  /**
   * 모달의 고유 식별자
   */
  id: string;
  
  /**
   * 모달에 표시될 컨텐츠
   */
  content: ReactNode;
}

/**
 * 모달 컨텍스트 타입 정의
 */
interface ModalContextType {
  /**
   * 새로운 모달을 열고 고유 ID를 반환
   */
  openModal: (content: ReactNode) => string;
  
  /**
   * 특정 모달 또는 최근 모달을 닫기
   */
  closeModal: (id?: string) => void;
  
  /**
   * 모든 모달을 한 번에 닫기
   */
  closeAllModals: () => void;
  
  /**
   * 모달이 열려있는지 여부
   */
  isOpen: boolean;
  
  /**
   * 현재 열린 모달의 개수
   */
  modalCount: number;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

/**
 * ModalProvider 컴포넌트 props
 */
interface ModalProviderProps {
  /**
   * Provider로 감쌀 하위 컴포넌트들
   */
  children: ReactNode;
}

/**
 * ModalProvider 컴포넌트
 * 
 * 중첩 모달을 지원하는 모달 관리 시스템을 제공합니다.
 * - 모달 스택을 통한 중첩 모달 관리
 * - 각 모달별 독립적인 backdrop 레이어
 * - 모달 열림 시 body 스크롤 자동 제어
 * - 개별 모달 또는 전체 모달 닫기 기능
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<Modal[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // body 스크롤 제어
  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalStack.length]);

  /**
   * 새로운 모달을 스택에 추가하고 고유 ID를 반환
   */
  const openModal = useCallback((content: ReactNode): string => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModal: Modal = { id, content };
    
    setModalStack(prev => [...prev, newModal]);
    return id;
  }, []);

  /**
   * 특정 모달 또는 최근 모달을 닫기
   */
  const closeModal = useCallback((id?: string) => {
    if (id) {
      // 특정 모달 닫기
      setModalStack(prev => prev.filter(modal => modal.id !== id));
    } else {
      // 가장 최근 모달 닫기
      setModalStack(prev => prev.slice(0, -1));
    }
  }, []);

  /**
   * 모든 모달을 한 번에 닫기
   */
  const closeAllModals = useCallback(() => {
    setModalStack([]);
  }, []);

  const handleBackdropClick = useCallback((modalId: string) => {
    closeModal(modalId);
  }, [closeModal]);

  return (
    <ModalContext.Provider 
      value={{ 
        openModal, 
        closeModal, 
        closeAllModals,
        isOpen: modalStack.length > 0,
        modalCount: modalStack.length
      }}
    >
      {children}
      {isMounted &&
        modalStack.map((modal, index) => {
          const zIndex = 50 + index * 10; // 각 모달마다 z-index 증가
          const backdropOpacity = Math.min(0.5 + (index * 0.1), 0.8); // 중첩될수록 배경 어두워짐
          
          return createPortal(
            <div
              key={modal.id}
              className={styles.backdrop}
              style={{ zIndex }}
              onClick={() => handleBackdropClick(modal.id)}
            >
              {/* 배경 오버레이 - 각 모달마다 쌓임 */}
              <div 
                className={styles.overlay}
                style={{ opacity: backdropOpacity }}
              />
              
              {/* 모달 컨텐츠 */}
              <div
                className={styles.content}
                style={{ zIndex: zIndex + 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                {modal.content}
              </div>
            </div>,
            document.body
          );
        })
      }
    </ModalContext.Provider>
  );
};

export default ModalProvider;


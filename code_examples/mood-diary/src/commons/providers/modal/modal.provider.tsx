'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // 애니메이션을 위한 딜레이
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {isMounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeModal}
          >
            {/* 배경 오버레이 */}
            <div className="fixed inset-0 bg-black/50 transition-opacity" />
            
            {/* 모달 컨텐츠 - max-w-md, w-full 제거됨 */}
            <div
              className="relative z-10 bg-white rounded-lg shadow-xl p-6 transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              {modalContent}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
};


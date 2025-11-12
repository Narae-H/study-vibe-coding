'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/commons/components/button';

import { useLinkRouting } from './hooks/index.link.routing.hook';
import { useArea } from './hooks/index.area.hook';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const {
    handleLogoClick,
    handleDiariesTabClick,
    handlePicturesTabClick,
    isDiariesActive,
    isPicturesActive,
  } = useLinkRouting();

  const {
    showHeader,
    showLogo,
    showBanner,
    showNavigation,
    showFooter,
  } = useArea();

  return (
    <div className={styles.container} data-testid="layout-container">
      {/* Header */}
      {showHeader && (
        <header className={styles.header} data-testid="layout-header">
          {showLogo && (
            <div 
              className={styles.logo} 
              onClick={handleLogoClick}
              data-testid="layout-logo"
            >
              <span className={styles.logoText}>민지의 다이어리</span>
            </div>
          )}
          
          {/* Auth Status - 로그인 상태 UI (우측 정렬) */}
          <div className={styles.authStatus} data-testid="auth-status">
            <span className={styles.userName}>민지님</span>
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              className={styles.logoutButton}
            >
              로그아웃
            </Button>
          </div>
        </header>
      )}

      {/* Gap */}
      {showHeader && <div className={styles.gap} />}

      {/* Banner */}
      {showBanner && (
        <div className={styles.banner} data-testid="layout-banner">
          <Image
            src="/images/banner.png"
            alt="배너 이미지"
            width={1168}
            height={240}
            className={styles.bannerImage}
            priority
          />
        </div>
      )}

      {/* Gap */}
      {showBanner && <div className={styles.gap} />}

      {/* Navigation */}
      {showNavigation && (
        <nav className={styles.navigation} data-testid="layout-navigation">
          <div className={styles.tabContainer}>
            <div 
              className={`${styles.tab} ${isDiariesActive ? styles.tabActive : styles.tabInactive}`}
              onClick={handleDiariesTabClick}
              data-testid="nav-diaries"
            >
              일기보관함
            </div>
            <div 
              className={`${styles.tab} ${isPicturesActive ? styles.tabActive : styles.tabInactive}`}
              onClick={handlePicturesTabClick}
              data-testid="nav-pictures"
            >
              사진보관함
            </div>
          </div>
        </nav>
      )}

      {/* Children */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className={styles.footer} data-testid="layout-footer">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>민지의 다이어리</div>
            <div className={styles.footerInfo}>대표 : {'{name}'}</div>
            <div className={styles.footerCopyright}>
              Copyright © 2024. {'{name}'} Co., Ltd.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


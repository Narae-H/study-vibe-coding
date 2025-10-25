'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';

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

  return (
    <div className={styles.container} data-testid="layout-container">
      {/* Header */}
      <header className={styles.header}>
        <div 
          className={styles.logo} 
          onClick={handleLogoClick}
          data-testid="layout-logo"
        >
          <span className={styles.logoText}>민지의 다이어리</span>
        </div>
      </header>

      {/* Gap */}
      <div className={styles.gap} />

      {/* Banner */}
      <div className={styles.banner}>
        <Image
          src="/images/banner.png"
          alt="배너 이미지"
          width={1168}
          height={240}
          className={styles.bannerImage}
          priority
        />
      </div>

      {/* Gap */}
      <div className={styles.gap} />

      {/* Navigation */}
      <nav className={styles.navigation}>
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

      {/* Children */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>민지의 다이어리</div>
          <div className={styles.footerInfo}>대표 : {'{name}'}</div>
          <div className={styles.footerCopyright}>
            Copyright © 2024. {'{name}'} Co., Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}


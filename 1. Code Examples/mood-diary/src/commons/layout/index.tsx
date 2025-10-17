import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>민지의 다이어리</span>
        </div>
        <span className={styles.darkModeText}>다크모드</span>
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
          <div className={`${styles.tab} ${styles.tabActive}`}>
            일기보관함
          </div>
          <div className={`${styles.tab} ${styles.tabInactive}`}>
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


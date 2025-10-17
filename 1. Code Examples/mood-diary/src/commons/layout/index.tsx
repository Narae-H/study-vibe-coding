import React from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        Header
      </header>

      {/* Gap */}
      <div className={styles.gap} />

      {/* Banner */}
      <div className={styles.banner}>
        Banner
      </div>

      {/* Gap */}
      <div className={styles.gap} />

      {/* Navigation */}
      <nav className={styles.navigation}>
        Navigation
      </nav>

      {/* Children */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        Footer
      </footer>
    </div>
  );
}


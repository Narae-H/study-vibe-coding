import React from 'react';
import styles from './styles.module.css';

/**
 * 일기 상세 페이지 컴포넌트
 * wireframe 구조로 구현된 기본 레이아웃
 */
const DiariesDetail: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* 64px gap */}
      <div className={styles.gap64}></div>
      
      {/* detail-title: 1168 * 84 */}
      <div className={styles.detailTitle}>
        Detail Title Area
      </div>
      
      {/* 24px gap */}
      <div className={styles.gap24}></div>
      
      {/* detail-content: 1168 * 169 */}
      <div className={styles.detailContent}>
        Detail Content Area
      </div>
      
      {/* 24px gap */}
      <div className={styles.gap24}></div>
      
      {/* detail-footer: 1168 * 56 */}
      <div className={styles.detailFooter}>
        Detail Footer Area
      </div>
      
      {/* 24px gap */}
      <div className={styles.gap24}></div>
      
      {/* retrospect-input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        Retrospect Input Area
      </div>
      
      {/* 16px gap */}
      <div className={styles.gap16}></div>
      
      {/* retrospect-list: 1168 * 72 */}
      <div className={styles.retrospectList}>
        Retrospect List Area
      </div>
      
      {/* 64px gap */}
      <div className={styles.gap64}></div>
    </div>
  );
};

export default DiariesDetail;

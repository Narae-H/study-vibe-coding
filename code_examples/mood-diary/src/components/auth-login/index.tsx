'use client';

import React from 'react';
import Link from 'next/link';

import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';

import styles from './styles.module.css';

/**
 * 로그인 컴포넌트
 * 
 * Figma 디자인을 기반으로 구현된 로그인 폼을 제공합니다.
 * 모던하고 세련된 디자인으로 사용자 경험을 향상시킵니다.
 * 
 * @returns {React.FC} 로그인 폼 컴포넌트
 */
export const AuthLogin: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 헤더 섹션 - 제목과 부제목 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            무드 다이어리에 오신 것을 환영합니다
          </p>
        </div>

        {/* 메인 폼 섹션 - 입력 필드들과 제출 버튼 */}
        <form className={styles.form}>
          {/* 이메일 입력 필드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          {/* 로그인 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="medium"
            className={styles.submitButton}
          >
            로그인
          </Button>
        </form>

        {/* 회원가입 링크 섹션 - 신규 사용자를 위한 회원가입 페이지 이동 */}
        <div className={styles.signupLink}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <Link href="/auth/signup" className={styles.signupLinkText}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;


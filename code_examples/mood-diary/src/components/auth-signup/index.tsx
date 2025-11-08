'use client';

import React from 'react';
import Link from 'next/link';

import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';

import styles from './styles.module.css';

/**
 * 회원가입 컴포넌트
 * 
 * 피그마 디자인을 기반으로 구현된 회원가입 폼을 제공합니다.
 * - 이름, 이메일, 비밀번호, 비밀번호 재입력 필드
 * - 회원가입 버튼
 * - 로그인 페이지로 이동하는 링크
 * - 반응형 디자인 지원
 * - 모던하고 세련된 UI/UX
 * 
 * 주요 기능:
 * - Input 컴포넌트를 활용한 폼 필드
 * - Button 컴포넌트를 활용한 제출 버튼
 * - CSS 변수 토큰을 활용한 일관된 스타일링
 * - 접근성을 고려한 레이블과 ID 연결
 * 
 * @returns 회원가입 폼 컴포넌트
 */
export const AuthSignup: React.FC = () => {
  /**
   * 회원가입 폼 렌더링
   * 
   * 헤더, 폼 필드, 제출 버튼, 로그인 링크 순서로 구성됩니다.
   * 모든 입력 필드는 공통 Input 컴포넌트를 사용하며,
   * 제출 버튼은 공통 Button 컴포넌트를 사용합니다.
   */
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 헤더 섹션 - 제목과 부제목 */}
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            새로운 계정을 만들어 무드 다이어리를 시작해보세요
          </p>
        </div>

        {/* 메인 폼 섹션 - 입력 필드들과 제출 버튼 */}
        <form className={styles.form}>
          {/* 이름 입력 필드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">
              이름
            </label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력해주세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

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

          {/* 비밀번호 재입력 필드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              비밀번호 재입력
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          {/* 회원가입 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="medium"
            className={styles.submitButton}
          >
            회원가입
          </Button>
        </form>

        {/* 로그인 링크 섹션 - 기존 사용자를 위한 로그인 페이지 이동 */}
        <div className={styles.loginLink}>
          <span className={styles.loginText}>이미 계정이 있으신가요?</span>
          <Link href="/auth/login" className={styles.loginLinkText}>
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;

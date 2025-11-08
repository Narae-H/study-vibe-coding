'use client';

import React from 'react';
import Link from 'next/link';

import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { useSignupForm } from './hooks/index.form.hook';

import styles from './styles.module.css';

/**
 * 회원가입 컴포넌트
 * 
 * Figma 디자인을 기반으로 구현된 회원가입 폼을 제공합니다.
 * React Hook Form과 Zod 검증, TanStack Query를 활용한 완전한 회원가입 시스템입니다.
 * 
 * 주요 기능:
 * - 실시간 폼 검증
 * - 모든 필드 입력 시 버튼 활성화
 * - 회원가입 API 호출
 * - 성공/실패 모달 표시
 * - 로그인 페이지 리다이렉트
 * 
 * @returns {React.FC} 회원가입 폼 컴포넌트
 */
export const AuthSignup: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitEnabled,
    isLoading
  } = useSignupForm();

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
        <form className={styles.form} onSubmit={handleSubmit} data-testid="signup-form">
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
              data-testid="signup-name-input"
              {...register('name')}
            />
            {errors.name && (
              <span className={styles.errorMessage} data-testid="signup-name-error">
                {errors.name.message}
              </span>
            )}
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
              data-testid="signup-email-input"
              {...register('email')}
            />
            {errors.email && (
              <span className={styles.errorMessage} data-testid="signup-email-error">
                {errors.email.message}
              </span>
            )}
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
              data-testid="signup-password-input"
              {...register('password')}
            />
            {errors.password && (
              <span className={styles.errorMessage} data-testid="signup-password-error">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* 비밀번호 재입력 필드 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="passwordConfirm">
              비밀번호 재입력
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
              data-testid="signup-password-confirm-input"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && (
              <span className={styles.errorMessage} data-testid="signup-password-confirm-error">
                {errors.passwordConfirm.message}
              </span>
            )}
          </div>

          {/* 회원가입 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="medium"
            className={styles.submitButton}
            disabled={!isSubmitEnabled || isLoading}
            data-testid="signup-submit-button"
          >
            {isLoading ? '가입 중...' : '회원가입'}
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

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { URL_PATH } from '@/commons/constants/url';

/**
 * 회원가입 폼 검증 스키마
 */
const signupSchema = z.object({
  name: z.string().min(1, '이름은 최소 1글자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요').refine((email) => email.includes('@'), {
    message: '이메일에 @가 포함되어야 합니다'
  }),
  password: z.string()
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다'),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm']
});

/**
 * 회원가입 폼 데이터 타입
 */
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * 회원가입 API 요청 데이터 타입
 */
export interface CreateUserInput {
  /**
   * 사용자 이메일
   */
  email: string;
  
  /**
   * 사용자 비밀번호
   */
  password: string;
  
  /**
   * 사용자 이름
   */
  name: string;
}

/**
 * 회원가입 API 응답 데이터 타입
 */
export interface CreateUserResponse {
  /**
   * 생성된 사용자 ID
   */
  _id: string;
}

/**
 * GraphQL 에러 타입
 */
export interface GraphQLError {
  /**
   * 에러 메시지
   */
  message: string;
  
  /**
   * 에러 확장 정보
   */
  extensions?: {
    /**
     * 에러 코드
     */
    code?: string;
  };
}

/**
 * 회원가입 폼 훅 반환 타입
 */
export interface UseSignupFormReturn {
  /**
   * React Hook Form register 함수
   */
  register: ReturnType<typeof useForm<SignupFormData>>['register'];
  
  /**
   * 폼 제출 핸들러
   */
  handleSubmit: () => void;
  
  /**
   * 폼 검증 에러
   */
  errors: ReturnType<typeof useForm<SignupFormData>>['formState']['errors'];
  
  /**
   * 제출 버튼 활성화 여부
   */
  isSubmitEnabled: boolean;
  
  /**
   * 로딩 상태 여부
   */
  isLoading: boolean;
  
  /**
   * 폼 값들
   */
  formValues: SignupFormData;
  
  /**
   * 폼 유효성 여부
   */
  isValid: boolean;
  
  /**
   * 모든 필드 입력 여부
   */
  isAllFieldsFilled: boolean;
}

/**
 * 회원가입 API 호출 함수
 */
const createUser = async (input: CreateUserInput): Promise<CreateUserResponse> => {
  const query = `
    mutation createUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        _id
      }
    }
  `;

  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        createUserInput: input
      }
    })
  });

  const result = await response.json();

  if (result.errors) {
    const error = result.errors[0] as GraphQLError;
    throw new Error(error.message || '회원가입에 실패했습니다');
  }

  return result.data.createUser;
};

/**
 * 회원가입 폼 훅
 * 
 * React Hook Form과 TanStack Query를 사용하여 회원가입 폼의 상태 관리와 
 * API 통신을 처리하는 커스텀 훅입니다.
 * 
 * 주요 기능:
 * - 폼 상태 관리 및 검증
 * - 회원가입 API 호출
 * - 성공/실패 모달 처리
 * - 페이지 리다이렉트
 * 
 * @returns {UseSignupFormReturn} 폼 관리에 필요한 상태와 함수들
 */
export const useSignupForm = (): UseSignupFormReturn => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  // React Hook Form 설정
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState, watch, register } = form;
  const { isValid, errors } = formState;

  // 모든 필드가 입력되었는지 확인
  const formValues = watch();
  const isAllFieldsFilled = Object.values(formValues).every(value => value.trim() !== '');
  const isSubmitEnabled = isValid && isAllFieldsFilled;

  // 회원가입 API 뮤테이션
  const signupMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 성공 모달 표시
      openModal(
        <Modal
          variant="info"
          actions="single"
          title="회원가입 완료"
          description="회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다."
          primaryButtonText="확인"
          onPrimaryClick={() => {
            closeAllModals();
            router.push(URL_PATH.AUTH.LOGIN);
          }}
          data-testid="signup-success-modal"
        />
      );
    },
    onError: (error: Error) => {
      // 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="회원가입 실패"
          description={error.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'}
          primaryButtonText="확인"
          onPrimaryClick={() => {
            closeAllModals();
          }}
          data-testid="signup-error-modal"
        />
      );
    }
  });

  // 폼 제출 핸들러
  const onSubmit = (data: SignupFormData) => {
    const createUserInput: CreateUserInput = {
      email: data.email,
      password: data.password,
      name: data.name
    };

    signupMutation.mutate(createUserInput);
  };

  return {
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    
    // Form state
    isSubmitEnabled,
    isLoading: signupMutation.isPending,
    
    // Field values (for controlled components)
    formValues,
    
    // Additional utilities
    isValid,
    isAllFieldsFilled
  };
};

// 기본 export
export default useSignupForm;

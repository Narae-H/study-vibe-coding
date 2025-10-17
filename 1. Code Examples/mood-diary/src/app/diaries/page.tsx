import React from 'react';
import Layout from '@/commons/layout';
import Diaries from '@/components/diaries';

/**
 * DiariesPage 컴포넌트
 * 
 * 일기 목록 페이지를 렌더링합니다.
 * Layout 컴포넌트로 감싸서 공통 레이아웃을 적용합니다.
 * 
 * @returns {JSX.Element} 일기 목록 페이지 컴포넌트
 */
export default function DiariesPage(): JSX.Element {
  return (
    <Layout>
      <Diaries />
    </Layout>
  );
}

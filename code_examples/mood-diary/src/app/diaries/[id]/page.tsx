import React from 'react';
import DiariesDetail from '@/components/diaries-detail';

/**
 * 일기 상세 페이지
 * @param params - 동적 라우트 파라미터
 */
interface PageProps {
  params: {
    id: string;
  };
}

const DiaryDetailPage: React.FC<PageProps> = ({ params }) => {
  return <DiariesDetail id={params.id} />;
};

export default DiaryDetailPage;

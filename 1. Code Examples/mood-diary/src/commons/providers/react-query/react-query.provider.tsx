'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // useState를 사용하여 QueryClient 인스턴스를 생성하고 유지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 데이터를 신선한 상태로 유지
            staleTime: 5 * 60 * 1000,
            // 5분 후 가비지 컬렉션
            gcTime: 5 * 60 * 1000,
            // 에러 발생 시 재시도 횟수
            retry: 1,
            // 윈도우 포커스 시 자동 refetch 비활성화
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 에러 발생 시 재시도 횟수
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

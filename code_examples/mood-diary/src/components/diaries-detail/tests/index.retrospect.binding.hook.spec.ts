import { test, expect } from '@playwright/test';

/**
 * 회고 바인딩 Hook 테스트
 * 
 * 목적: 로컬스토리지의 retrospects 데이터를 일기 ID에 맞게 바인딩하는 기능 테스트
 * 
 * 테스트 시나리오:
 * 1. 로컬스토리지에 실제 retrospects 데이터 설정
 * 2. /diaries/[id] 페이지 로드
 * 3. 해당 일기 ID와 일치하는 회고 목록이 표시되는지 확인
 */

test.describe('회고 바인딩 Hook 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 실제 다이어리 데이터 설정
    await page.goto('/diaries/1');
    
    await page.evaluate(() => {
      const diaries = [
        {
          id: 1,
          title: '테스트 일기 1',
          content: '테스트 일기 내용 1',
          emotion: 'HAPPY',
          createdAt: '2024. 07. 12'
        },
        {
          id: 2,
          title: '테스트 일기 2',
          content: '테스트 일기 내용 2',
          emotion: 'SAD',
          createdAt: '2024. 07. 13'
        }
      ];
      
      localStorage.setItem('diaries', JSON.stringify(diaries));
    });
  });

  test('회고 바인딩: ID 1 일기에 해당하는 회고만 표시되어야 함', async ({ page }) => {
    // 로컬스토리지에 실제 회고 데이터 설정
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: '첫 번째 일기에 대한 회고입니다.',
          diaryId: 1,
          createdAt: '2024. 09. 24'
        },
        {
          id: 2,
          content: '두 번째 일기에 대한 회고입니다.',
          diaryId: 2,
          createdAt: '2024. 09. 25'
        },
        {
          id: 3,
          content: '첫 번째 일기에 대한 또 다른 회고입니다.',
          diaryId: 1,
          createdAt: '2024. 09. 26'
        }
      ];
      
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });

    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 회고 목록 영역 확인
    const retrospectItems = await page.locator('[data-testid="retrospect-item"]').all();
    
    // ID 1에 해당하는 회고만 2개 표시되어야 함
    expect(retrospectItems.length).toBe(2);
    
    // 첫 번째 회고 내용 확인
    const firstRetrospectContent = await page.locator('[data-testid="retrospect-item"]').nth(0).locator('[data-testid="retrospect-content"]').textContent();
    expect(firstRetrospectContent).toBe('첫 번째 일기에 대한 회고입니다.');
    
    // 첫 번째 회고 날짜 확인
    const firstRetrospectDate = await page.locator('[data-testid="retrospect-item"]').nth(0).locator('[data-testid="retrospect-date"]').textContent();
    expect(firstRetrospectDate).toBe('[2024. 09. 24]');
    
    // 두 번째 회고 내용 확인
    const secondRetrospectContent = await page.locator('[data-testid="retrospect-item"]').nth(1).locator('[data-testid="retrospect-content"]').textContent();
    expect(secondRetrospectContent).toBe('첫 번째 일기에 대한 또 다른 회고입니다.');
    
    // 두 번째 회고 날짜 확인
    const secondRetrospectDate = await page.locator('[data-testid="retrospect-item"]').nth(1).locator('[data-testid="retrospect-date"]').textContent();
    expect(secondRetrospectDate).toBe('[2024. 09. 26]');
  });

  test('회고 바인딩: 회고가 없는 경우 빈 목록 표시', async ({ page }) => {
    // 로컬스토리지에 빈 회고 데이터 설정
    await page.evaluate(() => {
      localStorage.setItem('retrospects', JSON.stringify([]));
    });

    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 회고 목록 영역 확인
    const retrospectItems = await page.locator('[data-testid="retrospect-item"]').all();
    
    // 회고가 없으면 0개
    expect(retrospectItems.length).toBe(0);
  });

  test('회고 바인딩: 다른 일기 ID의 회고는 표시되지 않아야 함', async ({ page }) => {
    // ID 2 일기 페이지로 이동
    await page.goto('/diaries/2');
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 로컬스토리지에 실제 회고 데이터 설정
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: '첫 번째 일기에 대한 회고입니다.',
          diaryId: 1,
          createdAt: '2024. 09. 24'
        },
        {
          id: 2,
          content: '두 번째 일기에 대한 회고입니다.',
          diaryId: 2,
          createdAt: '2024. 09. 25'
        }
      ];
      
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    });

    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 회고 목록 영역 확인
    const retrospectItems = await page.locator('[data-testid="retrospect-item"]').all();
    
    // ID 2에 해당하는 회고만 1개 표시되어야 함
    expect(retrospectItems.length).toBe(1);
    
    // 회고 내용 확인
    const retrospectContent = await page.locator('[data-testid="retrospect-item"]').first().locator('[data-testid="retrospect-content"]').textContent();
    expect(retrospectContent).toBe('두 번째 일기에 대한 회고입니다.');
  });

  test('회고 바인딩: 로컬스토리지에 데이터가 없는 경우 처리', async ({ page }) => {
    // 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem('retrospects');
    });

    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 회고 목록 영역 확인
    const retrospectItems = await page.locator('[data-testid="retrospect-item"]').all();
    
    // 회고가 없으면 0개
    expect(retrospectItems.length).toBe(0);
  });
});


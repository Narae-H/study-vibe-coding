import { test, expect } from '@playwright/test';

/**
 * 일기 삭제 기능 테스트 (TDD 기반)
 * 
 * 테스트 조건:
 * - timeout은 500ms 미만으로 설정하지 않음 (기본값 사용)
 * - 페이지 로드 식별: data-testid 대기 방법 사용
 * - 로컬스토리지 모킹하지 않고 실제 데이터 사용
 * - 로그인 데이터는 window.__TEST_BYPASS__ 전역변수 사용
 */

test.describe('일기 삭제 기능 - 비로그인 유저', () => {
  test.beforeEach(async ({ page }) => {
    // 비로그인 유저 시나리오: window.__TEST_BYPASS__ = false 설정
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = false;
    });
  });

  test('비로그인 유저는 일기 카드의 삭제 아이콘(X)이 표시되지 않아야 함', async ({ page }) => {
    // 1. /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 2. 페이지 로드 확인 (data-testid로 식별)
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 3. 일기 카드가 있는지 확인
    const diaryCards = page.getByTestId('diary-card');
    const cardCount = await diaryCards.count();
    
    if (cardCount > 0) {
      // 4. 모든 일기 카드에서 삭제 버튼이 표시되지 않아야 함
      const deleteButtons = page.getByTestId('diary-delete-button');
      await expect(deleteButtons.first()).not.toBeVisible();
    }
  });
});

test.describe('일기 삭제 기능 - 로그인 유저', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 유저 시나리오: window.__TEST_BYPASS__는 기본값(true) 사용
    // 로컬스토리지에 accessToken과 테스트용 일기 데이터 추가
    await page.goto('/diaries');
    
    await page.evaluate(() => {
      // 로그인 상태 설정 (accessToken 필요)
      localStorage.setItem('accessToken', 'test-access-token');
      
      const testDiaries = [
        {
          id: 1,
          title: '테스트 일기 1',
          content: '테스트 내용 1',
          emotion: 'HAPPY',
          createdAt: '2024-01-01T00:00:00.000Z',
          image: '/images/emotion-happy-m.png',
          date: '2024. 01. 01'
        },
        {
          id: 2,
          title: '테스트 일기 2',
          content: '테스트 내용 2',
          emotion: 'SAD',
          createdAt: '2024-01-02T00:00:00.000Z',
          image: '/images/emotion-sad-m.png',
          date: '2024. 01. 02'
        },
        {
          id: 3,
          title: '테스트 일기 3',
          content: '테스트 내용 3',
          emotion: 'ANGRY',
          createdAt: '2024-01-03T00:00:00.000Z',
          image: '/images/emotion-angry-m.png',
          date: '2024. 01. 03'
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(testDiaries));
    });
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
  });

  test('로그인 유저는 일기 카드의 삭제 아이콘(X)이 표시되어야 함', async ({ page }) => {
    // 1. /diaries 페이지 접속 (beforeEach에서 이미 이동)
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 2. 일기 카드 확인
    const diaryCards = page.getByTestId('diary-card');
    await expect(diaryCards.first()).toBeVisible();
    
    // 3. 삭제 아이콘(X) 노출 확인
    const deleteButtons = page.getByTestId('diary-delete-button');
    await expect(deleteButtons.first()).toBeVisible();
  });

  test('삭제 아이콘(X) 클릭 시 일기 삭제 모달이 표시되어야 함', async ({ page }) => {
    // 1. 페이지 로드 확인
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 2. 첫 번째 일기 카드의 삭제 버튼 클릭
    const firstDeleteButton = page.getByTestId('diary-delete-button').first();
    await expect(firstDeleteButton).toBeVisible();
    await firstDeleteButton.click();
    
    // 3. 삭제 모달이 표시되는지 확인
    await expect(page.getByTestId('delete-modal')).toBeVisible();
    
    // 4. 모달 내용 확인
    await expect(page.getByText('일기 삭제')).toBeVisible();
    await expect(page.getByText('일기를 삭제 하시겠어요?')).toBeVisible();
    
    // 5. 버튼 확인
    await expect(page.getByTestId('delete-modal-cancel-button')).toBeVisible();
    await expect(page.getByTestId('delete-modal-delete-button')).toBeVisible();
  });

  test('삭제 모달에서 "취소" 버튼 클릭 시 모달이 닫혀야 함', async ({ page }) => {
    // 1. 페이지 로드 확인
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 2. 삭제 버튼 클릭하여 모달 열기
    const firstDeleteButton = page.getByTestId('diary-delete-button').first();
    await firstDeleteButton.click();
    
    // 3. 모달 표시 확인
    const deleteModal = page.getByTestId('delete-modal');
    await expect(deleteModal).toBeVisible();
    
    // 4. "취소" 버튼 클릭
    await page.getByTestId('delete-modal-cancel-button').click();
    
    // 5. 모달이 닫혔는지 확인 (DOM에서 제거됨)
    await expect(deleteModal).toHaveCount(0);
  });

  test('삭제 모달에서 "삭제" 버튼 클릭 시 일기가 삭제되고 페이지가 새로고침되어야 함', async ({ page }) => {
    // 1. 페이지 로드 확인
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 2. 삭제 전 일기 개수 확인 (일기 카드가 로드될 때까지 대기)
    const diaryCardsBefore = page.getByTestId('diary-card');
    await expect(diaryCardsBefore.first()).toBeVisible();
    const countBefore = await diaryCardsBefore.count();
    expect(countBefore).toBe(3);
    
    // 3. 첫 번째 일기의 제목 저장
    const firstTitle = await page.getByTestId('diary-title').first().textContent();
    expect(firstTitle).toBe('테스트 일기 1');
    
    // 4. 첫 번째 일기 삭제 버튼 클릭
    const firstDeleteButton = page.getByTestId('diary-delete-button').first();
    await firstDeleteButton.click();
    
    // 5. 모달 표시 확인
    await expect(page.getByTestId('delete-modal')).toBeVisible();
    
    // 6. 페이지 새로고침 이벤트 대기 설정
    const navigationPromise = page.waitForLoadState('load');
    
    // 7. "삭제" 버튼 클릭
    await page.getByTestId('delete-modal-delete-button').click();
    
    // 8. 페이지 새로고침 대기
    await navigationPromise;
    
    // 9. 페이지 로드 확인
    await expect(page.getByTestId('diaries-container')).toBeVisible();
    
    // 10. 일기 개수가 감소했는지 확인 (일기 카드가 다시 로드될 때까지 대기)
    const diaryCardsAfter = page.getByTestId('diary-card');
    await expect(diaryCardsAfter.first()).toBeVisible();
    const countAfter = await diaryCardsAfter.count();
    expect(countAfter).toBe(2);
    
    // 11. 삭제된 일기가 목록에서 사라졌는지 확인
    const titles = await page.getByTestId('diary-title').allTextContents();
    expect(titles).not.toContain('테스트 일기 1');
    expect(titles).toContain('테스트 일기 2');
    expect(titles).toContain('테스트 일기 3');
    
    // 12. 로컬스토리지에서 일기가 삭제되었는지 확인
    const diariesInStorage = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    });
    interface DiaryInStorage {
      id: number;
    }
    expect(diariesInStorage.length).toBe(2);
    expect(diariesInStorage.find((d: DiaryInStorage) => d.id === 1)).toBeUndefined();
  });
});


import { test, expect, type Page } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 링크 라우팅 훅 테스트
 */
test.describe('Diaries Link Routing Hook', () => {
  
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 400ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 400 });
  };

  /**
   * 테스트 데이터 설정
   * 프롬프트 요구사항에 따른 정확한 데이터 구조 사용
   */
  const testDiaries = [
    {
      id: 1,
      title: '행복한 하루',
      content: '오늘은 정말 좋은 하루였다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-03-12'
    },
    {
      id: 2,
      title: '슬픈 하루',
      content: '오늘은 슬픈 일이 있었다.',
      emotion: EmotionType.SAD,
      createdAt: '2024-03-13'
    }
  ];

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지 로드 대기 (data-testid 방식)
    await waitForPageLoad(page);
  });

  test('일기 카드 클릭시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 첫 번째 일기 카드 클릭
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    await expect(firstCard).toBeVisible();
    
    // 카드 클릭
    await firstCard.click();
    
    // URL이 일기 상세 페이지로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('두 번째 일기 카드 클릭시 해당 ID로 이동해야 함', async ({ page }) => {
    // 두 번째 일기 카드 클릭
    const secondCard = page.locator('[data-testid="diary-card"]').nth(1);
    await expect(secondCard).toBeVisible();
    
    // 카드 클릭
    await secondCard.click();
    
    // URL이 해당 일기 상세 페이지로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/2');
  });

  test('삭제 버튼 클릭시 페이지 이동하지 않아야 함', async ({ page }) => {
    // 첫 번째 카드의 삭제 버튼 클릭
    const deleteButton = page.locator('[data-testid="diary-card"]').first().locator('[data-testid="diary-delete-button"]').first();
    await expect(deleteButton).toBeVisible();
    
    // 현재 URL 저장
    const currentUrl = page.url();
    
    // 삭제 버튼 클릭
    await deleteButton.click();
    
    // URL이 변경되지 않았는지 확인
    await expect(page).toHaveURL(currentUrl);
  });

  test('일기 카드에 cursor: pointer 스타일이 적용되어야 함', async ({ page }) => {
    const firstCard = page.locator('[data-testid="diary-card"]').first();
    await expect(firstCard).toBeVisible();
    
    // CSS cursor 속성 확인
    const cursor = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursor).toBe('pointer');
  });

  test('로컬스토리지에 일기 데이터가 없을 때 빈 상태 표시', async ({ page }) => {
    // 빈 배열로 다시 초기화
    await page.addInitScript(() => {
      localStorage.setItem('diaries', JSON.stringify([]));
    });
    
    // 페이지 다시 로드
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // 빈 상태 메시지 확인
    await expect(page.locator('[data-testid="empty-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-container"]')).toContainText('아직 작성한 일기가 없습니다');
  });

  test('일기 데이터가 정상적으로 표시되어야 함', async ({ page }) => {
    // 일기 카드들이 표시되는지 확인
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(2);
    
    // 첫 번째 카드의 내용 확인
    const firstCard = cards.first();
    await expect(firstCard.locator('[data-testid="diary-title"]')).toContainText('행복한 하루');
    await expect(firstCard.locator('[data-testid="diary-emotion"]')).toContainText('행복해요');
    await expect(firstCard.locator('[data-testid="diary-date"]')).toContainText('2024. 03. 12');
  });

  test('각 일기 카드가 고유한 ID로 상세 페이지 이동을 수행해야 함', async ({ page }) => {
    const cards = page.locator('[data-testid="diary-card"]');
    const cardCount = await cards.count();
    
    for (let i = 0; i < cardCount; i++) {
      // 해당 카드 클릭
      await cards.nth(i).click();
      
      // 예상 URL로 이동했는지 확인 (ID는 1부터 시작)
      const expectedId = testDiaries[i].id;
      await expect(page).toHaveURL(`/diaries/${expectedId}`);
      
      // 다시 목록 페이지로 돌아가기
      await page.goBack();
      await waitForPageLoad(page);
    }
  });

  test('로컬스토리지에 잘못된 JSON 데이터가 있을 때 에러 처리', async ({ page }) => {
    // 잘못된 JSON 데이터 설정
    await page.addInitScript(() => {
      localStorage.setItem('diaries', '잘못된JSON데이터');
    });
    
    // 페이지로 이동
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // 빈 상태가 표시되어야 함 (에러 처리)
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(0);
  });

  test('로컬스토리지에 필수 필드가 누락된 데이터가 있을 때 필터링', async ({ page }) => {
    // 필수 필드가 누락된 데이터 설정
    const invalidDiaries = [
      {
        id: 1,
        title: '제목만 있는 데이터',
        // content, emotion, createdAt 누락
      },
      {
        id: 2,
        title: '정상 데이터',
        content: '정상적인 내용',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-03-12'
      }
    ];
    
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, invalidDiaries);
    
    // 페이지로 이동
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // 유효한 데이터만 표시되어야 함 (1개)
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(1);
    
    // 유효한 데이터의 내용 확인
    await expect(cards.first().locator('[data-testid="diary-title"]')).toContainText('정상 데이터');
  });

  test('로컬스토리지에 배열이 아닌 데이터가 있을 때 에러 처리', async ({ page }) => {
    // 배열이 아닌 데이터 설정
    await page.addInitScript(() => {
      localStorage.setItem('diaries', JSON.stringify({ not: 'array' }));
    });
    
    // 페이지로 이동
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // 빈 상태가 표시되어야 함
    const cards = page.locator('[data-testid="diary-card"]');
    await expect(cards).toHaveCount(0);
  });
});

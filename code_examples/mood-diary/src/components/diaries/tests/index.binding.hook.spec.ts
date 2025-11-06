import { test, expect, Page } from '@playwright/test';

import { EmotionType } from '@/commons/constants/enum';

/**
 * 테스트용 일기 데이터 타입
 */
interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 로컬스토리지에 테스트용 일기 데이터 설정
 */
async function setupTestDiariesData(page: Page): Promise<DiaryData[]> {
  const testDiaries: DiaryData[] = [
    {
      id: 1,
      title: '행복한 하루였어요',
      content: '오늘은 정말 좋은 일들이 많이 일어났습니다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-03-12'
    },
    {
      id: 2, 
      title: '슬픈 기분이에요',
      content: '오늘은 좀 우울한 하루였네요.',
      emotion: EmotionType.SAD,
      createdAt: '2024-03-11'
    },
    {
      id: 3,
      title: '화가 나는 상황이 있었어요',
      content: '정말 짜증나는 일이 있었습니다.',
      emotion: EmotionType.ANGRY,
      createdAt: '2024-03-10'
    }
  ];

  // 로컬스토리지에 테스트 데이터 저장
  await page.addInitScript((diaries) => {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  }, testDiaries);

  return testDiaries;
}

/**
 * 페이지가 완전히 로드될 때까지 대기
 */
async function waitForPageLoad(page: Page) {
  // data-testid로 페이지 로드 확인 (networkidle 사용 금지)
  await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
}

test.describe('Diaries 컴포넌트 데이터 바인딩 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('diaries');
    });
  });

  test('로컬스토리지에서 일기 데이터를 올바르게 로드하고 표시해야 한다', async ({ page }) => {
    // Given: 테스트용 일기 데이터 설정
    const testDiaries = await setupTestDiariesData(page);
    
    // When: /diaries 페이지 방문
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // Then: 일기 카드들이 로컬스토리지 데이터로 렌더링되어야 함
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(testDiaries.length);
    
    // 첫 번째 일기 카드 검증
    const firstCard = diaryCards.first();
    await expect(firstCard.locator('[data-testid="diary-title"]')).toContainText('행복한 하루였어요');
    await expect(firstCard.locator('[data-testid="diary-emotion"]')).toContainText('행복해요');
    await expect(firstCard.locator('[data-testid="diary-date"]')).toContainText('2024. 03. 12');
  });

  test('로컬스토리지에 데이터가 없을 때 빈 상태를 표시해야 한다', async ({ page }) => {
    // Given: 로컬스토리지가 비어있음 (beforeEach에서 초기화됨)
    
    // When: /diaries 페이지 방문
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // Then: 일기 카드가 표시되지 않아야 함
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test('긴 제목이 올바르게 말줄임 처리되어야 한다', async ({ page }) => {
    // Given: 긴 제목을 가진 테스트 데이터
    const longTitleDiary = [{
      id: 1,
      title: '이것은 매우 긴 제목입니다. 카드의 너비를 초과하여 말줄임표가 표시되어야 합니다.',
      content: '테스트 내용',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-03-12'
    }];
    
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, longTitleDiary);
    
    // When: /diaries 페이지 방문
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // Then: 제목이 말줄임표로 처리되어야 함
    const titleElement = page.locator('[data-testid="diary-title"]').first();
    
    // CSS로 말줄임표가 적용되었는지 확인
    const textOverflow = await titleElement.evaluate(el => 
      window.getComputedStyle(el).textOverflow
    );
    expect(textOverflow).toBe('ellipsis');
  });

  test('감정별 이미지와 색상이 올바르게 표시되어야 한다', async ({ page }) => {
    // Given: 다양한 감정을 가진 테스트 데이터
    const emotionTestData = [
      { id: 1, title: '행복', content: '', emotion: EmotionType.HAPPY, createdAt: '2024-03-12' },
      { id: 2, title: '슬픔', content: '', emotion: EmotionType.SAD, createdAt: '2024-03-11' },
      { id: 3, title: '화남', content: '', emotion: EmotionType.ANGRY, createdAt: '2024-03-10' }
    ];
    
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, emotionTestData);
    
    // When: /diaries 페이지 방문
    await page.goto('/diaries');
    await waitForPageLoad(page);
    
    // Then: 각 감정에 맞는 이미지와 텍스트가 표시되어야 함
    const diaryCards = page.locator('[data-testid="diary-card"]');
    
    await expect(diaryCards.nth(0).locator('[data-testid="diary-emotion"]')).toContainText('행복해요');
    await expect(diaryCards.nth(1).locator('[data-testid="diary-emotion"]')).toContainText('슬퍼요');
    await expect(diaryCards.nth(2).locator('[data-testid="diary-emotion"]')).toContainText('화나요');
    
    // 이미지 src 확인 (Next.js Image 최적화 고려)
    await expect(diaryCards.nth(0).locator('[data-testid="diary-image"]')).toHaveAttribute('src', /emotion-happy-m\.png/);
    await expect(diaryCards.nth(1).locator('[data-testid="diary-image"]')).toHaveAttribute('src', /emotion-sad-m\.png/);
    await expect(diaryCards.nth(2).locator('[data-testid="diary-image"]')).toHaveAttribute('src', /emotion-angry-m\.png/);
  });
});

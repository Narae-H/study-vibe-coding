import { test, expect, Page } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 테스트용 일기 데이터 인터페이스
 */
interface TestDiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 테스트용 일기 데이터 설정
 */
const TEST_DIARIES: TestDiaryData[] = [
  {
    id: 1,
    title: '테스트 일기 제목 1',
    content: '이것은 테스트용 일기 내용입니다. 로컬스토리지에서 실제 데이터를 가져와서 표시하는지 확인합니다.',
    emotion: EmotionType.HAPPY,
    createdAt: '2024.11.06'
  },
  {
    id: 2,
    title: '테스트 일기 제목 2',
    content: '두 번째 테스트용 일기 내용입니다. 다른 감정과 날짜를 테스트합니다.',
    emotion: EmotionType.SAD,
    createdAt: '2024.11.05'
  }
];

/**
 * 로컬스토리지에 테스트 데이터 설정
 */
const setupTestData = async (page: Page) => {
  await page.addInitScript((diaries) => {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  }, TEST_DIARIES);
};

test.describe('일기 상세 페이지 데이터 바인딩', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지에 테스트 데이터 설정
    await setupTestData(page);
  });

  test('ID가 1인 일기 상세 페이지가 올바른 데이터를 표시해야 함', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 제목 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText('테스트 일기 제목 1');
    
    // 내용 확인
    await expect(page.locator('[data-testid="diary-content"]')).toContainText('이것은 테스트용 일기 내용입니다');
    
    // 감정 텍스트 확인 (HAPPY -> 행복해요)
    await expect(page.locator('[data-testid="diary-emotion-text"]')).toHaveText('행복해요');
    
    // 작성일 확인
    await expect(page.locator('[data-testid="diary-created-at"]')).toHaveText('2024.11.06');
    
    // 감정 아이콘 확인 (alt 텍스트로 확인)
    await expect(page.locator('[data-testid="diary-emotion-icon"]')).toHaveAttribute('alt', '행복해요');
  });

  test('ID가 2인 일기 상세 페이지가 올바른 데이터를 표시해야 함', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/2');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 제목 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText('테스트 일기 제목 2');
    
    // 내용 확인
    await expect(page.locator('[data-testid="diary-content"]')).toContainText('두 번째 테스트용 일기 내용입니다');
    
    // 감정 텍스트 확인 (SAD -> 슬퍼요)
    await expect(page.locator('[data-testid="diary-emotion-text"]')).toHaveText('슬퍼요');
    
    // 작성일 확인
    await expect(page.locator('[data-testid="diary-created-at"]')).toHaveText('2024.11.05');
    
    // 감정 아이콘 확인
    await expect(page.locator('[data-testid="diary-emotion-icon"]')).toHaveAttribute('alt', '슬퍼요');
  });

  test('존재하지 않는 ID로 접근 시 빈 상태 또는 오류 처리가 되어야 함', async ({ page }) => {
    // 존재하지 않는 ID로 접근
    await page.goto('/diaries/999');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 제목이 빈 상태이거나 기본값을 가져야 함
    const titleElement = page.locator('[data-testid="diary-title"]');
    await expect(titleElement).toBeVisible();
    
    // 내용이 빈 상태이거나 오류 메시지를 표시해야 함
    const contentElement = page.locator('[data-testid="diary-content"]');
    await expect(contentElement).toBeVisible();
  });

  test('로컬스토리지가 비어있을 때 빈 상태 처리가 되어야 함', async ({ page }) => {
    // 로컬스토리지 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('diaries');
    });

    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 빈 상태 처리 확인
    const titleElement = page.locator('[data-testid="diary-title"]');
    await expect(titleElement).toBeVisible();
    
    const contentElement = page.locator('[data-testid="diary-content"]');
    await expect(contentElement).toBeVisible();
  });
});

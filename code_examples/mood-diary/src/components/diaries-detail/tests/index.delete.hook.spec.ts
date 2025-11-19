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

test.describe('일기 상세 페이지 삭제 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지에 테스트 데이터 설정
    await setupTestData(page);
  });

  test('일기 삭제 성공 시나리오 - 삭제 버튼 클릭 후 모달에서 삭제 확인', async ({ page }) => {
    // 1. /diaries/1에 접속
    await page.goto('/diaries/1');
    
    // 2. 페이지 로드 확인 (data-testid 대기 방법)
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 3. 삭제 버튼 클릭
    await page.locator('[data-testid="delete-button"]').click();

    // 4. 일기삭제 모달이 노출됨을 확인
    const modal = page.locator('[data-testid="delete-modal"]');
    await expect(modal).toBeVisible();

    // 5. 모달 타이틀 확인
    await expect(modal.locator('[data-testid="delete-modal-title"]')).toHaveText('일기 삭제');

    // 6. 모달 설명 확인
    await expect(modal.locator('[data-testid="delete-modal-description"]')).toHaveText('일기를 삭제 하시겠어요?');

    // 7. "삭제" 버튼 클릭
    await page.locator('[data-testid="modal-primary-button"]').click();

    // 8. /diaries로 페이지 이동 확인
    await page.waitForURL('/diaries', { timeout: 500 });
    
    // 9. 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const diariesAfterDelete = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    });
    
    // ID가 1인 일기가 삭제되었는지 확인
    const deletedDiary = diariesAfterDelete.find((diary: TestDiaryData) => diary.id === 1);
    expect(deletedDiary).toBeUndefined();
    
    // ID가 2인 일기는 여전히 존재해야 함
    const remainingDiary = diariesAfterDelete.find((diary: TestDiaryData) => diary.id === 2);
    expect(remainingDiary).toBeDefined();
  });

  test('일기 삭제 취소 시나리오 - 삭제 버튼 클릭 후 모달에서 취소', async ({ page }) => {
    // 1. /diaries/1에 접속
    await page.goto('/diaries/1');
    
    // 2. 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 500 });

    // 3. 삭제 버튼 클릭
    await page.locator('[data-testid="delete-button"]').click();

    // 4. 일기삭제 모달이 노출됨을 확인
    const modal = page.locator('[data-testid="delete-modal"]');
    await expect(modal).toBeVisible();

    // 5. "취소" 버튼 클릭
    await page.locator('[data-testid="modal-secondary-button"]').click();

    // 6. 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();

    // 7. 페이지가 여전히 /diaries/1에 있는지 확인
    expect(page.url()).toContain('/diaries/1');
    
    // 8. 로컬스토리지에서 일기가 삭제되지 않았는지 확인
    const diariesAfterCancel = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    });
    
    // ID가 1인 일기가 여전히 존재해야 함
    const diary = diariesAfterCancel.find((diary: TestDiaryData) => diary.id === 1);
    expect(diary).toBeDefined();
    expect(diary?.title).toBe('테스트 일기 제목 1');
  });
});


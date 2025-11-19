import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 페이지네이션 기능 테스트
 * 
 * TDD 기반으로 작성된 일기 페이지네이션 기능 테스트입니다.
 * 로컬스토리지의 실제 데이터를 사용하여 테스트합니다.
 */
test.describe('일기 페이지네이션 기능 테스트', () => {
  /**
   * 테스트용 일기 데이터 - 50개 (페이지네이션 테스트를 위해 충분한 양)
   * 한 페이지에 12개씩 표시되므로 총 5페이지 필요
   */
  const createTestDiaries = () => {
    const diaries = [];
    const emotions = [EmotionType.HAPPY, EmotionType.SAD, EmotionType.ANGRY, EmotionType.SURPRISE, EmotionType.ETC];
    
    for (let i = 1; i <= 50; i++) {
      diaries.push({
        id: i,
        title: `테스트 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: emotions[(i - 1) % emotions.length],
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    return diaries;
  };

  const testDiaries = createTestDiaries();

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // /diaries 페이지 방문
    await page.goto('/diaries');
    
    // 페이지 로드 확인 - data-testid 대기
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  });

  test('한 페이지에 12개의 일기 카드가 표시되어야 한다', async ({ page }) => {
    // 일기 카드 개수 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(12);
  });

  test('페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 표시되어야 한다', async ({ page }) => {
    // 페이지네이션 컴포넌트 확인
    const pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(5);
    
    // 각 페이지 번호 확인
    for (let i = 1; i <= 5; i++) {
      const pageButton = page.locator(`[aria-label="페이지 ${i}"]`);
      await expect(pageButton).toBeVisible();
      await expect(pageButton).toHaveText(String(i));
    }
  });

  test('페이지 1이 기본으로 활성화되어야 한다', async ({ page }) => {
    // 페이지 1 버튼이 활성화 상태인지 확인
    const page1Button = page.locator('[aria-label="페이지 1"][aria-current="page"]');
    await expect(page1Button).toBeVisible();
  });

  test('페이지 번호 클릭 시 해당 페이지의 일기 목록이 표시되어야 한다', async ({ page }) => {
    // 페이지 2 클릭
    const page2Button = page.locator('[aria-label="페이지 2"]');
    await page2Button.click();
    
    // 페이지 2가 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 2"][aria-current="page"]')).toBeVisible();
    
    // 일기 카드 12개 표시 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(12);
    
    // 첫 번째 일기가 13번째 일기인지 확인 (페이지 2의 첫 번째)
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('테스트 일기 13');
  });

  test('페이지 3 클릭 시 25~36번 일기가 표시되어야 한다', async ({ page }) => {
    // 페이지 3 클릭
    const page3Button = page.locator('[aria-label="페이지 3"]');
    await page3Button.click();
    
    // 페이지 3이 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 3"][aria-current="page"]')).toBeVisible();
    
    // 첫 번째 일기가 25번째 일기인지 확인
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('테스트 일기 25');
    
    // 마지막 일기가 36번째 일기인지 확인
    const lastTitle = page.locator('[data-testid="diary-title"]').last();
    await expect(lastTitle).toHaveText('테스트 일기 36');
  });

  test('이전 버튼 클릭 시 이전 페이지로 이동해야 한다', async ({ page }) => {
    // 페이지 3으로 이동
    await page.locator('[aria-label="페이지 3"]').click();
    await expect(page.locator('[aria-label="페이지 3"][aria-current="page"]')).toBeVisible();
    
    // 이전 버튼 클릭
    const prevButton = page.locator('[aria-label="이전 페이지"]');
    await prevButton.click();
    
    // 페이지 2가 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 2"][aria-current="page"]')).toBeVisible();
    
    // 첫 번째 일기가 13번째 일기인지 확인
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('테스트 일기 13');
  });

  test('다음 버튼 클릭 시 다음 페이지로 이동해야 한다', async ({ page }) => {
    // 페이지 1에서 시작
    await expect(page.locator('[aria-label="페이지 1"][aria-current="page"]')).toBeVisible();
    
    // 다음 버튼 클릭
    const nextButton = page.locator('[aria-label="다음 페이지"]');
    await nextButton.click();
    
    // 페이지 2가 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 2"][aria-current="page"]')).toBeVisible();
    
    // 첫 번째 일기가 13번째 일기인지 확인
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('테스트 일기 13');
  });

  test('첫 페이지에서 이전 버튼은 비활성화되어야 한다', async ({ page }) => {
    // 페이지 1에서 이전 버튼 확인
    const prevButton = page.locator('[aria-label="이전 페이지"]');
    await expect(prevButton).toBeDisabled();
  });

  test('마지막 페이지에서 다음 버튼은 비활성화되어야 한다', async ({ page }) => {
    // 페이지 5로 이동
    await page.locator('[aria-label="페이지 5"]').click();
    
    // 다음 버튼 확인
    const nextButton = page.locator('[aria-label="다음 페이지"]');
    await expect(nextButton).toBeDisabled();
  });
});

test.describe('검색 결과 페이지네이션 기능 테스트', () => {
  /**
   * 테스트용 일기 데이터 - 30개 (검색어 "행복" 포함)
   * 검색 결과 페이지네이션 테스트
   */
  const createSearchTestDiaries = () => {
    const diaries = [];
    const emotions = [EmotionType.HAPPY, EmotionType.SAD, EmotionType.ANGRY, EmotionType.SURPRISE, EmotionType.ETC];
    
    // 행복이 포함된 일기 30개
    for (let i = 1; i <= 30; i++) {
      diaries.push({
        id: i,
        title: `행복한 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: emotions[(i - 1) % emotions.length],
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    // 행복이 없는 일기 20개
    for (let i = 31; i <= 50; i++) {
      diaries.push({
        id: i,
        title: `슬픈 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: EmotionType.SAD,
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    return diaries;
  };

  const testDiaries = createSearchTestDiaries();

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // /diaries 페이지 방문
    await page.goto('/diaries');
    
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  });

  test('검색 후 검색 결과에 맞게 페이지 수가 변경되어야 한다', async ({ page }) => {
    // 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('행복');
    
    // 검색 실행
    await page.locator('[data-testid="search-button"]').click();
    
    // 검색 결과 30개 -> 3페이지 표시되어야 함
    const pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(3);
    
    // 페이지 번호 확인
    await expect(page.locator('[aria-label="페이지 1"]')).toBeVisible();
    await expect(page.locator('[aria-label="페이지 2"]')).toBeVisible();
    await expect(page.locator('[aria-label="페이지 3"]')).toBeVisible();
  });

  test('검색 결과에서 페이지 이동이 정상 작동해야 한다', async ({ page }) => {
    // 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('행복');
    
    // 검색 실행
    await page.locator('[data-testid="search-button"]').click();
    
    // 페이지 2로 이동
    await page.locator('[aria-label="페이지 2"]').click();
    
    // 페이지 2가 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 2"][aria-current="page"]')).toBeVisible();
    
    // 첫 번째 일기가 13번째 일기인지 확인
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('행복한 일기 13');
  });

  test('검색어를 지우면 전체 페이지 수로 복원되어야 한다', async ({ page }) => {
    // 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('행복');
    await page.locator('[data-testid="search-button"]').click();
    
    // 검색 결과 페이지 확인 (3페이지)
    let pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(3);
    
    // 검색어 지우기
    await searchInput.clear();
    await page.locator('[data-testid="search-button"]').click();
    
    // 전체 페이지 수로 복원 (5페이지)
    pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(5);
  });
});

test.describe('필터 결과 페이지네이션 기능 테스트', () => {
  /**
   * 테스트용 일기 데이터 - 감정별로 다른 개수
   * 필터 결과 페이지네이션 테스트
   */
  const createFilterTestDiaries = () => {
    const diaries = [];
    
    // HAPPY 감정 일기 30개
    for (let i = 1; i <= 30; i++) {
      diaries.push({
        id: i,
        title: `행복한 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: EmotionType.HAPPY,
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    // SAD 감정 일기 10개
    for (let i = 31; i <= 40; i++) {
      diaries.push({
        id: i,
        title: `슬픈 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: EmotionType.SAD,
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    // ANGRY 감정 일기 15개
    for (let i = 41; i <= 55; i++) {
      diaries.push({
        id: i,
        title: `화난 일기 ${i}`,
        content: `일기 내용 ${i}`,
        emotion: EmotionType.ANGRY,
        createdAt: `2024-01-${String(i).padStart(2, '0')}`
      });
    }
    
    return diaries;
  };

  const testDiaries = createFilterTestDiaries();

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // /diaries 페이지 방문
    await page.goto('/diaries');
    
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  });

  test('필터 선택 시 필터 결과에 맞게 페이지 수가 변경되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // HAPPY 필터 선택
    const happyOption = page.locator('role=option').filter({ hasText: '행복해요' });
    await happyOption.click();
    
    // HAPPY 일기 30개 -> 3페이지 표시되어야 함
    const pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(3);
  });

  test('필터 결과에서 페이지 이동이 정상 작동해야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // HAPPY 필터 선택
    const happyOption = page.locator('role=option').filter({ hasText: '행복해요' });
    await happyOption.click();
    
    // 페이지 2로 이동
    await page.locator('[aria-label="페이지 2"]').click();
    
    // 페이지 2가 활성화되었는지 확인
    await expect(page.locator('[aria-label="페이지 2"][aria-current="page"]')).toBeVisible();
    
    // 첫 번째 일기가 13번째 일기인지 확인
    const firstTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(firstTitle).toHaveText('행복한 일기 13');
    
    // 모든 카드가 HAPPY 감정인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    const count = await emotionTexts.count();
    for (let i = 0; i < count; i++) {
      await expect(emotionTexts.nth(i)).toHaveText('행복해요');
    }
  });

  test('다른 필터 선택 시 페이지 수가 변경되고 페이지 1로 리셋되어야 한다', async ({ page }) => {
    // HAPPY 필터 선택
    await page.locator('[data-testid="filter-select"]').click();
    await page.locator('role=option').filter({ hasText: '행복해요' }).click();
    
    // 페이지 3으로 이동
    await page.locator('[aria-label="페이지 3"]').click();
    await expect(page.locator('[aria-label="페이지 3"][aria-current="page"]')).toBeVisible();
    
    // SAD 필터로 변경
    await page.locator('[data-testid="filter-select"]').click();
    await page.locator('role=option').filter({ hasText: '슬퍼요' }).click();
    
    // SAD 일기 10개 -> 1페이지만 표시
    const pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(1);
    
    // 페이지 1이 활성화되어야 함
    await expect(page.locator('[aria-label="페이지 1"][aria-current="page"]')).toBeVisible();
  });

  test('전체 필터로 변경 시 모든 페이지가 표시되어야 한다', async ({ page }) => {
    // HAPPY 필터 선택
    await page.locator('[data-testid="filter-select"]').click();
    await page.locator('role=option').filter({ hasText: '행복해요' }).click();
    
    // 페이지 수 확인 (3페이지)
    let pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(3);
    
    // 전체 필터로 변경
    await page.locator('[data-testid="filter-select"]').click();
    await page.locator('role=option').filter({ hasText: '전체' }).click();
    
    // 전체 일기 55개 -> 5페이지 표시
    pagination = page.locator('[aria-label^="페이지 "]');
    await expect(pagination).toHaveCount(5);
  });
});


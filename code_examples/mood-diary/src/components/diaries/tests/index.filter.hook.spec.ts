import { test, expect } from '@playwright/test';
import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';

/**
 * 일기 필터 기능 테스트
 * 
 * TDD 기반으로 작성된 일기 필터링 기능 테스트입니다.
 * 로컬스토리지의 실제 데이터를 사용하여 테스트합니다.
 */
test.describe('일기 필터 기능 테스트', () => {
  // 테스트용 일기 데이터
  const testDiaries = [
    {
      id: 1,
      title: '행복한 하루',
      content: '오늘은 정말 행복한 하루였다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: '슬픈 일',
      content: '오늘은 슬픈 일이 있었다.',
      emotion: EmotionType.SAD,
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      title: '화가 나는 일',
      content: '오늘은 화가 났다.',
      emotion: EmotionType.ANGRY,
      createdAt: '2024-01-03',
    },
    {
      id: 4,
      title: '놀라운 소식',
      content: '오늘 놀라운 소식을 들었다.',
      emotion: EmotionType.SURPRISE,
      createdAt: '2024-01-04',
    },
    {
      id: 5,
      title: '또 다른 행복',
      content: '행복한 날이 계속된다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-01-05',
    },
  ];

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

  test('필터 선택박스가 표시되어야 한다', async ({ page }) => {
    // 필터 선택박스 확인
    const filterSelect = page.locator('[data-testid="filter-select"]');
    await expect(filterSelect).toBeVisible();
  });

  test('필터 메뉴가 올바른 옵션을 포함해야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-select"]');
    await filterSelect.click();
    
    // 옵션 목록이 열렸는지 확인
    const optionsList = page.locator('role=listbox');
    await expect(optionsList).toBeVisible();
    
    // 각 옵션 확인
    const options = page.locator('role=option');
    
    // 전체 옵션 확인
    const allOption = options.filter({ hasText: '전체' });
    await expect(allOption).toBeVisible();
    
    // EmotionType enum에서 감정 옵션 확인
    const happyOption = options.filter({ hasText: EMOTION_DATA[EmotionType.HAPPY].label });
    await expect(happyOption).toBeVisible();
    
    const sadOption = options.filter({ hasText: EMOTION_DATA[EmotionType.SAD].label });
    await expect(sadOption).toBeVisible();
    
    const angryOption = options.filter({ hasText: EMOTION_DATA[EmotionType.ANGRY].label });
    await expect(angryOption).toBeVisible();
    
    const surpriseOption = options.filter({ hasText: EMOTION_DATA[EmotionType.SURPRISE].label });
    await expect(surpriseOption).toBeVisible();
  });

  test('전체 필터 선택 시 모든 일기가 표시되어야 한다', async ({ page }) => {
    // 전체 필터 선택 (기본값)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(testDiaries.length);
  });

  test('행복해요 필터 선택 시 행복한 일기만 표시되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 행복해요 옵션 선택
    const happyOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.HAPPY].label });
    await happyOption.click();
    
    // 행복한 일기만 표시되는지 확인
    const happyDiaries = testDiaries.filter(d => d.emotion === EmotionType.HAPPY);
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(happyDiaries.length);
    
    // 각 카드의 감정이 행복해요인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    const count = await emotionTexts.count();
    for (let i = 0; i < count; i++) {
      await expect(emotionTexts.nth(i)).toHaveText(EMOTION_DATA[EmotionType.HAPPY].label);
    }
  });

  test('슬퍼요 필터 선택 시 슬픈 일기만 표시되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 슬퍼요 옵션 선택
    const sadOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.SAD].label });
    await sadOption.click();
    
    // 슬픈 일기만 표시되는지 확인
    const sadDiaries = testDiaries.filter(d => d.emotion === EmotionType.SAD);
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(sadDiaries.length);
    
    // 각 카드의 감정이 슬퍼요인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    await expect(emotionTexts.first()).toHaveText(EMOTION_DATA[EmotionType.SAD].label);
  });

  test('화나요 필터 선택 시 화난 일기만 표시되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 화나요 옵션 선택
    const angryOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.ANGRY].label });
    await angryOption.click();
    
    // 화난 일기만 표시되는지 확인
    const angryDiaries = testDiaries.filter(d => d.emotion === EmotionType.ANGRY);
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(angryDiaries.length);
    
    // 각 카드의 감정이 화나요인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    await expect(emotionTexts.first()).toHaveText(EMOTION_DATA[EmotionType.ANGRY].label);
  });

  test('놀랐어요 필터 선택 시 놀란 일기만 표시되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 놀랐어요 옵션 선택
    const surpriseOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.SURPRISE].label });
    await surpriseOption.click();
    
    // 놀란 일기만 표시되는지 확인
    const surpriseDiaries = testDiaries.filter(d => d.emotion === EmotionType.SURPRISE);
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(surpriseDiaries.length);
    
    // 각 카드의 감정이 놀랐어요인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    await expect(emotionTexts.first()).toHaveText(EMOTION_DATA[EmotionType.SURPRISE].label);
  });
});

test.describe('검색 결과 필터 기능 테스트', () => {
  // 테스트용 일기 데이터
  const testDiaries = [
    {
      id: 1,
      title: '행복한 하루',
      content: '오늘은 정말 행복한 하루였다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: '슬픈 일',
      content: '오늘은 슬픈 일이 있었다.',
      emotion: EmotionType.SAD,
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      title: '화가 나는 일',
      content: '오늘은 화가 났다.',
      emotion: EmotionType.ANGRY,
      createdAt: '2024-01-03',
    },
    {
      id: 4,
      title: '놀라운 소식',
      content: '오늘 놀라운 소식을 들었다.',
      emotion: EmotionType.SURPRISE,
      createdAt: '2024-01-04',
    },
    {
      id: 5,
      title: '또 다른 행복',
      content: '행복한 날이 계속된다.',
      emotion: EmotionType.HAPPY,
      createdAt: '2024-01-05',
    },
  ];

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

  test('검색 후 필터 적용 시 검색 결과 내에서만 필터링되어야 한다', async ({ page }) => {
    // 검색어 입력 (행복 검색)
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('행복');
    
    // 검색 실행
    await page.locator('[data-testid="search-button"]').click();
    
    // 검색 결과 확인 (행복이 포함된 일기 2개)
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(2);
    
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 행복해요 필터 선택
    const happyOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.HAPPY].label });
    await happyOption.click();
    
    // 검색 결과 중 행복한 감정만 필터링 (2개 모두 행복)
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(2);
    
    // 각 카드의 감정이 행복해요인지 확인
    const emotionTexts = page.locator('[data-testid="diary-emotion"]');
    const count = await emotionTexts.count();
    for (let i = 0; i < count; i++) {
      await expect(emotionTexts.nth(i)).toHaveText(EMOTION_DATA[EmotionType.HAPPY].label);
    }
  });

  test('검색 후 다른 감정 필터 적용 시 결과가 없어야 한다', async ({ page }) => {
    // 검색어 입력 (행복 검색)
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('행복');
    
    // 검색 실행
    await page.locator('[data-testid="search-button"]').click();
    
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 슬퍼요 필터 선택
    const sadOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.SAD].label });
    await sadOption.click();
    
    // 검색 결과 중 슬픈 감정이 없으므로 빈 상태 표시
    const emptyContainer = page.locator('[data-testid="empty-container"]');
    await expect(emptyContainer).toBeVisible();
  });

  test('필터 적용 후 검색 시 필터가 유지되어야 한다', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.locator('[data-testid="filter-select"]').click();
    
    // 행복해요 필터 선택
    const happyOption = page.locator('role=option').filter({ hasText: EMOTION_DATA[EmotionType.HAPPY].label });
    await happyOption.click();
    
    // 행복한 일기 2개 표시 확인
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(2);
    
    // 검색어 입력 (또 검색)
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('또');
    
    // 검색 실행
    await page.locator('[data-testid="search-button"]').click();
    
    // 행복한 일기 중 "또"가 포함된 일기만 표시 (1개)
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정이 행복해요인지 확인
    const emotionText = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionText).toHaveText(EMOTION_DATA[EmotionType.HAPPY].label);
    
    // 제목이 "또 다른 행복"인지 확인
    const titleText = page.locator('[data-testid="diary-title"]').first();
    await expect(titleText).toHaveText('또 다른 행복');
  });
});

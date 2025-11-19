import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 검색 기능 테스트
 * 
 * 실제 로컬스토리지 데이터를 사용하여 검색 기능을 테스트합니다.
 */
test.describe('일기 검색 기능', () => {
  
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터 준비
    const testDiaries = [
      {
        id: 1,
        title: '행복한 하루',
        content: '오늘은 정말 행복한 하루였다.',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        title: '슬픈 날',
        content: '오늘은 슬픈 일이 있었다.',
        emotion: EmotionType.SAD,
        createdAt: '2024-01-02'
      },
      {
        id: 3,
        title: '행복한 주말',
        content: '주말에 친구들과 만나서 행복했다.',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-01-03'
      },
      {
        id: 4,
        title: '화난 순간',
        content: '화가 나는 일이 있었다.',
        emotion: EmotionType.ANGRY,
        createdAt: '2024-01-04'
      },
      {
        id: 5,
        title: '놀라운 경험',
        content: '놀라운 일을 경험했다.',
        emotion: EmotionType.SURPRISE,
        createdAt: '2024-01-05'
      }
    ];

    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diaries-container"]');
  });

  test('검색창에 검색어 입력 후 엔터키로 검색', async ({ page }) => {
    // 초기 상태: 모든 일기 카드(5개) 표시 확인
    const initialCards = await page.locator('[data-testid="diary-card"]').count();
    expect(initialCards).toBe(5);

    // 검색창 찾기
    const searchInput = page.locator('[data-testid="search-input"]');
    
    // 검색어 입력
    await searchInput.fill('행복');
    
    // 엔터키로 검색 실행
    await searchInput.press('Enter');
    
    // 검색 결과 확인: "행복"이 포함된 일기 카드(2개)만 표시
    await page.waitForTimeout(100); // 검색 결과 렌더링 대기
    const filteredCards = await page.locator('[data-testid="diary-card"]').count();
    expect(filteredCards).toBe(2);
    
    // 검색된 일기 제목 확인
    const titles = await page.locator('[data-testid="diary-title"]').allTextContents();
    expect(titles).toContain('행복한 하루');
    expect(titles).toContain('행복한 주말');
    expect(titles).not.toContain('슬픈 날');
  });

  test('검색창에 검색어 입력 후 돋보기 버튼 클릭으로 검색', async ({ page }) => {
    // 초기 상태: 모든 일기 카드(5개) 표시 확인
    const initialCards = await page.locator('[data-testid="diary-card"]').count();
    expect(initialCards).toBe(5);

    // 검색창과 돋보기 버튼 찾기
    const searchInput = page.locator('[data-testid="search-input"]');
    const searchButton = page.locator('[data-testid="search-button"]');
    
    // 검색어 입력
    await searchInput.fill('화');
    
    // 돋보기 버튼 클릭
    await searchButton.click();
    
    // 검색 결과 확인: "화"가 포함된 일기 카드(1개)만 표시
    await page.waitForTimeout(100); // 검색 결과 렌더링 대기
    const filteredCards = await page.locator('[data-testid="diary-card"]').count();
    expect(filteredCards).toBe(1);
    
    // 검색된 일기 제목 확인
    const titles = await page.locator('[data-testid="diary-title"]').allTextContents();
    expect(titles).toContain('화난 순간');
  });

  test('검색어가 없는 경우 모든 일기 표시', async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator('[data-testid="search-input"]');
    
    // 빈 검색어로 엔터
    await searchInput.fill('');
    await searchInput.press('Enter');
    
    // 모든 일기 카드(5개) 표시 확인
    await page.waitForTimeout(100);
    const cards = await page.locator('[data-testid="diary-card"]').count();
    expect(cards).toBe(5);
  });

  test('검색 결과가 없는 경우 빈 상태 표시', async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator('[data-testid="search-input"]');
    
    // 결과가 없는 검색어 입력
    await searchInput.fill('존재하지않는검색어12345');
    await searchInput.press('Enter');
    
    // 일기 카드 없음 확인
    await page.waitForTimeout(100);
    const cards = await page.locator('[data-testid="diary-card"]').count();
    expect(cards).toBe(0);
    
    // 빈 상태 메시지 확인
    const emptyMessage = await page.locator('[data-testid="empty-container"]').isVisible();
    expect(emptyMessage).toBe(true);
  });

  test('검색 후 다시 다른 검색어로 검색', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    
    // 첫 번째 검색
    await searchInput.fill('행복');
    await searchInput.press('Enter');
    await page.waitForTimeout(100);
    
    let cards = await page.locator('[data-testid="diary-card"]').count();
    expect(cards).toBe(2);
    
    // 두 번째 검색
    await searchInput.fill('슬픈');
    await searchInput.press('Enter');
    await page.waitForTimeout(100);
    
    cards = await page.locator('[data-testid="diary-card"]').count();
    expect(cards).toBe(1);
    
    const titles = await page.locator('[data-testid="diary-title"]').allTextContents();
    expect(titles).toContain('슬픈 날');
  });
});


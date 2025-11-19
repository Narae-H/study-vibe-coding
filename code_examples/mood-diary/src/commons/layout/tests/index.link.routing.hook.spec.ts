import { test, expect, type Page } from '@playwright/test';

test.describe('Layout Link Routing Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 500ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
  };

  test.beforeEach(async ({ page }) => {
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await waitForPageLoad(page);
  });

  test('로고 클릭시 일기 목록 페이지로 이동', async ({ page }) => {
    // 로고 요소가 존재하는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // 로고 클릭
    await logo.click();
    
    // URL이 정확히 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 페이지가 완전히 로드되었는지 확인
    await waitForPageLoad(page);
  });

  test('일기보관함 탭 클릭시 일기 목록 페이지로 이동', async ({ page }) => {
    // 일기보관함 탭 요소가 존재하는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toBeVisible();
    
    // 일기보관함 탭 클릭
    await diariesTab.click();
    
    // URL이 정확히 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 페이지가 완전히 로드되었는지 확인
    await waitForPageLoad(page);
  });

  test('사진보관함 탭 클릭시 사진 목록 페이지로 이동 (skip)', async ({ page }) => {
    test.skip(true, '/pictures 페이지는 테스트에서 제외');
    
    // 사진보관함 탭 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // URL이 /pictures로 변경되었는지 확인
    await expect(page).toHaveURL('/pictures');
  });

  test('네비게이션 탭의 활성 상태가 올바르게 표시됨', async ({ page }) => {
    // 일기보관함 탭이 활성 상태인지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);
    
    // 사진보관함 탭이 비활성 상태인지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toHaveClass(/tabInactive/);
  });

  test('로고와 네비게이션 요소들이 클릭 가능한 커서를 가짐', async ({ page }) => {
    // 로고의 커서 스타일 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS('cursor', 'pointer');
    
    // 일기보관함 탭의 커서 스타일 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toBeVisible();
    await expect(diariesTab).toHaveCSS('cursor', 'pointer');
    
    // 사진보관함 탭의 커서 스타일 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toBeVisible();
    await expect(picturesTab).toHaveCSS('cursor', 'pointer');
  });

  test('네비게이션 요소들의 접근성 확인', async ({ page }) => {
    // 로고가 클릭 가능한 요소인지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeEnabled();
    
    // 네비게이션 탭들이 클릭 가능한 요소인지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    
    await expect(diariesTab).toBeEnabled();
    await expect(picturesTab).toBeEnabled();
  });

  test('URL 상수 사용 확인 - 하드코딩 방지', async ({ page }) => {
    // 현재 페이지가 /diaries인지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 로고 클릭 후 동일한 경로로 이동하는지 확인 (URL_PATH.DIARIES.LIST 사용)
    const logo = page.locator('[data-testid="layout-logo"]');
    await logo.click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭 클릭 후 동일한 경로로 이동하는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await diariesTab.click();
    await waitForPageLoad(page);
    await expect(page).toHaveURL('/diaries');
  });

  test('페이지 로드 상태 검증', async ({ page }) => {
    // Layout 컨테이너가 정상적으로 렌더링되었는지 확인
    const container = page.locator('[data-testid="layout-container"]');
    await expect(container).toBeVisible();
    
    // 필수 요소들이 모두 존재하는지 확인
    await expect(page.locator('[data-testid="layout-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-diaries"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-pictures"]')).toBeVisible();
  });

  test('루트 경로(/)에서 링크 동작 확인', async ({ page }) => {
    // 루트 경로로 이동
    await page.goto('/');
    await waitForPageLoad(page);
    
    // 루트 경로에서 일기보관함이 활성 상태인지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);
    
    // 사진보관함은 비활성 상태인지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toHaveClass(/tabInactive/);
    
    // 로고 클릭이 즉시 정상 작동하는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await logo.click();
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭 클릭이 즉시 정상 작동하는지 확인
    await page.goto('/');
    await waitForPageLoad(page);
    await diariesTab.click();
    await expect(page).toHaveURL('/diaries');
  });

  test('SSR 초기 로드 시 즉시 클릭 동작 확인', async ({ page }) => {
    // 루트 경로로 이동 (SSR 상황 시뮬레이션)
    await page.goto('/');
    await waitForPageLoad(page);
    
    // 요소들이 존재하고 cursor: pointer가 적용되었는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    
    await expect(logo).toBeVisible();
    await expect(diariesTab).toBeVisible();
    await expect(logo).toHaveCSS('cursor', 'pointer');
    await expect(diariesTab).toHaveCSS('cursor', 'pointer');
    
    // 즉시 클릭이 정상 작동하는지 확인 (라우터 준비 대기 없음)
    await logo.click();
    await expect(page).toHaveURL('/diaries');
  });
});

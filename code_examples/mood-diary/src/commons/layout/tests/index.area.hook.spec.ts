import { test, expect, type Page } from '@playwright/test';

test.describe('Layout Area Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 500ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
  };

  test.beforeEach(async ({ page }) => {
    // 홈 페이지로 이동
    await page.goto('/');
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await waitForPageLoad(page);
  });

  test('일기 목록 페이지에서 모든 영역이 표시되어야 함', async ({ page }) => {
    // 일기 목록 페이지로 이동
    await page.goto('/diaries');
    await waitForPageLoad(page);

    // Header 영역이 표시되는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // Logo가 표시되는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // Banner 영역이 표시되는지 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // Navigation 영역이 표시되는지 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // Footer 영역이 표시되는지 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test('일기 상세 페이지에서 banner와 navigation이 숨겨져야 함', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    await waitForPageLoad(page);

    // Header 영역이 표시되는지 확인 (표시되어야 함)
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // Logo가 표시되는지 확인 (표시되어야 함)
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // Banner 영역이 숨겨져 있는지 확인 (숨겨져야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    // Navigation 영역이 숨겨져 있는지 확인 (숨겨져야 함)
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    // Footer 영역이 표시되는지 확인 (표시되어야 함)
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test('사진 목록 페이지에서 모든 영역이 표시되어야 함 (skip)', async ({ page }) => {
    test.skip(true, '/pictures 페이지는 테스트에서 제외');
    
    // 사진 목록 페이지로 이동
    await page.goto('/pictures');
    await waitForPageLoad(page);

    // Header 영역이 표시되는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // Logo가 표시되는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // Banner 영역이 표시되는지 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // Navigation 영역이 표시되는지 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // Footer 영역이 표시되는지 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test('/auth/login 페이지에서 모든 영역이 숨겨져야 함', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login');
    await waitForPageLoad(page);

    // 모든 영역이 숨겨져 있는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();
    
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  test('/auth/signup 페이지에서 모든 영역이 숨겨져야 함', async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('/auth/signup');
    await waitForPageLoad(page);

    // 모든 영역이 숨겨져 있는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();
    
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  test('홈 페이지(/)에서 일기 목록과 동일한 영역 표시', async ({ page }) => {
    // 홈 페이지로 이동
    await page.goto('/');
    await waitForPageLoad(page);

    // Header 영역이 표시되는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // Logo가 표시되는지 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // Banner 영역이 표시되는지 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // Navigation 영역이 표시되는지 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // Footer 영역이 표시되는지 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });
});

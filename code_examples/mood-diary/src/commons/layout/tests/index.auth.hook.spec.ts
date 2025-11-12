import { test, expect, type Page } from '@playwright/test';

test.describe('Layout Auth Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 400ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 400 });
  };

  /**
   * 로컬스토리지 클리어 (테스트 격리를 위한 초기화)
   */
  const clearAuth = async (page: Page) => {
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    });
  };

  test.describe('비로그인 유저 시나리오', () => {
    test.beforeEach(async ({ page }) => {
      // 로컬스토리지 클리어
      await page.goto('/diaries');
      await clearAuth(page);
    });

    test('비회원으로 /diaries에 접속하여 페이지 로드 확인', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      await waitForPageLoad(page);

      // Layout 컨테이너가 정상적으로 렌더링되었는지 확인
      const container = page.locator('[data-testid="layout-container"]');
      await expect(container).toBeVisible();
    });

    test('layout의 로그인버튼 노출여부 확인', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      await waitForPageLoad(page);

      // 로그인 버튼이 노출되는지 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeVisible();

      // 로그아웃 버튼과 유저 이름은 노출되지 않아야 함
      const logoutButton = page.locator('[data-testid="logout-button"]');
      const userName = page.locator('[data-testid="user-name"]');
      
      await expect(logoutButton).not.toBeVisible();
      await expect(userName).not.toBeVisible();
    });

    test('로그인버튼 클릭하여 /auth/login 페이지로 이동', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      await waitForPageLoad(page);

      // 로그인 버튼 클릭
      const loginButton = page.locator('[data-testid="login-button"]');
      await loginButton.click();

      // /auth/login 페이지로 이동 확인
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('로그인 유저 시나리오', () => {
    test.beforeEach(async ({ page }) => {
      // 로컬스토리지 클리어
      await page.goto('/auth/login');
      await clearAuth(page);
    });

    test('비회원으로 /auth/login에 접속하여 페이지 로드 확인', async ({ page }) => {
      // /auth/login 페이지 접속
      await page.goto('/auth/login');
      await waitForPageLoad(page);

      // Layout 컨테이너가 정상적으로 렌더링되었는지 확인
      const container = page.locator('[data-testid="layout-container"]');
      await expect(container).toBeVisible();
    });

    test('로그인 성공 후 layout에서 유저이름, 로그아웃버튼 노출여부 확인 및 로그아웃', async ({ page }) => {
      // 1. /auth/login 페이지 접속
      await page.goto('/auth/login');
      await waitForPageLoad(page);

      // 2. 로그인 시도
      const emailInput = page.locator('input[name="email"]');
      const passwordInput = page.locator('input[name="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('a@c.com');
      await passwordInput.fill('1234qwer');
      await submitButton.click();

      // 3. 로그인 성공 후 완료 모달 클릭하여 /diaries 페이지 로드 확인
      // Modal의 "확인" 버튼을 텍스트로 찾기
      const modalButton = page.locator('button:has-text("확인")');
      await modalButton.click();
      
      await expect(page).toHaveURL('/diaries');
      
      // 페이지 새로고침하여 AuthProvider가 localStorage를 다시 읽도록 함
      await page.reload();
      await waitForPageLoad(page);

      // 4. layout에서 유저이름, 로그아웃버튼 노출여부 확인
      const userName = page.locator('[data-testid="user-name"]');
      const logoutButton = page.locator('[data-testid="logout-button"]');
      
      await expect(userName).toBeVisible();
      await expect(logoutButton).toBeVisible();

      // 유저 이름이 제대로 표시되는지 확인 (실제 데이터 사용)
      const userNameText = await userName.textContent();
      expect(userNameText).toBeTruthy();
      expect(userNameText?.length).toBeGreaterThan(0);

      // 로그인 버튼은 노출되지 않아야 함
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).not.toBeVisible();

      // 6. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인
      await logoutButton.click();
      await expect(page).toHaveURL('/auth/login');
      await waitForPageLoad(page);

      // 8. /diaries에 접속하여 페이지 로드 확인
      await page.goto('/diaries');
      await waitForPageLoad(page);

      // 9. layout에 로그인버튼 노출여부 확인
      const loginButtonAfterLogout = page.locator('[data-testid="login-button"]');
      await expect(loginButtonAfterLogout).toBeVisible();

      // 로그아웃 후 유저 정보는 노출되지 않아야 함
      await expect(userName).not.toBeVisible();
      await expect(logoutButton).not.toBeVisible();
    });
  });
});


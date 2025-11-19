import { test, expect, type Page } from '@playwright/test';

test.describe('Layout Auth Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 500ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
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

    test('로그인 성공 시 localStorage와 state 동기화 확인', async ({ page }) => {
      // 1. /auth/login 페이지 접속
      await page.goto('/auth/login');
      await waitForPageLoad(page);

      // 로그인 전 localStorage 비어있는지 확인
      const beforeLogin = await page.evaluate(() => ({
        token: localStorage.getItem('accessToken'),
        user: localStorage.getItem('user')
      }));
      expect(beforeLogin.token).toBeNull();
      expect(beforeLogin.user).toBeNull();

      // 2. 로그인 시도
      await page.locator('[data-testid="login-email-input"]').fill('test3@gmail.com');
      await page.locator('[data-testid="login-password-input"]').fill('test123!');
      await page.locator('[data-testid="login-submit-button"]').click();

      // 3-1. API 호출 성공 시 accessToken과 user가 localStorage에 저장되었는지 확인
      // 성공 모달이 나타날 때까지 대기
      const modalButton = page.locator('[data-testid="modal-primary-button"]');
      await expect(modalButton).toBeVisible();

      const afterLogin = await page.evaluate(() => ({
        token: localStorage.getItem('accessToken'),
        user: localStorage.getItem('user')
      }));
      expect(afterLogin.token).toBeTruthy();
      expect(afterLogin.user).toBeTruthy();

      // user 데이터 구조 확인
      const userData = JSON.parse(afterLogin.user!);
      expect(userData).toHaveProperty('_id');
      expect(userData).toHaveProperty('name');

      // 모달 닫기
      await modalButton.click();
      await expect(page).toHaveURL('/diaries');

      // 3-2. AuthProvider 마운트 시 localStorage를 읽어 초기 state 세팅 확인
      // 페이지 새로고침하여 AuthProvider가 다시 마운트되도록 함
      await page.reload();
      await waitForPageLoad(page);

      // 새로고침 후에도 로그인 상태 유지 확인 (AuthProvider가 localStorage에서 읽어옴)
      const userName = page.locator('[data-testid="user-name"]');
      const logoutButton = page.locator('[data-testid="logout-button"]');
      
      // 3-3. 로그인 성공 후 /diaries 페이지 헤더 부분에 유저 정보와 로그아웃 버튼 노출 여부 확인
      await expect(userName).toBeVisible();
      await expect(logoutButton).toBeVisible();
    });

    test('로그인 성공 후 layout에서 유저이름, 로그아웃버튼 노출여부 확인 및 로그아웃', async ({ page }) => {
      // 1. /auth/login 페이지 접속
      await page.goto('/auth/login');
      await waitForPageLoad(page);

      // 2. 로그인 시도
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"]');
      const submitButton = page.locator('[data-testid="login-submit-button"]');

      await emailInput.fill('test3@gmail.com');
      await passwordInput.fill('test123!');
      await submitButton.click();

      // 3. 로그인 성공 후 완료 모달 클릭하여 /diaries 페이지 로드 확인
      const modalButton = page.locator('[data-testid="modal-primary-button"]');
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


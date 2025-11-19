import { test, expect, type Page } from '@playwright/test';

test.describe('Diaries Modal Link Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 500ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  };

  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await waitForPageLoad(page);
  });

  test.describe('권한 분기 - 비로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 비로그인 유저를 시뮬레이션하기 위해 window.__TEST_BYPASS__를 false로 설정
      await page.addInitScript(() => {
        window.__TEST_BYPASS__ = false;
      });
      // 페이지 재로드하여 설정 적용
      await page.goto('/diaries');
      await waitForPageLoad(page);
    });

    test('일기쓰기 버튼 클릭 시 로그인요청모달이 노출되어야 한다', async ({ page }) => {
      // 일기쓰기 버튼 찾기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await expect(writeButton).toBeVisible();

      // 일기쓰기 버튼 클릭
      await writeButton.click();

      // 로그인요청모달이 나타나야 함
      await expect(page.locator('[data-testid="auth-guard-login-modal"]')).toBeVisible({ timeout: 500 });

      // 로그인요청모달에 기대되는 텍스트가 있는지 확인
      await expect(page.locator('[data-testid="auth-guard-login-modal"]')).toContainText('로그인하시겠습니까');
      await expect(page.locator('[data-testid="auth-guard-login-modal"]')).toContainText('이 기능은 회원 전용 기능입니다. 로그인이 필요합니다.');

      // 일기쓰기 모달은 표시되지 않아야 함
      await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible();
    });
  });

  test.describe('권한 분기 - 로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 유저를 시뮬레이션하기 위해 window.__TEST_BYPASS__를 true로 설정
      await page.addInitScript(() => {
        window.__TEST_BYPASS__ = true;
      });
      // 페이지 재로드하여 설정 적용
      await page.goto('/diaries');
      await waitForPageLoad(page);
    });

    test('일기쓰기 버튼 클릭 시 일기쓰기 페이지 모달이 노출되어야 한다', async ({ page }) => {
      // 일기쓰기 버튼 찾기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await expect(writeButton).toBeVisible();

      // 일기쓰기 버튼 클릭
      await writeButton.click();

      // 일기쓰기 모달이 나타나야 함
      await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 500 });

      // 로그인요청모달은 표시되지 않아야 함
      await expect(page.locator('[data-testid="auth-guard-login-modal"]')).not.toBeVisible();

      // 모달 내용 확인
      await expect(page.locator('[data-testid="diary-modal"]')).toContainText('일기 쓰기');
    });
  });

  test.describe('기본 모달 기능 (로그인 유저)', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 유저를 기본값으로 설정
      await page.addInitScript(() => {
        window.__TEST_BYPASS__ = true;
      });
      // 페이지 재로드하여 설정 적용
      await page.goto('/diaries');
      await waitForPageLoad(page);
    });

    test('일기쓰기 버튼 클릭시 모달이 열려야 한다', async ({ page }) => {
      // 일기쓰기 버튼 찾기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await expect(writeButton).toBeVisible();

      // 모달이 처음에는 보이지 않아야 함
      await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible();

      // 일기쓰기 버튼 클릭
      await writeButton.click();

      // 모달이 나타나야 함
      await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 500 });
      
      // 모달 내용 확인 - 일기 쓰기 제목이 있어야 함
      await expect(page.locator('[data-testid="diary-modal"]')).toContainText('일기 쓰기');
    });

    test('모달이 열린 후 등록하기 버튼이 동작해야 한다', async ({ page }) => {
      // 일기쓰기 버튼 클릭하여 모달 열기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await writeButton.click();

      // 모달이 열렸는지 확인
      await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

      // 등록하기 버튼이 보이는지 확인 (초기에는 비활성화 상태)
      const submitButton = page.getByRole('button', { name: '등록하기' });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeDisabled();
      
      // 유효한 데이터 입력하여 버튼 활성화
      await page.getByLabel('행복해요').check();
      await page.getByPlaceholder('제목을 입력합니다.').fill('테스트 제목');
      await page.getByPlaceholder('내용을 입력합니다.').fill('테스트 내용');
      
      // 등록하기 버튼이 활성화되었는지 확인
      await expect(submitButton).toBeEnabled();
      
      // 등록하기 버튼을 클릭하면 성공 모달이 나타나야 함
      await submitButton.click();

      // 성공 모달 확인
      await expect(page.locator('[data-testid="submit-success-modal"]')).toBeVisible({ timeout: 500 });
    });

    test('모달 내 닫기 버튼 클릭시 등록취소 확인 후 모달이 닫혀야 한다', async ({ page }) => {
      // 일기쓰기 버튼 클릭하여 모달 열기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await writeButton.click();

      // 모달이 열렸는지 확인
      await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

      // 모달 내 닫기 버튼 클릭
      const closeButton = page.getByRole('button', { name: '닫기' });
      await closeButton.click();

      // 등록취소 확인 모달이 나타나야 함
      await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible({ timeout: 500 });
      
      // 등록취소 버튼 클릭
      const cancelButton = page.locator('[data-testid="cancel-confirmation-modal"]').getByRole('button', { name: '등록취소' });
      await cancelButton.click();

      // 모든 모달이 닫혀야 함
      await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible({ timeout: 500 });
      await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible({ timeout: 500 });
    });

    test('모달이 페이지에 오버레이되어야 한다', async ({ page }) => {
      // 일기쓰기 버튼 클릭하여 모달 열기
      const writeButton = page.getByRole('button', { name: '일기쓰기' });
      await writeButton.click();

      // 모달 컨테이너 확인
      const modalContainer = page.locator('[data-testid="diary-modal"]');
      await expect(modalContainer).toBeVisible();

      // 모달 내용이 있는지 확인
      await expect(modalContainer).toContainText('일기 쓰기');
      await expect(modalContainer).toContainText('오늘 기분은 어땠나요?');
      
      // 닫기 버튼과 등록하기 버튼이 있는지 확인
      await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
      await expect(page.getByRole('button', { name: '등록하기' })).toBeVisible();
    });
  });
});

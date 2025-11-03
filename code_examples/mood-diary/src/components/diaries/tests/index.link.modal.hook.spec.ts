import { test, expect, type Page } from '@playwright/test';

test.describe('Diaries Modal Link Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 400ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 400 });
  };

  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
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
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 400 });
    
    // 모달 내용 확인 - 일기 쓰기 제목이 있어야 함
    await expect(page.locator('[data-testid="diary-modal"]')).toContainText('일기 쓰기');
  });

  test('모달이 열린 후 등록하기 버튼이 동작해야 한다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.getByRole('button', { name: '일기쓰기' });
    await writeButton.click();

    // 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

    // 등록하기 버튼이 보이는지 확인
    const submitButton = page.getByRole('button', { name: '등록하기' });
    await expect(submitButton).toBeVisible();
    
    // 등록하기 버튼을 클릭하면 모달이 닫혀야 함
    await submitButton.click();

    // 모달이 닫혀야 함
    await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible({ timeout: 400 });
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
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible({ timeout: 400 });
    
    // 등록취소 버튼 클릭
    const cancelButton = page.locator('[data-testid="cancel-confirmation-modal"]').getByRole('button', { name: '등록취소' });
    await cancelButton.click();

    // 모든 모달이 닫혀야 함
    await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible({ timeout: 400 });
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible({ timeout: 400 });
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

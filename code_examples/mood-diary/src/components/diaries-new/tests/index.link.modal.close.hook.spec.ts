import { test, expect, type Page } from '@playwright/test';

test.describe('DiariesNew Modal Close Hook', () => {
  /**
   * 페이지 로드 완료를 확인하는 헬퍼 함수
   * timeout: 400ms (500ms 미만 요구사항 준수)
   */
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 400 });
  };

  /**
   * 일기쓰기 모달 열기
   */
  const openDiaryModal = async (page: Page) => {
    const writeButton = page.getByRole('button', { name: '일기쓰기' });
    await writeButton.click();
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 400 });
  };

  test.beforeEach(async ({ page }) => {
    // 로그인 유저로 설정 (기본값)
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = true;
    });
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await waitForPageLoad(page);
    // 일기쓰기 모달 열기
    await openDiaryModal(page);
  });

  test('일기쓰기 모달의 닫기 버튼 클릭시 등록취소모달이 열려야 한다', async ({ page }) => {
    // 일기쓰기 모달이 열려있는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

    // 닫기 버튼 클릭
    const closeButton = page.getByRole('button', { name: '닫기' });
    await closeButton.click();

    // 등록취소모달이 나타나야 함
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible({ timeout: 400 });
    
    // 등록취소모달에 올바른 텍스트가 있는지 확인
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toContainText('등록을 취소하시겠습니까?');
  });

  test('등록취소모달이 일기쓰기모달 위에 중앙 overlay 되어야 한다', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소모달 열기
    const closeButton = page.getByRole('button', { name: '닫기' });
    await closeButton.click();

    // 등록취소모달이 보이는지 확인
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible();

    // 일기쓰기 모달도 여전히 존재해야 함 (2중 모달)
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();
  });

  test('등록취소모달의 "계속작성" 버튼 클릭시 등록취소모달만 닫혀야 한다', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소모달 열기
    const closeButton = page.getByRole('button', { name: '닫기' });
    await closeButton.click();

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible();

    // "계속작성" 버튼 클릭 (등록취소모달 내부의 버튼)
    const continueButton = page.locator('[data-testid="cancel-confirmation-modal"]').getByRole('button', { name: '계속작성' });
    await continueButton.click();

    // 등록취소모달만 닫혀야 함
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible({ timeout: 400 });
    
    // 일기쓰기 모달은 여전히 열려있어야 함
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();
  });

  test('등록취소모달의 "등록취소" 버튼 클릭시 모든 모달이 닫혀야 한다', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소모달 열기
    const closeButton = page.getByRole('button', { name: '닫기' });
    await closeButton.click();

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).toBeVisible();

    // "등록취소" 버튼 클릭 (등록취소모달 내부의 버튼)
    const cancelButton = page.locator('[data-testid="cancel-confirmation-modal"]').getByRole('button', { name: '등록취소' });
    await cancelButton.click();

    // 등록취소모달이 닫혀야 함
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible({ timeout: 400 });
    
    // 일기쓰기 모달도 닫혀야 함
    await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible({ timeout: 400 });
  });
});

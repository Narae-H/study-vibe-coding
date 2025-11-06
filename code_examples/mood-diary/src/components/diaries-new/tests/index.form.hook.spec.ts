import { test, expect, type Page } from '@playwright/test';

test.describe('DiariesNew Form Hook', () => {
  const waitForPageLoad = async (page: Page) => {
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 400 });
  };

  const openDiaryModal = async (page: Page) => {
    const writeButton = page.getByRole('button', { name: '일기쓰기' });
    await writeButton.click();
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 400 });
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/diaries');
    await waitForPageLoad(page);
    // 각 테스트 시작 전 로컬스토리지 초기화
    await page.evaluate(() => localStorage.removeItem('diaries'));
  });

  test('모든 인풋이 유효할 때만 등록하기 버튼이 활성화되어야 한다', async ({ page }) => {
    await openDiaryModal(page);

    const submitButton = page.getByRole('button', { name: '등록하기' });
    await expect(submitButton).toBeDisabled();

    // 감정 선택 (기본값이 존재하지만 라디오 변경 시나리오도 검증)
    await page.getByLabel('행복해요').check();

    // 제목 입력
    await page.getByPlaceholder('제목을 입력합니다.').fill('테스트 제목');

    // 내용 입력
    await page.getByPlaceholder('내용을 입력합니다.').fill('테스트 내용');

    await expect(submitButton).toBeEnabled();
  });

  test('등록 성공 시 성공 모달 노출 후 확인 클릭 시 상세 페이지로 이동해야 한다', async ({ page }) => {
    await openDiaryModal(page);

    // 입력 채우기
    await page.getByLabel('행복해요').check();
    await page.getByPlaceholder('제목을 입력합니다.').fill('등록 제목');
    await page.getByPlaceholder('내용을 입력합니다.').fill('등록 내용');

    // 제출
    await page.getByRole('button', { name: '등록하기' }).click();

    // 성공 모달 확인
    const successModal = page.locator('[data-testid="submit-success-modal"]');
    await expect(successModal).toBeVisible({ timeout: 400 });
    await expect(successModal).toContainText('등록이 완료되었습니다.');

    // 확인 클릭 -> 상세 페이지로 이동 및 모든 모달 닫힘
    await successModal.getByRole('button', { name: '확인' }).click();

    // /diaries/<id> 로 이동 확인
    await expect(page).toHaveURL(/\/diaries\/[0-9]+$/);

    // 로컬스토리지에 diaries 저장 확인
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('diaries');
      return raw ? JSON.parse(raw) : null;
    });
    expect(Array.isArray(stored)).toBeTruthy();
    expect(stored.length).toBe(1);
    expect(typeof stored[0].id === 'number' || /^\d+$/.test(String(stored[0].id))).toBeTruthy();
    expect(stored[0].title).toBe('등록 제목');
    expect(stored[0].content).toBe('등록 내용');
    expect(stored[0].emotion).toBe('HAPPY');
  });

  test('기존 diaries 가 있을 경우 id 는 가장 큰 값+1 이어야 한다', async ({ page }) => {
    // 기존 데이터 주입 (실제 로컬스토리지 사용, 모킹 금지 조건 충족)
    await page.evaluate(() => {
      localStorage.setItem('diaries', JSON.stringify([
        { id: 2, title: 'old1', content: 'old1', emotion: 'SAD', createdAt: new Date().toISOString() },
        { id: 5, title: 'old2', content: 'old2', emotion: 'ANGRY', createdAt: new Date().toISOString() }
      ]));
    });

    await openDiaryModal(page);

    await page.getByLabel('행복해요').check();
    await page.getByPlaceholder('제목을 입력합니다.').fill('새 제목');
    await page.getByPlaceholder('내용을 입력합니다.').fill('새 내용');
    await page.getByRole('button', { name: '등록하기' }).click();

    const successModal = page.locator('[data-testid="submit-success-modal"]');
    await expect(successModal).toBeVisible({ timeout: 400 });
    await successModal.getByRole('button', { name: '확인' }).click();

    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('diaries');
      return raw ? JSON.parse(raw) : null;
    });
    const ids = stored.map((d: Record<string, unknown>) => Number(d.id));
    expect(Math.max(...ids)).toBe(6); // 기존 max 5 -> 신규 6
  });

  test('빈 제목으로 등록 시도 시 등록하기 버튼이 비활성화되어야 한다', async ({ page }) => {
    await openDiaryModal(page);

    const submitButton = page.getByRole('button', { name: '등록하기' });
    
    // 감정 선택
    await page.getByLabel('행복해요').check();
    
    // 제목은 비우고 내용만 입력
    await page.getByPlaceholder('내용을 입력합니다.').fill('내용만 있음');
    
    // 등록하기 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('빈 내용으로 등록 시도 시 등록하기 버튼이 비활성화되어야 한다', async ({ page }) => {
    await openDiaryModal(page);

    const submitButton = page.getByRole('button', { name: '등록하기' });
    
    // 감정 선택
    await page.getByLabel('행복해요').check();
    
    // 내용은 비우고 제목만 입력
    await page.getByPlaceholder('제목을 입력합니다.').fill('제목만 있음');
    
    // 등록하기 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('공백만 있는 제목과 내용으로 등록 시도 시 등록하기 버튼이 비활성화되어야 한다', async ({ page }) => {
    await openDiaryModal(page);

    const submitButton = page.getByRole('button', { name: '등록하기' });
    
    // 감정 선택
    await page.getByLabel('행복해요').check();
    
    // 공백만 입력
    await page.getByPlaceholder('제목을 입력합니다.').fill('   ');
    await page.getByPlaceholder('내용을 입력합니다.').fill('   ');
    
    // 등록하기 버튼이 비활성화되어야 함 (zod trim() 검증)
    await expect(submitButton).toBeDisabled();
  });

  test('등록완료모달이 올바른 variant와 actions로 표시되어야 한다', async ({ page }) => {
    await openDiaryModal(page);

    // 유효한 데이터 입력
    await page.getByLabel('행복해요').check();
    await page.getByPlaceholder('제목을 입력합니다.').fill('모달 테스트');
    await page.getByPlaceholder('내용을 입력합니다.').fill('모달 내용');
    await page.getByRole('button', { name: '등록하기' }).click();

    // 성공 모달 확인
    const successModal = page.locator('[data-testid="submit-success-modal"]');
    await expect(successModal).toBeVisible({ timeout: 400 });
    
    // 모달 내용 검증 (variant: 'info', actions: 'single' 조건)
    await expect(successModal).toContainText('등록이 완료되었습니다.');
    await expect(successModal).toContainText('작성한 일기가 등록되었어요.');
    
    // single action이므로 확인 버튼만 있어야 함
    const confirmButton = successModal.getByRole('button', { name: '확인' });
    await expect(confirmButton).toBeVisible();
    
    // 취소 버튼은 없어야 함 (single action)
    const cancelButton = successModal.getByRole('button', { name: '취소' });
    await expect(cancelButton).not.toBeVisible();
  });

  test('로컬스토리지에 저장되는 데이터 구조가 요구사항과 일치해야 한다', async ({ page }) => {
    await openDiaryModal(page);

    // 유효한 데이터 입력
    await page.getByLabel('슬퍼요').check(); // 다른 감정 선택
    await page.getByPlaceholder('제목을 입력합니다.').fill('데이터 구조 테스트');
    await page.getByPlaceholder('내용을 입력합니다.').fill('데이터 구조 검증용 내용');
    await page.getByRole('button', { name: '등록하기' }).click();

    const successModal = page.locator('[data-testid="submit-success-modal"]');
    await expect(successModal).toBeVisible({ timeout: 400 });
    await successModal.getByRole('button', { name: '확인' }).click();

    // 로컬스토리지 데이터 구조 검증
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('diaries');
      return raw ? JSON.parse(raw) : null;
    });
    
    expect(Array.isArray(stored)).toBeTruthy();
    expect(stored.length).toBe(1);
    
    const diary = stored[0];
    // 요구사항: { id: number, title: string, content: string, emotion: enum, createdAt: string }
    expect(typeof diary.id).toBe('number');
    expect(typeof diary.title).toBe('string');
    expect(typeof diary.content).toBe('string');
    expect(typeof diary.emotion).toBe('string');
    expect(typeof diary.createdAt).toBe('string');
    
    // 실제 값 검증
    expect(diary.title).toBe('데이터 구조 테스트');
    expect(diary.content).toBe('데이터 구조 검증용 내용');
    expect(diary.emotion).toBe('SAD'); // 슬퍼요 = SAD enum
    expect(diary.id).toBe(1); // 첫 번째 일기이므로 id는 1
    
    // createdAt이 유효한 ISO 문자열인지 확인
    expect(() => new Date(diary.createdAt)).not.toThrow();
    expect(new Date(diary.createdAt).toISOString()).toBe(diary.createdAt);
  });
});


import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 수정 기능 테스트
 * 
 * 테스트 시나리오:
 * 1. /diaries/[id]에 접속하여 페이지 로드 확인
 * 2. 수정 버튼 클릭하여 수정 모드로 전환
 * 3. 수정중 UI 확인 (emotion, title, content 입력 가능)
 * 4. 수정중 상태에서 회고 입력창 비활성화 확인
 * 5. 데이터 수정 후 수정하기 버튼 클릭
 * 6. 수정 완료 후 원래 상태로 돌아가고 데이터 변경 확인
 */

test.describe('일기 상세 수정 기능', () => {
  // 테스트용 실제 데이터 설정
  const testDiaryId = 1;
  const testDiary = {
    id: testDiaryId,
    title: '이것은 타이틀 입니다.',
    content: '내용이 들어갑니다'.repeat(45),
    emotion: EmotionType.HAPPY,
    createdAt: '2024. 07. 12'
  };

  const updatedDiary = {
    title: '수정된 타이틀입니다.',
    content: '수정된 내용입니다.',
    emotion: EmotionType.SAD
  };

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries/1');
    
    // 실제 데이터를 로컬스토리지에 저장
    await page.evaluate((diary) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.setItem('retrospects', JSON.stringify([
        {
          id: 1,
          content: '회고 내용입니다.',
          diaryId: 1,
          createdAt: '2024. 07. 13'
        }
      ]));
    }, testDiary);

    // 페이지 리로드하여 데이터 반영
    await page.reload();
  });

  test('수정 버튼 클릭 시 수정 모드로 전환된다', async ({ page }) => {
    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 초기 상태 확인 - 수정전 UI (3:1124)
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(testDiary.title);
    await expect(page.locator('[data-testid="diary-content"]')).toBeVisible();
    
    // 수정 버튼 확인 및 클릭
    const editButton = page.locator('[data-testid="edit-button"]');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 수정중 UI (3:1224) 확인
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();
    
    // emotion 선택 영역 표시 확인
    await expect(page.locator('[data-testid="emotion-radio-group"]')).toBeVisible();
    
    // title 입력 필드 확인
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue(testDiary.title);
    
    // content 입력 필드 확인
    const contentInput = page.locator('[data-testid="edit-content-textarea"]');
    await expect(contentInput).toBeVisible();
    await expect(contentInput).toHaveValue(testDiary.content);
    
    // 수정하기, 취소 버튼 확인
    await expect(page.locator('[data-testid="update-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="cancel-button"]')).toBeVisible();
  });

  test('수정중 상태에서 회고 입력창이 비활성화된다', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 수정 전에 회고 입력창이 활성화되어 있는지 확인
    await expect(page.locator('[data-testid="retrospect-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="retrospect-input"]')).not.toBeDisabled();

    // 수정 버튼 클릭
    const editButton = page.locator('[data-testid="edit-button"]');
    await editButton.click();

    // 수정중 UI 표시 대기
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();

    // 회고 입력창이 사라지고 비활성화 메시지가 표시됨 (3:1249)
    await expect(page.locator('[data-testid="retrospect-input"]')).not.toBeVisible();
    
    // 비활성화 메시지 확인
    await expect(page.locator('[data-testid="retrospect-disabled-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retrospect-disabled-message"]')).toHaveText('수정중일땐 회고를 작성할 수 없어요.');
    
    // 회고 입력 버튼 비활성화 확인
    const retrospectSubmitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await expect(retrospectSubmitButton).toBeDisabled();
  });

  test('수정 모드에서 취소 버튼 클릭 시 원래 상태로 돌아간다', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 수정 버튼 클릭
    await page.locator('[data-testid="edit-button"]').click();
    
    // 수정중 UI 확인
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();

    // 취소 버튼 클릭
    const cancelButton = page.locator('[data-testid="cancel-button"]');
    await cancelButton.click();

    // 원래 UI로 복귀 확인
    await expect(page.locator('[data-testid="edit-mode-container"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(testDiary.title);
    
    // 회고 입력창 활성화 확인
    await expect(page.locator('[data-testid="retrospect-input"]')).not.toBeDisabled();
  });

  test('일기를 수정하고 수정하기 버튼 클릭 시 데이터가 업데이트된다', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 수정 버튼 클릭
    await page.locator('[data-testid="edit-button"]').click();
    
    // 수정중 UI 대기
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();

    // emotion 변경 (SAD 선택)
    const sadRadio = page.locator('[data-testid="emotion-radio-SAD"]');
    await sadRadio.click();
    await expect(sadRadio).toBeChecked();

    // title 변경
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.fill('');
    await titleInput.fill(updatedDiary.title);
    await expect(titleInput).toHaveValue(updatedDiary.title);

    // content 변경
    const contentInput = page.locator('[data-testid="edit-content-textarea"]');
    await contentInput.fill('');
    await contentInput.fill(updatedDiary.content);
    await expect(contentInput).toHaveValue(updatedDiary.content);

    // 수정하기 버튼 클릭
    const updateButton = page.locator('[data-testid="update-button"]');
    await updateButton.click();

    // 페이지 리로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 원래 UI로 복귀 확인
    await expect(page.locator('[data-testid="edit-mode-container"]')).not.toBeVisible();

    // 수정된 데이터 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(updatedDiary.title);
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText(updatedDiary.content);
    
    // emotion 변경 확인 (슬퍼요)
    await expect(page.locator('[data-testid="diary-emotion-text"]')).toHaveText('슬퍼요');

    // 로컬스토리지 데이터 확인
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    });

    expect(localStorageData).toHaveLength(1);
    expect(localStorageData[0].title).toBe(updatedDiary.title);
    expect(localStorageData[0].content).toBe(updatedDiary.content);
    expect(localStorageData[0].emotion).toBe(EmotionType.SAD);
  });

  test('필수 필드가 비어있으면 수정하기 버튼이 비활성화된다', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 수정 버튼 클릭
    await page.locator('[data-testid="edit-button"]').click();
    
    // 수정중 UI 대기
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();

    const updateButton = page.locator('[data-testid="update-button"]');

    // title 비우기
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.fill('');
    
    // 수정하기 버튼 비활성화 확인
    await expect(updateButton).toBeDisabled();

    // title 다시 입력
    await titleInput.fill('새 타이틀');
    
    // content 비우기
    const contentInput = page.locator('[data-testid="edit-content-textarea"]');
    await contentInput.fill('');
    
    // 수정하기 버튼 비활성화 확인
    await expect(updateButton).toBeDisabled();

    // content 다시 입력
    await contentInput.fill('새 내용');
    
    // 수정하기 버튼 활성화 확인
    await expect(updateButton).not.toBeDisabled();
  });

  test('emotion 선택 변경이 정상적으로 동작한다', async ({ page }) => {
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 수정 버튼 클릭
    await page.locator('[data-testid="edit-button"]').click();
    
    // 수정중 UI 대기
    await expect(page.locator('[data-testid="edit-mode-container"]')).toBeVisible();

    // 초기 emotion 확인 (HAPPY)
    const happyRadio = page.locator('[data-testid="emotion-radio-HAPPY"]');
    await expect(happyRadio).toBeChecked();

    // 각 emotion 순회하며 선택 테스트
    const emotions = [
      { type: EmotionType.SAD, label: '슬퍼요' },
      { type: EmotionType.SURPRISE, label: '놀랐어요' },
      { type: EmotionType.ANGRY, label: '화나요' },
      { type: EmotionType.ETC, label: '기타' },
      { type: EmotionType.HAPPY, label: '행복해요' }
    ];

    for (const emotion of emotions) {
      const radio = page.locator(`[data-testid="emotion-radio-${emotion.type}"]`);
      await radio.click();
      await expect(radio).toBeChecked();
    }
  });
});


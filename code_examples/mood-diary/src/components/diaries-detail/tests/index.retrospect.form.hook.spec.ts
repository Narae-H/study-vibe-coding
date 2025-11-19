import { test, expect } from '@playwright/test';

/**
 * 회고 폼 등록 기능 테스트
 * 
 * 테스트 시나리오:
 * 1. 회고 입력시 버튼 활성화
 * 2. 등록 버튼 클릭시 로컬스토리지에 저장
 * 3. 등록 완료 후 페이지 새로고침
 */

test.describe('회고 폼 등록 기능', () => {
  // 테스트 데이터 설정
  const testDiary = {
    id: 1,
    title: '테스트 일기',
    content: '테스트 내용입니다.',
    emotion: 'HAPPY',
    createdAt: '2024. 01. 01'
  };

  test.beforeEach(async ({ page }) => {
    // 페이지 로드 전에 로컬스토리지 데이터 설정
    await page.addInitScript((diary) => {
      // diaries 데이터 설정
      localStorage.setItem('diaries', JSON.stringify([diary]));
      // retrospects 초기화 - 기존 데이터가 없을 때만 빈 배열로 설정
      if (!localStorage.getItem('retrospects')) {
        localStorage.setItem('retrospects', JSON.stringify([]));
      }
      // 로그인 상태 설정
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', 'test@example.com');
    }, testDiary);

    // 로컬스토리지 데이터가 설정된 상태로 페이지 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid로 식별)
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();
  });

  test('회고 입력이 비어있을 때 버튼이 비활성화되어야 함', async ({ page }) => {
    // 회고 입력 필드 찾기
    const input = page.locator('[data-testid="retrospect-input"]');
    const button = page.locator('[data-testid="retrospect-submit-button"]');

    // 입력이 비어있을 때 버튼 비활성화 확인
    await expect(input).toHaveValue('');
    await expect(button).toBeDisabled();
  });

  test('회고 입력이 있을 때 버튼이 활성화되어야 함', async ({ page }) => {
    // 회고 입력 필드와 버튼 찾기
    const input = page.locator('[data-testid="retrospect-input"]');
    const button = page.locator('[data-testid="retrospect-submit-button"]');

    // 회고 입력
    await input.fill('첫 번째 회고입니다.');

    // 버튼 활성화 확인
    await expect(button).toBeEnabled();
  });

  test('회고 등록시 로컬스토리지에 새 배열로 저장되어야 함 (기존 retrospects 없음)', async ({ page }) => {
    // 회고 입력 필드와 버튼 찾기
    const input = page.locator('[data-testid="retrospect-input"]');
    const button = page.locator('[data-testid="retrospect-submit-button"]');

    // 회고 입력
    const retrospectContent = '첫 번째 회고입니다.';
    await input.fill(retrospectContent);

    // 등록 버튼 클릭
    await button.click();

    // 페이지 새로고침 대기
    await page.waitForLoadState('load');
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();

    // 로컬스토리지 확인
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });

    // 검증
    expect(retrospects).toBeTruthy();
    expect(Array.isArray(retrospects)).toBe(true);
    expect(retrospects.length).toBe(1);
    expect(retrospects[0].id).toBe(1);
    expect(retrospects[0].content).toBe(retrospectContent);
    expect(retrospects[0].diaryId).toBe(1);
    expect(retrospects[0].createdAt).toBeTruthy();
  });

  test('회고 등록시 기존 배열에 추가되어야 함 (기존 retrospects 있음)', async ({ page }) => {
    // 첫 번째 회고 등록
    let input = page.locator('[data-testid="retrospect-input"]');
    let button = page.locator('[data-testid="retrospect-submit-button"]');

    const firstRetrospectContent = '첫 번째 회고입니다.';
    await input.fill(firstRetrospectContent);
    await button.click();

    // 페이지 새로고침 대기
    await page.waitForLoadState('load');
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();

    // 두 번째 회고 등록
    input = page.locator('[data-testid="retrospect-input"]');
    button = page.locator('[data-testid="retrospect-submit-button"]');

    const secondRetrospectContent = '두 번째 회고입니다.';
    await input.fill(secondRetrospectContent);
    await button.click();

    // 페이지 새로고침 대기
    await page.waitForLoadState('load');
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();

    // 로컬스토리지 확인
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });

    // 검증
    expect(retrospects).toBeTruthy();
    expect(Array.isArray(retrospects)).toBe(true);
    expect(retrospects.length).toBe(2);
    expect(retrospects[0].id).toBe(1);
    expect(retrospects[0].content).toBe(firstRetrospectContent);
    expect(retrospects[1].id).toBe(2); // 가장 큰 ID + 1
    expect(retrospects[1].content).toBe(secondRetrospectContent);
    expect(retrospects[0].diaryId).toBe(1);
    expect(retrospects[1].diaryId).toBe(1);
    expect(retrospects[0].createdAt).toBeTruthy();
    expect(retrospects[1].createdAt).toBeTruthy();
  });

  test('여러 회고를 연속으로 등록할 수 있어야 함', async ({ page }) => {
    const retrospects = [
      '첫 번째 회고입니다.',
      '두 번째 회고입니다.',
      '세 번째 회고입니다.'
    ];

    for (let i = 0; i < retrospects.length; i++) {
      // 페이지 로드 확인
      await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();

      // 회고 입력 필드와 버튼 찾기
      const input = page.locator('[data-testid="retrospect-input"]');
      const button = page.locator('[data-testid="retrospect-submit-button"]');

      // 입력 필드가 비어있는지 확인
      await expect(input).toHaveValue('');

      // 회고 입력 - fill() 대신 click + type 사용하여 모든 이벤트 트리거
      await input.click();
      await input.type(retrospects[i]);

      // 입력 값 확인
      await expect(input).toHaveValue(retrospects[i]);

      // 버튼이 활성화될 때까지 대기
      await expect(button).toBeEnabled({ timeout: 5000 });

      // 등록 버튼 클릭
      await button.click();

      // 페이지 새로고침 대기
      await page.waitForLoadState('load');

      // 컴포넌트가 완전히 마운트될 때까지 대기
      await page.waitForTimeout(1000);

      // 각 iteration 후 로컬스토리지 확인
      const currentRetrospects = await page.evaluate(() => {
        const data = localStorage.getItem('retrospects');
        return data ? JSON.parse(data) : null;
      });

      // 현재까지 등록된 회고 개수 확인
      expect(currentRetrospects).toBeTruthy();
      expect(Array.isArray(currentRetrospects)).toBe(true);
      expect(currentRetrospects.length).toBe(i + 1);
    }

    // 최종 검증 (마지막 iteration에서 이미 확인됨)
    // 마지막 로컬스토리지 상태 재확인
    const savedRetrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });

    // 최종 검증
    expect(savedRetrospects).toBeTruthy();
    expect(Array.isArray(savedRetrospects)).toBe(true);
    expect(savedRetrospects.length).toBe(3);
    
    // ID가 순차적으로 증가하는지 확인
    expect(savedRetrospects[0].id).toBe(1);
    expect(savedRetrospects[1].id).toBe(2);
    expect(savedRetrospects[2].id).toBe(3);
    
    // 내용 확인
    expect(savedRetrospects[0].content).toBe(retrospects[0]);
    expect(savedRetrospects[1].content).toBe(retrospects[1]);
    expect(savedRetrospects[2].content).toBe(retrospects[2]);
  });

  test('빈 문자열은 등록되지 않아야 함', async ({ page }) => {
    // 회고 입력 필드와 버튼 찾기
    const input = page.locator('[data-testid="retrospect-input"]');
    const button = page.locator('[data-testid="retrospect-submit-button"]');

    // 공백만 입력
    await input.fill('   ');

    // 버튼이 비활성화되어야 함
    await expect(button).toBeDisabled();
  });

  test('등록 후 입력 필드가 초기화되어야 함', async ({ page }) => {
    // 회고 입력 필드와 버튼 찾기
    const input = page.locator('[data-testid="retrospect-input"]');
    const button = page.locator('[data-testid="retrospect-submit-button"]');

    // 회고 입력
    await input.fill('회고 내용입니다.');

    // 등록 버튼 클릭
    await button.click();

    // 페이지 새로고침 대기
    await page.waitForLoadState('load');
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();

    // 입력 필드 초기화 확인
    const inputAfter = page.locator('[data-testid="retrospect-input"]');
    await expect(inputAfter).toHaveValue('');
  });
});


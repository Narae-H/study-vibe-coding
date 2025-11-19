import { test, expect } from '@playwright/test';

/**
 * Pictures 페이지 필터 기능 테스트
 * 
 * 테스트 시나리오:
 * 1. /pictures 페이지 로드 확인
 * 2. 필터 선택박스 존재 확인
 * 3. 각 필터 옵션 선택 시 이미지 크기 변경 확인
 *    - 기본: 640x640
 *    - 가로형: 640x480
 *    - 세로형: 480x640
 */
test.describe('Pictures 페이지 - 필터 기능', () => {
  
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지 로드 대기 (pictures-container가 보일 때까지)
    await page.waitForSelector('[data-testid="pictures-container"]');
  });

  test('필터 선택박스가 표시되어야 함', async ({ page }) => {
    // 필터 선택박스가 존재하는지 확인
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await expect(filterSelect).toBeVisible();
    
    // 기본 placeholder 또는 기본값 확인
    const buttonText = await filterSelect.locator('button').textContent();
    expect(buttonText).toContain('기본');
  });

  test('기본 필터 선택 시 640x640 크기 유지', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.locator('button').click();
    
    // "기본" 옵션 클릭
    await page.locator('[role="option"]').filter({ hasText: '기본' }).click();
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지 컨테이너 크기 확인
    const firstImageItem = page.locator('[data-testid="image-item"]').first();
    const boundingBox = await firstImageItem.boundingBox();
    
    // 640x640 크기 확인 (약간의 오차 허용)
    expect(boundingBox?.width).toBeCloseTo(640, 1);
    expect(boundingBox?.height).toBeCloseTo(640, 1);
  });

  test('가로형 필터 선택 시 640x480 크기로 변경', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.locator('button').click();
    
    // "가로형" 옵션 클릭
    await page.locator('[role="option"]').filter({ hasText: '가로형' }).click();
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지 컨테이너 크기 확인
    const firstImageItem = page.locator('[data-testid="image-item"]').first();
    const boundingBox = await firstImageItem.boundingBox();
    
    // 640x480 크기 확인 (약간의 오차 허용)
    expect(boundingBox?.width).toBeCloseTo(640, 1);
    expect(boundingBox?.height).toBeCloseTo(480, 1);
  });

  test('세로형 필터 선택 시 480x640 크기로 변경', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.locator('button').click();
    
    // "세로형" 옵션 클릭
    await page.locator('[role="option"]').filter({ hasText: '세로형' }).click();
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지 컨테이너 크기 확인
    const firstImageItem = page.locator('[data-testid="image-item"]').first();
    const boundingBox = await firstImageItem.boundingBox();
    
    // 480x640 크기 확인 (약간의 오차 허용)
    expect(boundingBox?.width).toBeCloseTo(480, 1);
    expect(boundingBox?.height).toBeCloseTo(640, 1);
  });

  test('필터 변경 시 모든 이미지 크기가 일관되게 변경되어야 함', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.locator('button').click();
    
    // "가로형" 옵션 클릭
    await page.locator('[role="option"]').filter({ hasText: '가로형' }).click();
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 모든 이미지 컨테이너 가져오기 (최소 3개 확인)
    const imageItems = page.locator('[data-testid="image-item"]');
    const count = await imageItems.count();
    
    // 최소 3개의 이미지가 있는지 확인
    expect(count).toBeGreaterThanOrEqual(3);
    
    // 처음 3개의 이미지 크기 확인
    for (let i = 0; i < Math.min(3, count); i++) {
      const imageItem = imageItems.nth(i);
      const boundingBox = await imageItem.boundingBox();
      
      expect(boundingBox?.width).toBeCloseTo(640, 1);
      expect(boundingBox?.height).toBeCloseTo(480, 1);
    }
  });
});


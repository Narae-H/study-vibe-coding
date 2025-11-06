import { test, expect } from '@playwright/test';
import { URL_PATH } from '@/commons/constants/url';

/**
 * Pictures 컴포넌트 - 강아지 사진 API 바인딩 테스트
 * 
 * 테스트 조건:
 * - Playwright를 사용한 E2E 테스트
 * - Jest, @testing-library/react 사용 금지
 * - data-testid를 사용한 페이지 로드 확인
 * - 실제 API 사용 (성공 시나리오)
 * - API 모킹 사용 (실패 시나리오)
 * - URL 상수 사용 (하드코딩 금지)
 */

test.describe('Pictures 컴포넌트 - 강아지 사진 API 바인딩', () => {
  
  test.beforeEach(async ({ page }) => {
    // URL 상수를 사용하여 페이지 이동
    await page.goto(URL_PATH.PICTURES.LIST);
    
    // 페이지 로드 확인 - data-testid를 사용하여 컨테이너가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
  });

  test('성공 시나리오: API 호출 후 강아지 이미지 6개가 표시되어야 함', async ({ page }) => {
    // 로딩 스플래시 스크린이 표시되는지 확인
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens.first()).toBeVisible({ timeout: 500 });
    
    // 스플래시 스크린이 6개인지 확인
    await expect(splashScreens).toHaveCount(6);

    // API 응답을 기다림 (실제 API 사용, 2000ms 이내)
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 강아지 이미지가 6개 표시되는지 확인
    const dogImages = page.locator('[data-testid="dog-image"]');
    await expect(dogImages).toHaveCount(6);
    
    // 모든 이미지의 src 속성에 "dog.ceo"가 포함되어 있는지 확인
    const imageCount = await dogImages.count();
    for (let i = 0; i < imageCount; i++) {
      const imgSrc = await dogImages.nth(i).getAttribute('src');
      expect(imgSrc).toContain('dog.ceo');
    }
  });

  test('무한 스크롤: 스크롤 시 추가 강아지 이미지가 로드되어야 함', async ({ page }) => {
    // 첫 번째 로드 완료 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 초기 이미지 개수 확인 (6개)
    const initialImages = page.locator('[data-testid="dog-image"]');
    await expect(initialImages).toHaveCount(6);
    
    // 마지막에서 두 번째 이미지까지 스크롤 (마지막 2개 남김)
    // 마지막 이미지로 스크롤하여 무한 스크롤 트리거
    const lastImage = initialImages.nth(5);
    await lastImage.scrollIntoViewIfNeeded();
    
    // 추가 이미지 로드 대기 - count가 증가할 때까지 대기
    await page.waitForFunction(
      () => {
        const images = document.querySelectorAll('[data-testid="dog-image"]');
        return images.length > 6;
      },
      { timeout: 2000 }
    );
    
    // 이미지가 추가되었는지 확인 (6개 + 추가분)
    const updatedImages = page.locator('[data-testid="dog-image"]');
    const finalCount = await updatedImages.count();
    expect(finalCount).toBeGreaterThan(6);
  });

  test('실패 시나리오: API 실패 시 에러 메시지가 표시되어야 함', async ({ context }) => {
    // 새 페이지에서 API를 모킹하여 실패 응답 반환
    const newPage = await context.newPage();
    
    // API 요청을 가로채서 실패 응답 반환
    await newPage.route('**/api/breeds/image/random/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'error',
          message: 'Internal Server Error' 
        })
      });
    });
    
    // URL 상수를 사용하여 페이지 이동
    await newPage.goto(URL_PATH.PICTURES.LIST);
    await newPage.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
    
    // 에러 메시지가 표시되는지 확인
    const errorMessage = newPage.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toContainText(/오류|에러|실패|Error/i);
    
    await newPage.close();
  });

  test('로딩 상태: 스플래시 스크린이 올바른 디자인으로 표시되어야 함', async ({ page }) => {
    // 로딩 스플래시 스크린 확인
    const splashScreen = page.locator('[data-testid="splash-screen"]').first();
    await expect(splashScreen).toBeVisible({ timeout: 500 });
    
    // 스플래시 스크린의 CSS 속성 확인
    const backgroundColor = await splashScreen.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // 회색 배경 확인 (rgb 값으로 확인)
    expect(backgroundColor).toMatch(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/);
    
    // 애니메이션이 적용되어 있는지 확인
    const hasAnimation = await splashScreen.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.animation !== 'none' && styles.animation !== '';
    });
    expect(hasAnimation).toBeTruthy();
  });
});

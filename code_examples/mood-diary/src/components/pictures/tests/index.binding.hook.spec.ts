import { test, expect, Page } from '@playwright/test';
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
 * - timeout: network 통신 2000ms 미만, 일반 500ms 미만
 */

/**
 * 페이지 로드 대기 헬퍼 함수
 * data-testid 기반 대기 (networkidle 사용 금지)
 */
async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
}

test.describe('Pictures 컴포넌트 - 강아지 사진 API 바인딩', () => {
  
  test.beforeEach(async ({ page }) => {
    // Given: URL 상수를 사용하여 페이지 이동
    await page.goto(URL_PATH.PICTURES.LIST);
    
    // 페이지 로드 확인
    await waitForPageLoad(page);
  });

  test('성공 시나리오: API 호출 후 강아지 이미지 6개가 표시되어야 함', async ({ page }) => {
    // Given: 페이지가 로드됨 (beforeEach에서 처리)
    
    // When: 로딩 스플래시 스크린이 표시됨
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens.first()).toBeVisible({ timeout: 500 });
    
    // Then: 스플래시 스크린이 6개여야 함
    await expect(splashScreens).toHaveCount(6);

    // When: API 응답을 기다림 (실제 API 사용, Mock 데이터 사용 금지)
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // Then: 강아지 이미지가 정확히 6개 표시되어야 함
    const dogImages = page.locator('[data-testid="dog-image"]');
    await expect(dogImages).toHaveCount(6);
    
    // Then: 모든 이미지의 src 속성에 "dog.ceo"가 포함되어야 함 (실제 API 응답 검증)
    const imageCount = await dogImages.count();
    for (let i = 0; i < imageCount; i++) {
      const imgSrc = await dogImages.nth(i).getAttribute('src');
      expect(imgSrc).toContain('dog.ceo');
    }
    
    // Then: 모든 이미지가 실제로 화면에 보여야 함
    for (let i = 0; i < imageCount; i++) {
      await expect(dogImages.nth(i)).toBeVisible();
    }
  });

  test('무한 스크롤: 스크롤 시 추가 강아지 이미지가 로드되어야 함', async ({ page }) => {
    // Given: 첫 번째 로드 완료 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // Given: 초기 이미지 개수 확인 (정확히 6개)
    const initialImages = page.locator('[data-testid="dog-image"]');
    await expect(initialImages).toHaveCount(6);
    
    // When: 마지막 이미지로 스크롤 (마지막 2개 남김 조건 트리거)
    const lastImage = initialImages.nth(5);
    await lastImage.scrollIntoViewIfNeeded();
    
    // Then: 추가 이미지 로드 대기 - count가 증가할 때까지 대기
    await page.waitForFunction(
      () => {
        const images = document.querySelectorAll('[data-testid="dog-image"]');
        return images.length > 6;
      },
      { timeout: 2000 }
    );
    
    // Then: 이미지가 추가되었는지 확인 (6개 + 추가 6개 = 12개)
    const updatedImages = page.locator('[data-testid="dog-image"]');
    const finalCount = await updatedImages.count();
    expect(finalCount).toBeGreaterThanOrEqual(12);
    
    // Then: 추가된 이미지들도 "dog.ceo"를 포함해야 함
    for (let i = 6; i < Math.min(finalCount, 12); i++) {
      const imgSrc = await updatedImages.nth(i).getAttribute('src');
      expect(imgSrc).toContain('dog.ceo');
    }
  });

  test('실패 시나리오: API 실패 시 에러 메시지가 표시되어야 함', async ({ context }) => {
    // Given: 새 페이지 생성 및 API 모킹 설정
    const newPage = await context.newPage();
    
    // Given: API 요청을 가로채서 실패 응답 반환 (API 모킹 사용)
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
    
    // When: URL 상수를 사용하여 페이지 이동
    await newPage.goto(URL_PATH.PICTURES.LIST);
    await newPage.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
    
    // Then: 에러 메시지가 화면에 표시되어야 함
    const errorMessage = newPage.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toContainText(/오류|에러|실패|Error/i);
    
    // Then: 강아지 이미지는 표시되지 않아야 함
    const dogImages = newPage.locator('[data-testid="dog-image"]');
    await expect(dogImages).toHaveCount(0);
    
    await newPage.close();
  });

  test('로딩 상태: 스플래시 스크린이 올바른 디자인으로 표시되어야 함', async ({ page }) => {
    // Given: 페이지가 로드되고 로딩 중인 상태
    const splashScreen = page.locator('[data-testid="splash-screen"]').first();
    
    // When: 로딩 스플래시 스크린이 표시됨
    await expect(splashScreen).toBeVisible({ timeout: 500 });
    
    // Then: 스플래시 스크린의 CSS 속성 검증
    
    // 1. 회색 배경 확인 (rgb 값)
    const backgroundColor = await splashScreen.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColor).toMatch(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/);
    
    // 2. border-radius 확인 (24px 라운드 코너)
    const borderRadius = await splashScreen.evaluate(el => {
      return window.getComputedStyle(el).borderRadius;
    });
    expect(borderRadius).toBe('24px');
    
    // 3. 크기 확인 (640x640px)
    const { width, height } = await splashScreen.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(width).toBe(640);
    expect(height).toBe(640);
    
    // 4. 애니메이션이 적용되어 있는지 확인 (빠르게 반복)
    const hasAnimation = await splashScreen.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.animation !== 'none' && styles.animation !== '';
    });
    expect(hasAnimation).toBeTruthy();
  });

  test('로딩 완료 후 스플래시 스크린이 사라져야 함', async ({ page }) => {
    // Given: 페이지 로드 시 스플래시 스크린 표시
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens.first()).toBeVisible({ timeout: 500 });
    
    // When: API 응답 완료 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // Then: 스플래시 스크린이 사라지고 실제 이미지만 표시되어야 함
    await expect(splashScreens).toHaveCount(0);
    
    const dogImages = page.locator('[data-testid="dog-image"]');
    await expect(dogImages).toHaveCount(6);
  });

  test('이미지 alt 속성이 올바르게 설정되어야 함', async ({ page }) => {
    // Given: API 응답 완료 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // When: 강아지 이미지 확인
    const dogImages = page.locator('[data-testid="dog-image"]');
    
    // Then: 모든 이미지에 적절한 alt 속성이 있어야 함 (접근성)
    const imageCount = await dogImages.count();
    for (let i = 0; i < imageCount; i++) {
      const altText = await dogImages.nth(i).getAttribute('alt');
      expect(altText).toContain('강아지');
    }
  });

  test('연속 무한 스크롤: 여러 번 스크롤 시 계속 이미지가 로드되어야 함', async ({ page }) => {
    // Given: 첫 번째 로드 완료
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    let currentCount = await page.locator('[data-testid="dog-image"]').count();
    expect(currentCount).toBe(6);
    
    // When/Then: 2번 연속 스크롤하여 이미지가 계속 추가되는지 확인
    for (let scrollCount = 0; scrollCount < 2; scrollCount++) {
      // 현재 마지막 이미지로 스크롤
      const images = page.locator('[data-testid="dog-image"]');
      const lastImage = images.nth(currentCount - 1);
      await lastImage.scrollIntoViewIfNeeded();
      
      // 이미지가 추가될 때까지 대기
      const previousCount = currentCount;
      await page.waitForFunction(
        (prevCount) => {
          const imgs = document.querySelectorAll('[data-testid="dog-image"]');
          return imgs.length > prevCount;
        },
        previousCount,
        { timeout: 2000 }
      );
      
      // 이미지 개수 증가 확인
      currentCount = await images.count();
      expect(currentCount).toBeGreaterThan(previousCount);
    }
    
    // 최종적으로 18개 이상의 이미지가 있어야 함 (6 + 6 + 6)
    expect(currentCount).toBeGreaterThanOrEqual(18);
  });
});

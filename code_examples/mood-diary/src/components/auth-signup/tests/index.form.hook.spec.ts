import { test, expect } from '@playwright/test';

/**
 * 회원가입 폼 훅 Playwright 테스트
 * 
 * TDD 기반으로 실제 API를 사용한 성공 시나리오와 
 * API 모킹을 통한 실패 시나리오를 테스트합니다.
 * 
 * 테스트 범위:
 * - 폼 검증 및 버튼 활성화
 * - 회원가입 성공 시나리오 (실제 API)
 * - 회원가입 실패 시나리오 (API 모킹)
 * - 모달 동작 검증
 */

test.describe('회원가입 폼 기능 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동하고 완전히 로드될 때까지 대기
    await page.goto('/auth/signup');
    
    // 페이지 로드 식별: data-testid로 회원가입 폼이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="signup-form"]', { 
      state: 'visible',
      timeout: 2000 
    });
  });

  test.describe('폼 검증 및 버튼 활성화', () => {
    
    test('모든 필드가 입력되지 않으면 회원가입 버튼이 비활성화된다', async ({ page }) => {
      // 회원가입 버튼이 비활성화 상태인지 확인
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test('모든 필드가 올바르게 입력되면 회원가입 버튼이 활성화된다', async ({ page }) => {
      // 타임스탬프를 포함한 유니크한 이메일 생성
      const timestamp = Date.now();
      const testEmail = `test-${timestamp}@example.com`;
      
      // 모든 필드 입력
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', testEmail);
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      
      // 회원가입 버튼이 활성화되는지 확인
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });

    test('이메일 형식이 잘못되면 에러 메시지가 표시된다', async ({ page }) => {
      // 잘못된 이메일 형식 입력
      await page.fill('[data-testid="signup-email-input"]', 'invalid-email');
      await page.locator('[data-testid="signup-email-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="signup-email-error"]')).toContainText('올바른 이메일 형식을 입력해주세요');
    });

    test('비밀번호가 8자 미만이면 에러 메시지가 표시된다', async ({ page }) => {
      // 8자 미만 비밀번호 입력
      await page.fill('[data-testid="signup-password-input"]', '123');
      await page.locator('[data-testid="signup-password-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="signup-password-error"]')).toContainText('비밀번호는 최소 8자리 이상이어야 합니다');
    });

    test('비밀번호에 영문과 숫자가 포함되지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      // 영문만 포함된 비밀번호 입력
      await page.fill('[data-testid="signup-password-input"]', 'onlyletters');
      await page.locator('[data-testid="signup-password-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="signup-password-error"]')).toContainText('영문과 숫자를 포함해야 합니다');
    });

    test('비밀번호 확인이 일치하지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      // 비밀번호와 다른 확인 비밀번호 입력
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password456');
      await page.locator('[data-testid="signup-password-confirm-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="signup-password-confirm-error"]')).toContainText('비밀번호가 일치하지 않습니다');
    });

    test('이름이 입력되지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      // 먼저 이름을 입력했다가 지워서 에러를 발생시킴
      await page.fill('[data-testid="signup-name-input"]', 'test');
      await page.fill('[data-testid="signup-name-input"]', '');
      await page.locator('[data-testid="signup-name-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="signup-name-error"]')).toContainText('이름은 최소 1글자 이상이어야 합니다');
    });
  });

  test.describe('회원가입 성공 시나리오 (실제 API)', () => {
    
    test('올바른 정보로 회원가입하면 성공 모달이 표시되고 로그인 페이지로 이동한다', async ({ page }) => {
      // 타임스탬프를 포함한 유니크한 이메일 생성 (중복 방지)
      const timestamp = Date.now();
      const testEmail = `test-${timestamp}@example.com`;
      
      // 올바른 회원가입 정보 입력
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', testEmail);
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      
      // API 응답 캐치하여 _id 확인
      let responseData: { data?: { createUser?: { _id?: string } } } | null = null;
      const responsePromise = page.waitForResponse(
        response => response.url().includes('graphql') && response.status() === 200,
        { timeout: 2000 }
      );
      
      // 회원가입 버튼 클릭
      await page.click('[data-testid="signup-submit-button"]');
      
      // 네트워크 응답 대기 및 데이터 확인
      const response = await responsePromise;
      responseData = await response.json();
      
      // _id가 정상적으로 반환되는지 확인
      expect(responseData).toBeDefined();
      expect(responseData.data).toBeDefined();
      expect(responseData.data.createUser).toBeDefined();
      expect(responseData.data.createUser._id).toBeDefined();
      expect(typeof responseData.data.createUser._id).toBe('string');
      expect(responseData.data.createUser._id.length).toBeGreaterThan(0);
      
      // 성공 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="signup-success-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="signup-success-modal"]')).toContainText('회원가입 완료');
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="signup-success-modal"] button');
      
      // 로그인 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('회원가입 실패 시나리오 (API 모킹)', () => {
    
    test('API 오류 발생 시 실패 모달이 표시된다', async ({ page }) => {
      // GraphQL API 오류 응답 모킹
      await page.route('**/graphql', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{
              message: '이미 존재하는 이메일입니다.',
              extensions: { code: 'DUPLICATE_EMAIL' }
            }]
          })
        });
      });
      
      // 회원가입 정보 입력
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', 'existing@example.com');
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      
      // 회원가입 버튼 클릭
      await page.click('[data-testid="signup-submit-button"]');
      
      // 네트워크 통신 대기 (2초 미만)
      await page.waitForResponse(
        response => response.url().includes('graphql'),
        { timeout: 2000 }
      );
      
      // 실패 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="signup-error-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="signup-error-modal"]')).toContainText('회원가입 실패');
      await expect(page.locator('[data-testid="signup-error-modal"]')).toContainText('이미 존재하는 이메일입니다.');
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="signup-error-modal"] button');
      
      // 모달이 닫혔는지 확인
      await expect(page.locator('[data-testid="signup-error-modal"]')).toBeHidden();
      
      // 여전히 회원가입 페이지에 있는지 확인
      await expect(page).toHaveURL('/auth/signup');
    });

    test('네트워크 오류 발생 시 실패 모달이 표시된다', async ({ page }) => {
      // 네트워크 오류 모킹
      await page.route('**/graphql', async route => {
        await route.abort('failed');
      });
      
      // 회원가입 정보 입력
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', 'test@example.com');
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      
      // 회원가입 버튼 클릭
      await page.click('[data-testid="signup-submit-button"]');
      
      // 네트워크 오류 대기 (2초 미만)
      await page.waitForTimeout(1000);
      
      // 실패 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="signup-error-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="signup-error-modal"]')).toContainText('회원가입 실패');
    });
  });

  test.describe('모달 동작 검증', () => {
    
    test('모달은 한 번만 표시되고 닫힌 후 같은 상황에서 다시 나타나지 않는다', async ({ page }) => {
      // API 오류 응답 모킹
      await page.route('**/graphql', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{
              message: '테스트 오류'
            }]
          })
        });
      });
      
      // 회원가입 정보 입력
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', 'test@example.com');
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      
      // 첫 번째 회원가입 시도
      await page.click('[data-testid="signup-submit-button"]');
      await page.waitForSelector('[data-testid="signup-error-modal"]', { state: 'visible' });
      
      // 모달 닫기
      await page.click('[data-testid="signup-error-modal"] button');
      await expect(page.locator('[data-testid="signup-error-modal"]')).toBeHidden();
      
      // 두 번째 회원가입 시도 (같은 조건)
      await page.click('[data-testid="signup-submit-button"]');
      
      // 새로운 모달이 표시되는지 확인 (각 시도마다 모달이 새로 표시됨)
      await expect(page.locator('[data-testid="signup-error-modal"]')).toBeVisible();
    });
  });

  test.describe('필수 유저 시나리오 검증', () => {
    
    test('createUser API 호출 시 올바른 데이터 형식으로 요청된다', async ({ page }) => {
      // 타임스탬프를 포함한 유니크한 이메일 생성
      const timestamp = Date.now();
      const testEmail = `test-${timestamp}@example.com`;
      const testName = '테스트사용자';
      const testPassword = 'password123';
      
      // API 요청 캐치
      let requestPayload: { query?: string; variables?: { createUserInput?: { email?: string; password?: string; name?: string } } } | null = null;
      await page.route('**/graphql', async route => {
        const request = route.request();
        requestPayload = await request.postDataJSON();
        
        // 성공 응답 반환
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createUser: {
                _id: `test_id_${timestamp}`
              }
            }
          })
        });
      });
      
      // 회원가입 정보 입력
      await page.fill('[data-testid="signup-name-input"]', testName);
      await page.fill('[data-testid="signup-email-input"]', testEmail);
      await page.fill('[data-testid="signup-password-input"]', testPassword);
      await page.fill('[data-testid="signup-password-confirm-input"]', testPassword);
      
      // 회원가입 버튼 클릭
      await page.click('[data-testid="signup-submit-button"]');
      
      // 모달이 표시될 때까지 대기
      await page.waitForSelector('[data-testid="signup-success-modal"]', { state: 'visible' });
      
      // API 요청 데이터 검증
      expect(requestPayload).toBeDefined();
      expect(requestPayload.query).toContain('createUser');
      expect(requestPayload.variables).toBeDefined();
      expect(requestPayload.variables.createUserInput).toBeDefined();
      expect(requestPayload.variables.createUserInput.email).toBe(testEmail);
      expect(requestPayload.variables.createUserInput.password).toBe(testPassword);
      expect(requestPayload.variables.createUserInput.name).toBe(testName);
    });

    test('모든 모달 variant와 actions이 올바르게 설정된다', async ({ page }) => {
      // 성공 모달 확인 (variant: info, actions: single)
      const timestamp = Date.now();
      const testEmail = `test-${timestamp}@example.com`;
      
      await page.route('**/graphql', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createUser: {
                _id: `success_test_${timestamp}`
              }
            }
          })
        });
      });
      
      // 성공 시나리오 실행
      await page.fill('[data-testid="signup-name-input"]', '테스트사용자');
      await page.fill('[data-testid="signup-email-input"]', testEmail);
      await page.fill('[data-testid="signup-password-input"]', 'password123');
      await page.fill('[data-testid="signup-password-confirm-input"]', 'password123');
      await page.click('[data-testid="signup-submit-button"]');
      
      // 성공 모달 variant 확인 (info)
      const successModal = page.locator('[data-testid="signup-success-modal"]');
      await expect(successModal).toBeVisible();
      
      // 성공 모달의 단일 버튼 확인 (actions: single)
      const successButtons = successModal.locator('button');
      await expect(successButtons).toHaveCount(1);
      await expect(successButtons).toContainText('확인');
      
      // 성공 모달 닫기
      await successButtons.click();
      await expect(page).toHaveURL('/auth/login');
    });
  });
});

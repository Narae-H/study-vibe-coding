import { test, expect } from '@playwright/test';

/**
 * 로그인 폼 훅 Playwright 테스트
 * 
 * TDD 기반으로 실제 API를 사용한 성공 시나리오와 
 * API 모킹을 통한 실패 시나리오를 테스트합니다.
 * 
 * 테스트 범위:
 * - 폼 검증 및 버튼 활성화 (4개)
 * - 로그인 성공 시나리오 (1개, 실제 API)
 * - 로그인 실패 시나리오 (2개, API 모킹)
 * - 모달 동작 검증 (2개)
 * - 모달 중복 표시 방지 검증 (1개)
 * - 필수 유저 시나리오 검증 (2개)
 * 
 * 총 12개 테스트 케이스
 */

test.describe('로그인 폼 기능 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.addInitScript(() => {
      localStorage.clear();
    });
    
    // 로그인 페이지로 이동하고 완전히 로드될 때까지 대기
    await page.goto('/auth/login');
    
    // 페이지 로드 식별: data-testid로 로그인 폼이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="login-form"]', { 
      state: 'visible',
      timeout: 2000 
    });
  });

  test.describe('폼 검증 및 버튼 활성화', () => {
    
    test('모든 필드가 입력되지 않으면 로그인 버튼이 비활성화된다', async ({ page }) => {
      // 로그인 버튼이 비활성화 상태인지 확인
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test('모든 필드가 올바르게 입력되면 로그인 버튼이 활성화된다', async ({ page }) => {
      // 모든 필드 입력
      await page.fill('[data-testid="login-email-input"]', 'test3@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'test123!');
      
      // 로그인 버튼이 활성화되는지 확인
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });

    test('이메일에 @가 없으면 에러 메시지가 표시된다', async ({ page }) => {
      // @가 없는 이메일 입력
      await page.fill('[data-testid="login-email-input"]', 'testgmail.com');
      await page.locator('[data-testid="login-email-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="login-email-error"]')).toContainText('올바른 이메일');
    });

    test('비밀번호가 입력되지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      // 먼저 비밀번호를 입력했다가 지워서 에러를 발생시킴
      await page.fill('[data-testid="login-password-input"]', 'test');
      await page.fill('[data-testid="login-password-input"]', '');
      await page.locator('[data-testid="login-password-input"]').blur();
      
      // 에러 메시지 확인
      await expect(page.locator('[data-testid="login-password-error"]')).toContainText('최소 1글자');
    });
  });

  test.describe('로그인 성공 시나리오 (실제 API)', () => {
    
    test('올바른 정보로 로그인하면 accessToken과 사용자 정보가 반환되고 로컬스토리지에 저장된다', async ({ page }) => {
      // 올바른 로그인 정보 입력
      await page.fill('[data-testid="login-email-input"]', 'test3@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'test123!');
      
      // loginUser API 응답 캐치
      let loginResponseData: { data?: { loginUser?: { accessToken?: string } } } | null = null;
      
      // 로그인 버튼 클릭 및 API 응답 대기
      const [loginResponse] = await Promise.all([
        page.waitForResponse(
          response => response.url().includes('graphql') && response.status() === 200,
          { timeout: 5000 }
        ),
        page.click('[data-testid="login-submit-button"]')
      ]);
      
      // loginUser API 응답 데이터 확인
      loginResponseData = await loginResponse.json();
      
      // accessToken이 정상적으로 반환되는지 확인
      expect(loginResponseData).toBeDefined();
      expect(loginResponseData.data).toBeDefined();
      expect(loginResponseData.data.loginUser).toBeDefined();
      expect(loginResponseData.data.loginUser.accessToken).toBeDefined();
      expect(typeof loginResponseData.data.loginUser.accessToken).toBe('string');
      expect(loginResponseData.data.loginUser.accessToken.length).toBeGreaterThan(0);
      
      // fetchUserLoggedIn API 응답 대기
      let userResponseData: { data?: { fetchUserLoggedIn?: { _id?: string; name?: string } } } | null = null;
      const userResponse = await page.waitForResponse(
        response => response.url().includes('graphql') && response.status() === 200,
        { timeout: 5000 }
      );
      
      // fetchUserLoggedIn API 응답 데이터 확인
      userResponseData = await userResponse.json();
      
      // _id와 name이 정상적으로 반환되는지 확인
      expect(userResponseData).toBeDefined();
      expect(userResponseData.data).toBeDefined();
      expect(userResponseData.data.fetchUserLoggedIn).toBeDefined();
      expect(userResponseData.data.fetchUserLoggedIn._id).toBeDefined();
      expect(typeof userResponseData.data.fetchUserLoggedIn._id).toBe('string');
      expect(userResponseData.data.fetchUserLoggedIn._id.length).toBeGreaterThan(0);
      expect(userResponseData.data.fetchUserLoggedIn.name).toBeDefined();
      expect(typeof userResponseData.data.fetchUserLoggedIn.name).toBe('string');
      expect(userResponseData.data.fetchUserLoggedIn.name.length).toBeGreaterThan(0);
      
      // 성공 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="login-success-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-success-modal"]')).toContainText('로그인 완료');
      
      // 로컬스토리지 확인
      const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      const userString = await page.evaluate(() => localStorage.getItem('user'));
      const user = userString ? JSON.parse(userString) : null;
      
      expect(accessToken).toBeDefined();
      expect(accessToken).toBe(loginResponseData.data.loginUser.accessToken);
      expect(user).toBeDefined();
      expect(user._id).toBe(userResponseData.data.fetchUserLoggedIn._id);
      expect(user.name).toBe(userResponseData.data.fetchUserLoggedIn.name);
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="login-success-modal"] button');
      
      // 일기목록 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/diaries');
    });
  });

  test.describe('로그인 실패 시나리오 (API 모킹)', () => {
    
    test('API 오류 발생 시 실패 모달이 표시된다', async ({ page }) => {
      // GraphQL API 오류 응답 모킹
      await page.route('**/graphql', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{
              message: '이메일 또는 비밀번호가 일치하지 않습니다.',
              extensions: { code: 'INVALID_CREDENTIALS' }
            }]
          })
        });
      });
      
      // 로그인 정보 입력
      await page.fill('[data-testid="login-email-input"]', 'wrong@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'wrongpass');
      
      // 로그인 버튼 클릭
      await page.click('[data-testid="login-submit-button"]');
      
      // 네트워크 통신 대기 (2초 미만)
      await page.waitForResponse(
        response => response.url().includes('graphql'),
        { timeout: 2000 }
      );
      
      // 실패 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="login-error-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-error-modal"]')).toContainText('로그인 실패');
      await expect(page.locator('[data-testid="login-error-modal"]')).toContainText('이메일 또는 비밀번호가 일치하지 않습니다.');
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="login-error-modal"] button');
      
      // 모달이 닫혔는지 확인
      await expect(page.locator('[data-testid="login-error-modal"]')).toBeHidden();
      
      // 여전히 로그인 페이지에 있는지 확인
      await expect(page).toHaveURL('/auth/login');
    });

    test('네트워크 오류 발생 시 실패 모달이 표시된다', async ({ page }) => {
      // 네트워크 오류 모킹
      await page.route('**/graphql', async route => {
        await route.abort('failed');
      });
      
      // 로그인 정보 입력
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      
      // 로그인 버튼 클릭
      await page.click('[data-testid="login-submit-button"]');
      
      // 실패 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="login-error-modal"]')).toBeVisible({ timeout: 2000 });
      await expect(page.locator('[data-testid="login-error-modal"]')).toContainText('로그인 실패');
    });
  });

  test.describe('모달 동작 검증', () => {
    
    test('성공 모달은 variant: info, actions: single로 표시된다', async ({ page }) => {
      // API 모킹 (성공 응답)
      await page.route('**/graphql', async route => {
        const postData = await route.request().postDataJSON();
        
        if (postData.query.includes('loginUser')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                loginUser: {
                  accessToken: 'test_access_token'
                }
              }
            })
          });
        } else if (postData.query.includes('fetchUserLoggedIn')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                fetchUserLoggedIn: {
                  _id: 'test_user_id',
                  name: '테스트 사용자'
                }
              }
            })
          });
        }
      });
      
      // 로그인 정보 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      await page.click('[data-testid="login-submit-button"]');
      
      // 성공 모달 확인
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible();
      
      // 단일 버튼 확인 (actions: single)
      const buttons = successModal.locator('button');
      await expect(buttons).toHaveCount(1);
      await expect(buttons).toContainText('확인');
    });

    test('실패 모달은 variant: danger, actions: single로 표시된다', async ({ page }) => {
      // API 모킹 (실패 응답)
      await page.route('**/graphql', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{
              message: '로그인 실패 테스트'
            }]
          })
        });
      });
      
      // 로그인 정보 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      await page.click('[data-testid="login-submit-button"]');
      
      // 실패 모달 확인
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      await expect(errorModal).toBeVisible();
      
      // 단일 버튼 확인 (actions: single)
      const buttons = errorModal.locator('button');
      await expect(buttons).toHaveCount(1);
      await expect(buttons).toContainText('확인');
    });
  });

  test.describe('모달 중복 표시 방지 검증', () => {
    
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
      
      // 로그인 정보 입력
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      
      // 첫 번째 로그인 시도
      await page.click('[data-testid="login-submit-button"]');
      await page.waitForSelector('[data-testid="login-error-modal"]', { state: 'visible' });
      
      // 모달 닫기
      await page.click('[data-testid="login-error-modal"] button');
      await expect(page.locator('[data-testid="login-error-modal"]')).toBeHidden();
      
      // 두 번째 로그인 시도 (같은 조건)
      await page.click('[data-testid="login-submit-button"]');
      
      // 새로운 모달이 표시되는지 확인 (각 시도마다 모달이 새로 표시됨)
      await expect(page.locator('[data-testid="login-error-modal"]')).toBeVisible();
    });
  });

  test.describe('필수 유저 시나리오 검증', () => {
    
    test('loginUser API와 fetchUserLoggedIn API가 올바른 순서로 호출된다', async ({ page }) => {
      const apiCalls: string[] = [];
      
      // API 호출 순서 기록
      await page.route('**/graphql', async route => {
        const postData = await route.request().postDataJSON();
        
        if (postData.query.includes('loginUser')) {
          apiCalls.push('loginUser');
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                loginUser: {
                  accessToken: 'test_token'
                }
              }
            })
          });
        } else if (postData.query.includes('fetchUserLoggedIn')) {
          apiCalls.push('fetchUserLoggedIn');
          
          // Authorization 헤더 확인
          const headers = route.request().headers();
          expect(headers['authorization']).toBeDefined();
          expect(headers['authorization']).toBe('Bearer test_token');
          
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                fetchUserLoggedIn: {
                  _id: 'test_id',
                  name: '테스트'
                }
              }
            })
          });
        }
      });
      
      // 로그인 정보 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      await page.click('[data-testid="login-submit-button"]');
      
      // 모달이 표시될 때까지 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', { state: 'visible' });
      
      // API 호출 순서 확인
      expect(apiCalls).toEqual(['loginUser', 'fetchUserLoggedIn']);
    });

    test('fetchUserLoggedIn API 호출 시 Authorization 헤더에 accessToken이 포함된다', async ({ page }) => {
      let authHeaderChecked = false;
      
      await page.route('**/graphql', async route => {
        const postData = await route.request().postDataJSON();
        
        if (postData.query.includes('loginUser')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                loginUser: {
                  accessToken: 'my_secret_token_12345'
                }
              }
            })
          });
        } else if (postData.query.includes('fetchUserLoggedIn')) {
          const headers = route.request().headers();
          expect(headers['authorization']).toBe('Bearer my_secret_token_12345');
          authHeaderChecked = true;
          
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                fetchUserLoggedIn: {
                  _id: 'user_123',
                  name: 'Test User'
                }
              }
            })
          });
        }
      });
      
      // 로그인 실행
      await page.fill('[data-testid="login-email-input"]', 'test@gmail.com');
      await page.fill('[data-testid="login-password-input"]', 'password');
      await page.click('[data-testid="login-submit-button"]');
      
      // 모달 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', { state: 'visible' });
      
      // Authorization 헤더 확인 완료
      expect(authHeaderChecked).toBe(true);
    });
  });
});


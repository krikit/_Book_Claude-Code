import { test, expect } from '@playwright/test'

test.describe('로그인 기능', () => {
  test('로그인 페이지가 정상적으로 표시된다', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // 로그인 페이지 제목 확인
    await expect(page.getByRole('heading', { name: 'CookShare 로그인' })).toBeVisible()
    
    // 폼 요소들 확인
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#name')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  test('네비게이션에 로그인 버튼이 표시된다', async ({ page }) => {
    await page.goto('/')
    
    // 로그인 버튼 확인
    await expect(page.getByRole('link', { name: '로그인' })).toBeVisible()
    
    // 로그인 버튼 클릭하면 로그인 페이지로 이동
    await page.getByRole('link', { name: '로그인' }).click()
    await expect(page).toHaveURL('/auth/signin')
  })

  test('로그인하지 않고 레시피 등록 페이지 접근하면 로그인 필요 메시지 표시', async ({ page }) => {
    await page.goto('/create')
    
    // 로그인 필요 메시지 확인
    await expect(page.getByText('레시피를 등록하려면 로그인이 필요합니다')).toBeVisible()
    await expect(page.getByRole('link', { name: '로그인하기' })).toBeVisible()
  })

  test('테스트 계정으로 로그인할 수 있다', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // 테스트 계정 이메일 입력
    await page.fill('#email', 'test@cookshare.com')
    await page.fill('#name', '테스트 사용자')
    
    // 로그인 버튼 클릭
    await page.click('button[type="submit"]')
    
    // 홈페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL('/')
    
    // 네비게이션에 사용자 정보와 로그아웃 버튼이 표시되는지 확인
    await expect(page.getByText('안녕하세요, 테스트 사용자님')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible()
  })

  test('로그인 후 레시피 등록 페이지에 접근할 수 있다', async ({ page }) => {
    // 먼저 로그인
    await page.goto('/auth/signin')
    await page.fill('#email', 'test@cookshare.com')
    await page.fill('#name', '테스트 사용자')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
    
    // 레시피 등록 페이지로 이동
    await page.goto('/create')
    
    // 레시피 등록 폼이 표시되는지 확인
    await expect(page.getByRole('heading', { name: '새 레시피 등록' })).toBeVisible()
    await expect(page.locator('#recipe-title')).toBeVisible()
  })

  test('테스트용 계정 정보가 표시된다', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // 테스트용 계정 안내 확인
    await expect(page.getByText('테스트용 계정')).toBeVisible()
    await expect(page.getByText('test@cookshare.com')).toBeVisible()
    await expect(page.getByText('chef@cookshare.com')).toBeVisible()
    await expect(page.getByText('baker@cookshare.com')).toBeVisible()
  })
})
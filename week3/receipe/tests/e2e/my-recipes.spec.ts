import { test, expect } from '@playwright/test'

test.describe('내 레시피 페이지', () => {
  test('로그인하지 않고 접근하면 로그인 페이지로 안내', async ({ page }) => {
    await page.goto('/my-recipes')
    
    // 로그인 필요 메시지 확인
    await expect(page.getByText('내 레시피를 보려면 로그인이 필요합니다')).toBeVisible()
    await expect(page.getByRole('link', { name: '로그인하기' })).toBeVisible()
  })

  test('로그인 후 내 레시피 페이지 접근 가능', async ({ page }) => {
    // 로그인
    await page.goto('/auth/signin')
    await page.fill('#email', 'test@cookshare.com')
    await page.fill('#name', '테스트 사용자')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')

    // 내 레시피 페이지로 이동
    await page.goto('/my-recipes')
    
    // 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '내 레시피' })).toBeVisible()
    await expect(page.getByText('테스트 사용자님이 등록한 레시피')).toBeVisible()
    await expect(page.getByRole('link', { name: '새 레시피 등록' })).toBeVisible()
  })

  test('네비게이션에 내 레시피 메뉴 표시 (로그인 시)', async ({ page }) => {
    // 로그인
    await page.goto('/auth/signin')
    await page.fill('#email', 'test@cookshare.com')
    await page.fill('#name', '테스트 사용자')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
    
    // 네비게이션에 내 레시피 메뉴 확인
    await expect(page.locator('nav').getByRole('link', { name: '내 레시피', exact: true })).toBeVisible()
    
    // 내 레시피 메뉴 클릭
    await page.click('nav a[href="/my-recipes"]')
    await expect(page).toHaveURL('/my-recipes')
    await expect(page.getByRole('heading', { name: '내 레시피' })).toBeVisible()
  })

  test('네비게이션에 내 레시피 메뉴 미표시 (로그아웃 시)', async ({ page }) => {
    await page.goto('/')
    
    // 로그아웃 상태에서 내 레시피 메뉴가 없는지 확인
    await expect(page.locator('nav').getByRole('link', { name: '내 레시피', exact: true })).not.toBeVisible()
  })

  test('내 레시피가 없을 때 안내 메시지 표시', async ({ page }) => {
    // 새로운 사용자로 로그인
    await page.goto('/auth/signin')
    await page.fill('#email', 'newuser@cookshare.com')
    await page.fill('#name', '새 사용자')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')

    // 내 레시피 페이지로 이동
    await page.goto('/my-recipes')
    
    // 빈 상태 메시지 확인
    await expect(page.getByText('아직 등록한 레시피가 없습니다')).toBeVisible()
    await expect(page.getByRole('link', { name: '첫 번째 레시피 등록하기' })).toBeVisible()
  })

  test('내 레시피에서 수정/삭제 버튼 확인', async ({ page }) => {
    // 로그인
    await page.goto('/auth/signin')
    await page.fill('#email', 'chef@cookshare.com')
    await page.fill('#name', '셰프')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
    
    // 레시피 등록
    await page.goto('/create')
    await page.fill('#recipe-title', '테스트 레시피')
    await page.fill('#description', '테스트용 레시피입니다')
    await page.fill('input[placeholder="재료명"]', '김치')
    await page.fill('input[placeholder="양"]', '200g')
    await page.fill('textarea[placeholder="조리 방법을 자세히 설명해주세요"]', '김치를 넣어 끓입니다')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')

    // 내 레시피 페이지로 이동
    await page.goto('/my-recipes')
    
    // 레시피 카드에 수정/삭제 버튼 있는지 확인
    await expect(page.getByText('테스트 레시피')).toBeVisible()
    await expect(page.getByRole('link', { name: '수정' })).toBeVisible()
    await expect(page.getByRole('button', { name: '삭제' })).toBeVisible()
  })
})
import { test, expect } from '@playwright/test'

test.describe('기본 페이지 테스트', () => {
  test('홈페이지가 로드된다', async ({ page }) => {
    await page.goto('/')
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/CookShare/)
    
    // 메인 헤딩 확인
    await expect(page.locator('main h1')).toContainText('맛있는 레시피를 공유해보세요')
  })

  test('레시피 생성 페이지가 로드된다', async ({ page }) => {
    await page.goto('/create')
    
    // 페이지 제목 확인
    await expect(page.locator('main h1')).toContainText('새 레시피 등록')
    
    // 기본 폼 요소들이 있는지 확인
    await expect(page.locator('#recipe-title')).toBeVisible()
    await expect(page.locator('#servings')).toBeVisible()
    await expect(page.locator('#description')).toBeVisible()
  })
})

test.describe('API 기본 테스트', () => {
  test('레시피 목록 API가 응답한다', async ({ request }) => {
    const response = await request.get('/api/recipes')
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('recipes')
    expect(data).toHaveProperty('pagination')
  })
})
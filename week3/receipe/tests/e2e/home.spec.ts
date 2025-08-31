import { test, expect } from '@playwright/test'

test.describe('홈페이지', () => {
  test('홈페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/')
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/CookShare/)
    
    // 메인 헤딩 확인
    await expect(page.getByRole('heading', { name: '맛있는 레시피를 공유해보세요' })).toBeVisible()
    
    // 네비게이션 메뉴 확인
    await expect(page.getByRole('link', { name: 'CookShare' })).toBeVisible()
    await expect(page.locator('nav').getByRole('link', { name: '레시피', exact: true })).toBeVisible()
    await expect(page.locator('nav').getByRole('link', { name: '레시피 등록', exact: true })).toBeVisible()
  })

  test('레시피 등록 버튼이 동작한다', async ({ page }) => {
    await page.goto('/')
    
    // 레시피 등록 버튼 클릭
    await page.getByRole('link', { name: '레시피 등록하기' }).click()
    
    // 레시피 등록 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/create')
    await expect(page.getByRole('heading', { name: '새 레시피 등록' })).toBeVisible()
  })

  test('레시피 목록이 표시된다', async ({ page }) => {
    await page.goto('/')
    
    // 레시피 섹션이 있는지 확인
    await expect(page.getByRole('heading', { name: '최근 레시피' })).toBeVisible()
    
    // 레시피가 없을 때 메시지 또는 레시피 카드가 표시되는지 확인
    const noRecipesMessage = page.getByText('아직 등록된 레시피가 없습니다.')
    const recipeCards = page.locator('[data-testid="recipe-card"]')
    
    const hasNoRecipes = await noRecipesMessage.isVisible()
    const hasRecipes = await recipeCards.count() > 0
    
    expect(hasNoRecipes || hasRecipes).toBeTruthy()
  })
})
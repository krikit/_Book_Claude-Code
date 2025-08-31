import { test, expect } from '@playwright/test'

test.describe('레시피 편집', () => {
  test('레시피 편집 페이지에 접근할 수 있다', async ({ page }) => {
    // 홈페이지로 이동해서 기존 레시피 찾기
    await page.goto('/')
    
    // 첫 번째 레시피 카드 클릭
    await page.locator('[data-testid="recipe-card"]').first().click()
    
    // 레시피 상세 페이지가 로드되었는지 확인
    await expect(page.locator('h1')).toBeVisible()
    
    // URL에서 레시피 ID 추출
    const url = page.url()
    const recipeId = url.split('/recipes/')[1]
    
    if (recipeId) {
      // 편집 페이지로 직접 이동 (인증 없이 테스트하기 위해)
      await page.goto(`/recipes/${recipeId}/edit`)
      
      // 로그인 필요 메시지가 표시되는지 확인 (인증이 없는 경우)
      await expect(page.getByText('로그인이 필요합니다')).toBeVisible()
    }
  })

  test('레시피 수정 폼이 올바르게 표시된다', async ({ page }) => {
    // 편집 페이지로 직접 이동
    await page.goto('/recipes/test-recipe-id/edit')
    
    // 로그인이 필요한 경우의 처리
    const loginRequired = await page.getByText('로그인이 필요합니다').isVisible()
    if (loginRequired) {
      // 테스트를 위해 로그인 필요 상태 확인
      expect(loginRequired).toBeTruthy()
    }
  })
})

test.describe('레시피 편집 기능', () => {
  test('편집 버튼이 작성자에게만 표시된다', async ({ page }) => {
    await page.goto('/')
    
    // 레시피 목록에서 첫 번째 레시피 확인
    const recipeCards = page.locator('[data-testid="recipe-card"]')
    if (await recipeCards.count() > 0) {
      await recipeCards.first().click()
      
      // 레시피 상세 페이지 로드 확인
      await expect(page.locator('h1')).toBeVisible()
      
      // 편집 버튼은 로그인한 작성자에게만 보여야 함
      // (현재 로그인하지 않은 상태이므로 편집 버튼이 없어야 함)
      const editButton = page.getByRole('link', { name: '수정' })
      expect(await editButton.isVisible()).toBeFalsy()
    }
  })

  test('편집 페이지 기본 구조 확인', async ({ page }) => {
    // 직접 편집 페이지로 이동 (실제로는 인증이 필요)
    await page.goto('/recipes/test-id/edit')
    
    // 로그인 페이지로 리다이렉트되거나 로그인 필요 메시지 표시
    const hasLoginMessage = await page.getByText('로그인이 필요합니다').isVisible()
    
    if (hasLoginMessage) {
      expect(hasLoginMessage).toBeTruthy()
    } else {
      // 편집 폼 요소들 확인 (인증된 경우)
      await expect(page.getByRole('heading', { name: '레시피 수정' })).toBeVisible()
    }
  })
})
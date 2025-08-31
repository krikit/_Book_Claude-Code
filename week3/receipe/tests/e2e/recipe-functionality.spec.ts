import { test, expect } from '@playwright/test'

test.describe('레시피 기능 테스트', () => {
  test('레시피 생성 폼 기본 동작', async ({ page }) => {
    await page.goto('/create')
    
    // 기본 정보 입력 - 고유한 타임스탬프 사용
    const timestamp = Date.now()
    const recipeTitle = `테스트 김치찌개 ${timestamp}`
    await page.fill('#recipe-title', recipeTitle)
    await page.fill('#description', '맛있는 김치찌개 레시피입니다')
    await page.fill('#servings', '4')
    
    // 재료 입력
    const ingredientName = page.locator('input[placeholder="재료명"]').first()
    const ingredientAmount = page.locator('input[placeholder="양"]').first()
    const ingredientUnit = page.locator('input[placeholder="단위"]').first()
    
    await ingredientName.fill('김치')
    await ingredientAmount.fill('1')
    await ingredientUnit.fill('컵')
    
    // 조리 단계 입력
    await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').first().fill('김치를 넣고 끓입니다.')
    
    // 폼 제출
    await page.getByRole('button', { name: '레시피 등록' }).click()
    
    // 홈페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL('/')
    
    // 생성된 레시피가 표시되는지 확인 (약간의 대기 시간 필요)
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="recipe-card"]').filter({ hasText: recipeTitle })).toBeVisible()
  })

  test('재료 추가/삭제 기능', async ({ page }) => {
    await page.goto('/create')
    
    // 초기 재료 개수 확인 (1개)
    let ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(1)
    
    // 재료 추가
    await page.getByRole('button', { name: '재료 추가' }).click()
    ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(2)
    
    // 재료 삭제 (2개 이상일 때만 삭제 버튼이 나타남)
    const deleteButtons = page.getByRole('button', { name: '삭제' })
    await deleteButtons.first().click()
    
    ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(1)
  })

  test('조리 단계 추가 기능', async ({ page }) => {
    await page.goto('/create')
    
    // 초기 조리단계 개수 확인 (1개)
    let stepCount = await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').count()
    expect(stepCount).toBe(1)
    
    // 조리단계 추가
    await page.getByRole('button', { name: '단계 추가' }).click()
    stepCount = await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').count()
    expect(stepCount).toBe(2)
  })
})

test.describe('홈페이지 기능', () => {
  test('레시피 목록 표시', async ({ page }) => {
    await page.goto('/')
    
    // 레시피 섹션 확인
    await expect(page.getByRole('heading', { name: '최근 레시피' })).toBeVisible()
    
    // 레시피가 없을 때의 메시지 또는 레시피 카드 확인
    const noRecipesMessage = page.getByText('아직 등록된 레시피가 없습니다.')
    const recipeCards = page.locator('[data-testid="recipe-card"]')
    
    const hasNoRecipes = await noRecipesMessage.isVisible()
    const hasRecipes = await recipeCards.count() > 0
    
    expect(hasNoRecipes || hasRecipes).toBeTruthy()
  })

  test('네비게이션 링크 동작', async ({ page }) => {
    await page.goto('/')
    
    // 레시피 등록 페이지로 이동
    await page.getByRole('link', { name: '레시피 등록하기' }).click()
    await expect(page).toHaveURL('/create')
    
    // 홈으로 다시 이동 (CookShare 로고 클릭)
    await page.getByRole('link', { name: 'CookShare' }).click()
    await expect(page).toHaveURL('/')
  })
})
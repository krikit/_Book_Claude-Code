import { test, expect } from '@playwright/test'

test.describe('레시피 생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create')
  })

  test('레시피 생성 폼이 정상적으로 렌더링된다', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '새 레시피 등록' })).toBeVisible()
    
    // 필수 입력 필드들 확인
    await expect(page.getByLabel('레시피 제목')).toBeVisible()
    await expect(page.getByLabel('인분')).toBeVisible()
    await expect(page.getByLabel('설명')).toBeVisible()
    
    // 재료 섹션 확인
    await expect(page.getByRole('heading', { name: '재료' })).toBeVisible()
    await expect(page.getByRole('button', { name: '재료 추가' })).toBeVisible()
    
    // 조리 단계 섹션 확인
    await expect(page.getByRole('heading', { name: '조리 단계' })).toBeVisible()
    await expect(page.getByRole('button', { name: '단계 추가' })).toBeVisible()
    
    // 제출 버튼 확인
    await expect(page.getByRole('button', { name: '레시피 등록' })).toBeVisible()
  })

  test('새로운 레시피를 생성할 수 있다', async ({ page }) => {
    // 기본 정보 입력 - 고유한 타임스탬프 사용
    const timestamp = Date.now()
    const recipeTitle = `테스트 레시피 ${timestamp}`
    await page.getByLabel('레시피 제목').fill(recipeTitle)
    await page.getByLabel('설명').fill('Playwright 테스트를 위한 레시피입니다.')
    await page.getByLabel('인분').fill('2')
    
    // 재료 입력
    const ingredientName = page.locator('input[placeholder="재료명"]').first()
    const ingredientAmount = page.locator('input[placeholder="양"]').first()
    const ingredientUnit = page.locator('input[placeholder="단위"]').first()
    
    await ingredientName.fill('테스트 재료')
    await ingredientAmount.fill('1')
    await ingredientUnit.fill('개')
    
    // 추가 재료 입력
    await page.getByRole('button', { name: '재료 추가' }).click()
    await page.locator('input[placeholder="재료명"]').nth(1).fill('두 번째 재료')
    await page.locator('input[placeholder="양"]').nth(1).fill('2')
    await page.locator('input[placeholder="단위"]').nth(1).fill('컵')
    
    // 조리 단계 입력
    await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').first().fill('첫 번째 조리 단계입니다.')
    
    // 추가 단계 입력
    await page.getByRole('button', { name: '단계 추가' }).click()
    await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').nth(1).fill('두 번째 조리 단계입니다.')
    
    // 폼 제출
    await page.getByRole('button', { name: '레시피 등록' }).click()
    
    // 홈페이지로 리다이렉트되는지 확인
    await expect(page).toHaveURL('/')
    
    // 생성된 레시피가 표시되는지 확인
    await expect(page.getByText(recipeTitle)).toBeVisible()
  })

  test('필수 필드 없이 제출하면 에러가 발생한다', async ({ page }) => {
    // 제목 없이 제출 시도
    await page.getByRole('button', { name: '레시피 등록' }).click()
    
    // 브라우저의 기본 validation 메시지 확인
    const titleInput = page.getByLabel('레시피 제목')
    await expect(titleInput).toHaveAttribute('required')
  })

  test('재료와 조리단계를 동적으로 추가/삭제할 수 있다', async ({ page }) => {
    // 초기 재료 개수 확인
    let ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(1)
    
    // 재료 추가
    await page.getByRole('button', { name: '재료 추가' }).click()
    ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(2)
    
    // 재료 삭제 (2개 이상일 때만 삭제 버튼이 나타남)
    await page.getByRole('button', { name: '삭제' }).first().click()
    ingredientCount = await page.locator('input[placeholder="재료명"]').count()
    expect(ingredientCount).toBe(1)
    
    // 초기 조리단계 개수 확인
    let stepCount = await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').count()
    expect(stepCount).toBe(1)
    
    // 조리단계 추가
    await page.getByRole('button', { name: '단계 추가' }).click()
    stepCount = await page.locator('textarea[placeholder="조리 방법을 자세히 설명해주세요"]').count()
    expect(stepCount).toBe(2)
  })

  test('이미지 업로드 UI가 정상적으로 표시된다', async ({ page }) => {
    // 메인 이미지 업로드 섹션 확인
    await expect(page.getByText('메인 이미지')).toBeVisible()
    await expect(page.locator('input[type="file"]').first()).toBeVisible()
    await expect(page.getByPlaceholder('이미지 URL 입력')).toBeVisible()
    await expect(page.getByText('파일 업로드 또는 이미지를 붙여넣기')).toBeVisible()
    
    // 단계별 이미지 업로드 UI 확인
    await expect(page.getByText('단계 이미지 (선택사항)')).toBeVisible()
  })

  test('외부 URL로 이미지를 추가할 수 있다', async ({ page }) => {
    const testImageUrl = 'https://via.placeholder.com/150'
    
    // URL 입력 필드에 이미지 URL 입력
    const urlInput = page.getByPlaceholder('이미지 URL 입력')
    await urlInput.fill(testImageUrl)
    
    // 메인 이미지 섹션의 파란색 적용 버튼 클릭 (bg-blue-600 클래스 사용)
    await page.locator('button.bg-blue-600', { hasText: '적용' }).click()
    
    // 이미지가 표시되는지 확인
    await expect(page.locator('img[alt="레시피 이미지"]')).toBeVisible()
    await expect(page.locator('img[alt="레시피 이미지"]')).toHaveAttribute('src', testImageUrl)
  })
})
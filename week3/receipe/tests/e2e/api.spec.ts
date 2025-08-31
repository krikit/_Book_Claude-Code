import { test, expect } from '@playwright/test'

test.describe('API 테스트', () => {
  test('GET /api/recipes - 레시피 목록을 가져올 수 있다', async ({ request }) => {
    const response = await request.get('/api/recipes')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('recipes')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.recipes)).toBeTruthy()
  })

  test('POST /api/recipes - 새 레시피를 생성할 수 있다', async ({ request }) => {
    const newRecipe = {
      title: 'API 테스트 레시피',
      description: 'Playwright API 테스트용 레시피',
      servings: 2,
      difficulty: 'Easy',
      category: 'Main',
      ingredients: [
        { name: '테스트 재료 1', amount: '1', unit: '개' },
        { name: '테스트 재료 2', amount: '2', unit: '컵' },
      ],
      steps: [
        { instruction: '첫 번째 단계입니다.' },
        { instruction: '두 번째 단계입니다.' },
      ],
    }

    const response = await request.post('/api/recipes', {
      data: newRecipe,
    })
    
    expect(response.status()).toBe(201)
    
    const data = await response.json()
    expect(data).toHaveProperty('recipe')
    expect(data.recipe.title).toBe('API 테스트 레시피')
    expect(data.recipe.ingredients).toHaveLength(2)
    expect(data.recipe.steps).toHaveLength(2)
  })

  test('POST /api/recipes - 잘못된 데이터로 요청하면 400 에러가 발생한다', async ({ request }) => {
    const invalidRecipe = {
      // title 누락
      description: '제목이 없는 레시피',
      ingredients: [],
      steps: [],
    }

    const response = await request.post('/api/recipes', {
      data: invalidRecipe,
    })
    
    expect(response.status()).toBe(400)
    
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  test('GET /api/recipes - 검색 기능이 동작한다', async ({ request }) => {
    // 먼저 테스트용 레시피 생성
    await request.post('/api/recipes', {
      data: {
        title: '검색 테스트 김치찌개',
        description: '맛있는 김치찌개',
        ingredients: [{ name: '김치', amount: '1', unit: '컵' }],
        steps: [{ instruction: '김치를 넣고 끓입니다.' }],
      },
    })

    // 검색 테스트
    const response = await request.get('/api/recipes?search=김치')
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.recipes.length).toBeGreaterThan(0)
    
    // 검색 결과에 '김치'가 포함되어 있는지 확인
    const hasKimchi = data.recipes.some((recipe: any) => 
      recipe.title.includes('김치') || 
      (recipe.description && recipe.description.includes('김치'))
    )
    expect(hasKimchi).toBeTruthy()
  })

  test('GET /api/recipes - 페이지네이션이 동작한다', async ({ request }) => {
    // 페이지네이션 테스트
    const response = await request.get('/api/recipes?page=1&limit=2')
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('pagination')
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(2)
    expect(data.recipes.length).toBeLessThanOrEqual(2)
  })
})
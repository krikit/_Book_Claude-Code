'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const recipeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  servings: z.number().min(1, '인분은 1 이상이어야 합니다'),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  image: z.string().optional(),
})

interface Ingredient {
  id?: string
  name: string
  amount: string
  unit: string
  order: number
}

interface Step {
  id?: string
  instruction: string
  image?: string
  order: number
}

interface Recipe {
  id: string
  title: string
  description: string | null
  image: string | null
  servings: number
  prepTime: number | null
  cookTime: number | null
  difficulty: string
  category: string
  author: {
    email: string
  }
  ingredients: Ingredient[]
  steps: Step[]
}

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [steps, setSteps] = useState<Step[]>([])

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      difficulty: 'Medium',
      category: 'Main',
      servings: 4,
    }
  })

  useEffect(() => {
    if (params.id && status !== 'loading') {
      fetchRecipe(params.id as string)
    }
  }, [params.id, status])

  const fetchRecipe = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recipes/${id}`)
      
      if (!response.ok) {
        setError('레시피를 불러오는데 실패했습니다')
        return
      }

      const data = await response.json()
      const recipeData = data.recipe
      
      // 권한 확인
      if (session?.user?.email !== recipeData.author.email) {
        setError('이 레시피를 수정할 권한이 없습니다')
        return
      }

      setRecipe(recipeData)
      
      // 폼 데이터 설정
      form.reset({
        title: recipeData.title,
        description: recipeData.description || '',
        servings: recipeData.servings,
        prepTime: recipeData.prepTime || undefined,
        cookTime: recipeData.cookTime || undefined,
        difficulty: recipeData.difficulty as 'Easy' | 'Medium' | 'Hard',
        category: recipeData.category,
        image: recipeData.image || '',
      })

      setIngredients(recipeData.ingredients.sort((a: Ingredient, b: Ingredient) => a.order - b.order))
      setSteps(recipeData.steps.sort((a: Step, b: Step) => a.order - b.order))
      
    } catch (err) {
      setError('레시피를 불러오는 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '', order: ingredients.length + 1 }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const addStep = () => {
    setSteps([...steps, { instruction: '', order: steps.length + 1 }])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const onSubmit = async (data: z.infer<typeof recipeSchema>) => {
    try {
      setSubmitting(true)
      
      const response = await fetch(`/api/recipes/${recipe?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ingredients: ingredients.map((ing, index) => ({ ...ing, order: index + 1 })),
          steps: steps.map((step, index) => ({ ...step, order: index + 1 }))
        })
      })

      if (!response.ok) {
        throw new Error('레시피 수정에 실패했습니다')
      }

      router.push(`/recipes/${recipe?.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '레시피 수정 중 오류가 발생했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="text-red-600 text-lg mb-4">로그인이 필요합니다</div>
          <Link 
            href="/auth/signin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="text-red-600 text-lg mb-4">{error || '레시피를 찾을 수 없습니다'}</div>
          <Link 
            href="/recipes"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            레시피 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/recipes/${recipe.id}`}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← 레시피로 돌아가기
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">레시피 수정</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-bold text-gray-900">기본 정보</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              레시피 제목 *
            </label>
            <input
              {...form.register('title')}
              id="title"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="맛있는 레시피 제목을 입력하세요"
            />
            {form.formState.errors.title && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              레시피 설명
            </label>
            <textarea
              {...form.register('description')}
              id="description"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="레시피에 대한 간단한 설명을 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지 URL
            </label>
            <input
              {...form.register('image')}
              id="image"
              type="url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                인분 *
              </label>
              <input
                {...form.register('servings', { valueAsNumber: true })}
                id="servings"
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-2">
                준비시간 (분)
              </label>
              <input
                {...form.register('prepTime', { valueAsNumber: true })}
                id="prepTime"
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
                조리시간 (분)
              </label>
              <input
                {...form.register('cookTime', { valueAsNumber: true })}
                id="cookTime"
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                난이도 *
              </label>
              <select
                {...form.register('difficulty')}
                id="difficulty"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">쉬움</option>
                <option value="Medium">보통</option>
                <option value="Hard">어려움</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              {...form.register('category')}
              id="category"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Breakfast">아침</option>
              <option value="Lunch">점심</option>
              <option value="Dinner">저녁</option>
              <option value="Snack">간식</option>
              <option value="Dessert">디저트</option>
              <option value="Main">메인</option>
              <option value="Side">사이드</option>
            </select>
          </div>
        </div>

        {/* 재료 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">재료</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              재료 추가
            </button>
          </div>
          
          <div className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="재료명"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    placeholder="양"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    placeholder="단위"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 조리 단계 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">조리 단계</h2>
            <button
              type="button"
              onClick={addStep}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              단계 추가
            </button>
          </div>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">단계 {index + 1}</h3>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <textarea
                    value={step.instruction}
                    onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                    placeholder="조리 방법을 자세히 설명해주세요"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    value={step.image || ''}
                    onChange={(e) => updateStep(index, 'image', e.target.value)}
                    placeholder="단계별 이미지 URL (선택사항)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Link
            href={`/recipes/${recipe?.id}`}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {submitting ? '수정 중...' : '레시피 수정'}
          </button>
        </div>
      </form>
    </div>
  )
}
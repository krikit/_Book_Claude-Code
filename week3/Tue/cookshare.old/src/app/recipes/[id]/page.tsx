'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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
  createdAt: string
  author: {
    name: string | null
    email: string
  }
  ingredients: {
    id: string
    name: string
    amount: string
    unit: string | null
    order: number
  }[]
  steps: {
    id: string
    instruction: string
    image: string | null
    order: number
  }[]
  _count: {
    likes: number
    comments: number
  }
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchRecipe(params.id as string)
    }
  }, [params.id])

  const fetchRecipe = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recipes/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('레시피를 찾을 수 없습니다')
        } else {
          setError('레시피를 불러오는데 실패했습니다')
        }
        return
      }

      const data = await response.json()
      setRecipe(data.recipe)
    } catch (err) {
      setError('레시피를 불러오는 중 오류가 발생했습니다')
      console.error('레시피 조회 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800'
    }
    const labels = {
      'Easy': '쉬움',
      'Medium': '보통', 
      'Hard': '어려움'
    }
    return { color: colors[difficulty as keyof typeof colors] || colors.Medium, label: labels[difficulty as keyof typeof labels] || difficulty }
  }

  const formatTime = (minutes: number | null) => {
    if (!minutes) return '-'
    if (minutes < 60) return `${minutes}분`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
  }

  const handleDelete = async () => {
    if (!recipe) return
    
    if (!confirm('정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('레시피 삭제에 실패했습니다')
      }

      router.push('/recipes')
    } catch (err) {
      alert('레시피 삭제 중 오류가 발생했습니다')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">레시피 로딩 중...</div>
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

  const difficulty = getDifficultyBadge(recipe.difficulty)

  return (
    <div className="max-w-4xl mx-auto">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <Link 
          href="/recipes"
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← 레시피 목록으로 돌아가기
        </Link>
      </div>

      {/* 레시피 헤더 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {recipe.image && (
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-64 md:h-80 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
              {difficulty.label}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {recipe.category}
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div>🍽️ {recipe.servings}인분</div>
            <div>⏱️ 준비: {formatTime(recipe.prepTime)}</div>
            <div>🔥 조리: {formatTime(recipe.cookTime)}</div>
            <div>👨‍🍳 {recipe.author.name || recipe.author.email}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>❤️ {recipe._count.likes}</span>
              <span>💬 {recipe._count.comments}</span>
              <span>{new Date(recipe.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            {session?.user?.email === recipe.author.email && (
              <div className="flex gap-2">
                <Link 
                  href={`/recipes/${recipe.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:bg-red-400"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 재료 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">재료</h2>
          <ul className="space-y-2">
            {recipe.ingredients
              .sort((a, b) => a.order - b.order)
              .map((ingredient) => (
                <li key={ingredient.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-900">{ingredient.name}</span>
                  <span className="text-gray-600 font-medium">
                    {ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : ''}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        {/* 조리 단계 */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">조리 단계</h2>
          {recipe.steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
              <div key={step.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 leading-relaxed mb-4">{step.instruction}</p>
                    {step.image && (
                      <img 
                        src={step.image} 
                        alt={`단계 ${index + 1}`}
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 하단 액션 */}
      <div className="mt-8 text-center">
        <Link 
          href="/create"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mr-4"
        >
          새 레시피 등록하기
        </Link>
        <Link 
          href="/recipes"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          다른 레시피 보기
        </Link>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  description: string | null
  image: string | null
  displayImage: string | null
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
  _count: {
    likes: number
  }
}

interface ApiResponse {
  recipes: Recipe[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  })

  const fetchRecipes = async (pageNum: number = 1, searchTerm: string = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/recipes?${params}`)
      if (!response.ok) {
        throw new Error('레시피를 불러오는데 실패했습니다')
      }

      const data: ApiResponse = await response.json()
      setRecipes(data.recipes)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes(page, search)
  }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchRecipes(1, search)
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

  if (loading && recipes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">모든 레시피</h1>
        <div className="text-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">모든 레시피</h1>
        <Link 
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 레시피 등록
        </Link>
      </div>

      {/* 검색 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="레시피 제목이나 설명으로 검색..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {recipes.length === 0 && !loading ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg mb-4">
            {search ? '검색 결과가 없습니다' : '아직 등록된 레시피가 없습니다'}
          </div>
          <Link 
            href="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            첫 번째 레시피 등록하기
          </Link>
        </div>
      ) : (
        <>
          {/* 레시피 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recipes.map((recipe) => {
              const difficulty = getDifficultyBadge(recipe.difficulty)
              return (
                <a key={recipe.id} href={`/recipes/${recipe.id}`} data-testid="recipe-card" className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
                        {difficulty.label}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {recipe.category}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                      <div>🍽️ {recipe.servings}인분</div>
                      <div>⏱️ 준비: {formatTime(recipe.prepTime)} | 조리: {formatTime(recipe.cookTime)}</div>
                      <div>👨‍🍳 by {recipe.author.name || recipe.author.email}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-red-500 text-sm">❤️ {recipe._count.likes}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, page - 2)
                if (pageNum > pagination.totalPages) return null
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 border rounded-md ${
                      page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Recipe {
  id: string
  title: string
  description?: string
  image?: string
  displayImage?: string
  author: {
    name?: string
  }
  _count?: {
    likes: number
  }
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      if (response.ok) {
        const data = await response.json()
        setRecipes(data.recipes || [])
      }
    } catch (error) {
      console.error('레시피를 불러오는 중 오류가 발생했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecipe = async (recipeId: string, recipeTitle: string) => {
    if (!confirm(`"${recipeTitle}" 레시피를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('레시피가 삭제되었습니다.')
        // 목록에서 제거
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
      } else {
        const error = await response.json()
        alert(error.error || '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('삭제 중 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          맛있는 레시피를 공유해보세요
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          CookShare에서 다양한 레시피를 발견하고 나만의 레시피를 공유하세요
        </p>
        <a
          href="/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          레시피 등록하기
        </a>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 레시피</h2>
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">아직 등록된 레시피가 없습니다.</p>
            <a
              href="/create"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              첫 번째 레시피를 등록해보세요 →
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <a
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                data-testid="recipe-card"
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {recipe.displayImage && (
                  <img
                    src={recipe.displayImage}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>by {recipe.author.name || '익명'}</span>
                    <div className="flex items-center gap-2">
                      <span>❤️ {recipe._count?.likes || 0}</span>
                      {session?.user?.role === 'ADMIN' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteRecipe(recipe.id, recipe.title)
                          }}
                          className="text-red-500 hover:text-red-700 text-xs ml-2"
                          title="관리자 삭제"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
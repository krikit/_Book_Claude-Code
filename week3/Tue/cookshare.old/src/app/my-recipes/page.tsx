'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
    id: string
    name: string | null
    email: string
  }
  _count: {
    likes: number
    comments: number
  }
}

export default function MyRecipesPage() {
  const { data: session, status } = useSession()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchMyRecipes()
    } else if (status !== 'loading') {
      setLoading(false)
    }
  }, [session, status])

  const fetchMyRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes?author=${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecipes(data.recipes || [])
      } else {
        setError('내 레시피를 불러오는데 실패했습니다')
      }
    } catch (error) {
      console.error('Error fetching my recipes:', error)
      setError('내 레시피를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (recipeId: string, recipeTitle: string) => {
    if (!confirm(`"${recipeTitle}" 레시피를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId))
        alert('레시피가 삭제되었습니다')
      } else {
        const error = await response.json()
        alert('레시피 삭제에 실패했습니다: ' + (error.error || '알 수 없는 오류'))
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('레시피 삭제 중 오류가 발생했습니다')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="text-gray-600 text-lg mb-4">
            내 레시피를 보려면 로그인이 필요합니다
          </div>
          <Link 
            href="/auth/signin?callbackUrl=/my-recipes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 레시피</h1>
          <p className="text-gray-600 mt-2">
            {session.user?.name || session.user?.email}님이 등록한 레시피 ({recipes.length}개)
          </p>
        </div>
        <Link
          href="/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 레시피 등록
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg mb-4">
            아직 등록한 레시피가 없습니다
          </div>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            첫 번째 레시피 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {recipe.displayImage && (
                <img
                  src={recipe.displayImage}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    <Link href={`/recipes/${recipe.id}`}>
                      {recipe.title}
                    </Link>
                  </h2>
                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id, recipe.title)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{recipe.servings}인분</span>
                  {recipe.prepTime && <span>준비 {recipe.prepTime}분</span>}
                  {recipe.cookTime && <span>조리 {recipe.cookTime}분</span>}
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {recipe.difficulty === 'Easy' ? '쉬움' : 
                     recipe.difficulty === 'Medium' ? '보통' : '어려움'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>❤️ {recipe._count.likes}</span>
                    <span>💬 {recipe._count.comments}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
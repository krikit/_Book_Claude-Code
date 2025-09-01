'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Ingredient {
  name: string
  amount: string
  unit?: string
}

interface Step {
  instruction: string
  image?: string
}

export default function CreateRecipe() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 4,
    prepTime: 0,
    cookTime: 0,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    category: 'Main' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Main' | 'Side',
    image: '',
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ])

  const [steps, setSteps] = useState<Step[]>([
    { instruction: '' }
  ])

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingStepImage, setUploadingStepImage] = useState<number | null>(null)

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
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
    setSteps([...steps, { instruction: '' }])
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

  const handleImageUpload = async (file: File, isStepImage = false, stepIndex?: number) => {
    if (isStepImage && stepIndex !== undefined) {
      setUploadingStepImage(stepIndex)
    } else {
      setUploadingImage(true)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        if (isStepImage && stepIndex !== undefined) {
          updateStep(stepIndex, 'image', result.data.url)
        } else {
          setFormData(prev => ({ ...prev, image: result.data.url }))
        }
      } else {
        alert('이미지 업로드 실패: ' + result.error)
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다')
    } finally {
      if (isStepImage && stepIndex !== undefined) {
        setUploadingStepImage(null)
      } else {
        setUploadingImage(false)
      }
    }
  }

  const handleImageFromUrl = async (url: string, isStepImage = false, stepIndex?: number) => {
    if (!url.trim()) return
    
    // 간단한 URL 검증
    try {
      new URL(url)
    } catch {
      alert('올바른 URL을 입력해주세요')
      return
    }

    if (isStepImage && stepIndex !== undefined) {
      updateStep(stepIndex, 'image', url)
    } else {
      setFormData(prev => ({ ...prev, image: url }))
    }
  }

  const handlePaste = async (e: ClipboardEvent, isStepImage = false, stepIndex?: number) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          e.preventDefault()
          await handleImageUpload(file, isStepImage, stepIndex)
          return
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ingredients: ingredients.filter(ing => ing.name && ing.amount),
          steps: steps.filter(step => step.instruction),
        }),
      })

      if (response.ok) {
        router.push('/')
      } else {
        const error = await response.json()
        alert('레시피 등록에 실패했습니다: ' + (error.error || '알 수 없는 오류'))
      }
    } catch (error) {
      console.error('레시피 등록 중 오류:', error)
      alert('레시피 등록 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
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
          <div className="text-gray-600 text-lg mb-4">
            레시피를 등록하려면 로그인이 필요합니다
          </div>
          <Link 
            href="/auth/signin?callbackUrl=/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">새 레시피 등록</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipe-title" className="block text-sm font-medium text-gray-700 mb-2">
                레시피 제목 *
              </label>
              <input
                id="recipe-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="맛있는 김치찌개"
              />
            </div>
            
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                인분
              </label>
              <input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="레시피에 대한 간단한 설명을 적어주세요"
            />
          </div>

          {/* 메인 이미지 업로드 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메인 이미지
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6"
              onPaste={(e) => handlePaste(e as any)}
            >
              {formData.image ? (
                <div className="relative">
                  <img 
                    src={formData.image} 
                    alt="레시피 이미지" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">파일 업로드 또는 이미지를 붙여넣기 (Ctrl+V)</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <div className="text-blue-500 mt-2">업로드 중...</div>}
                  </div>
                  
                  <div className="text-center text-gray-400">또는</div>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="이미지 URL 입력"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          handleImageFromUrl(target.value)
                          target.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                        handleImageFromUrl(input.value)
                        input.value = ''
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                준비시간 (분)
              </label>
              <input
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData({...formData, prepTime: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                조리시간 (분)
              </label>
              <input
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                난이도
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">쉬움</option>
                <option value="Medium">보통</option>
                <option value="Hard">어려움</option>
              </select>
            </div>
          </div>
        </div>

        {/* 재료 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">재료</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              재료 추가
            </button>
          </div>
          
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-4 items-center mb-3">
              <input
                type="text"
                placeholder="재료명"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="양"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="단위"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 조리 단계 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">조리 단계</h2>
            <button
              type="button"
              onClick={addStep}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              단계 추가
            </button>
          </div>
          
          {steps.map((step, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">단계 {index + 1}</h3>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="조리 방법을 자세히 설명해주세요"
                value={step.instruction}
                onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* 단계별 이미지 업로드 */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  단계 이미지 (선택사항)
                </label>
                {step.image ? (
                  <div className="relative inline-block">
                    <img 
                      src={step.image} 
                      alt={`단계 ${index + 1} 이미지`} 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => updateStep(index, 'image', '')}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div 
                    className="space-y-2 border-2 border-dashed border-gray-200 rounded-lg p-3"
                    onPaste={(e) => handlePaste(e as any, true, index)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, true, index)
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      disabled={uploadingStepImage === index}
                    />
                    {uploadingStepImage === index && (
                      <div className="text-green-500 text-sm mt-1">업로드 중...</div>
                    )}
                    <div className="text-center text-gray-300 text-xs">또는</div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="이미지 URL"
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            handleImageFromUrl(target.value, true, index)
                            target.value = ''
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                          handleImageFromUrl(input.value, true, index)
                          input.value = ''
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? '등록 중...' : '레시피 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
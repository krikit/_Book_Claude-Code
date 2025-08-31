'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email) {
      setError('이메일을 입력해주세요')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        name,
        redirect: false
      })

      if (result?.error) {
        setError('로그인에 실패했습니다')
      } else {
        // 세션 새로고침 후 리다이렉트
        await getSession()
        router.push(callbackUrl)
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          CookShare 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소 *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 (선택사항)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="홍길동"
            />
            <p className="text-xs text-gray-500 mt-1">
              처음 로그인하시는 경우 이름을 입력하시면 자동으로 계정이 생성됩니다.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">테스트용 계정</h3>
          <p className="text-sm text-gray-600 mb-2">
            다음 이메일로 로그인하면 기존 레시피들을 편집할 수 있습니다:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• test@cookshare.com (요리왕 김치)</li>
            <li>• chef@cookshare.com (셰프 박파스타)</li>
            <li>• baker@cookshare.com (베이킹마스터)</li>
          </ul>
          
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <h4 className="font-medium text-red-900 mb-1">관리자 계정</h4>
            <p className="text-sm text-red-700">
              • admin@cookshare.com (관리자) - 모든 레시피 삭제 권한
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
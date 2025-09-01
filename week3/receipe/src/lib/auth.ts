import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'email',
      credentials: {
        email: {
          label: '이메일',
          type: 'email',
          placeholder: 'test@cookshare.com'
        },
        name: {
          label: '이름',
          type: 'text',
          placeholder: '테스트 사용자'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          return null
        }

        try {
          // 사용자 찾기 또는 생성 (테스트용)
          const user = await prisma.user.upsert({
            where: { email: credentials.email },
            update: {
              name: credentials.name,
            },
            create: {
              email: credentials.email,
              name: credentials.name,
            },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}
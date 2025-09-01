import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const createRecipeSchema = z.object({
  title: z.string().min(1, '레시피 제목을 입력해주세요'),
  description: z.string().optional(),
  image: z.string().optional(),
  servings: z.number().min(1).default(4),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  category: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Main', 'Side']).default('Main'),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.string().min(1),
    unit: z.string().optional(),
  })),
  steps: z.array(z.object({
    instruction: z.string().min(1),
    image: z.string().optional(),
  })),
})

// GET /api/recipes - 레시피 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const author = searchParams.get('author') || ''
    
    const skip = (page - 1) * limit

    let where: any = {}
    
    // 검색 조건 추가
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    // 작성자 필터 추가
    if (author) {
      where.authorId = author
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        ...where,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        steps: {
          select: {
            image: true,
            order: true,
          },
          orderBy: {
            order: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // 대표 이미지 로직: 메인 이미지가 없으면 마지막 단계 이미지 사용
    const recipesWithDisplayImage = recipes.map(recipe => ({
      ...recipe,
      displayImage: recipe.image || (recipe.steps[0]?.image) || null,
    }))

    const total = await prisma.recipe.count({
      where: {
        ...where,
        published: true,
      },
    })

    return NextResponse.json({
      recipes: recipesWithDisplayImage,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('레시피 목록 조회 실패:', error)
    return NextResponse.json(
      { error: '레시피 목록을 불러오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - 새 레시피 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createRecipeSchema.parse(body)

    // 세션에서 사용자 ID 가져오기
    const authorId = session.user.id

    const recipe = await prisma.recipe.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        image: validatedData.image,
        servings: validatedData.servings,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime,
        difficulty: validatedData.difficulty,
        category: validatedData.category,
        published: true,
        authorId,
        ingredients: {
          create: validatedData.ingredients.map((ingredient, index) => ({
            ...ingredient,
            order: index,
          })),
        },
        steps: {
          create: validatedData.steps.map((step, index) => ({
            ...step,
            order: index,
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ingredients: true,
        steps: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.errors },
        { status: 400 }
      )
    }

    console.error('레시피 생성 실패:', error)
    return NextResponse.json(
      { error: '레시피 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
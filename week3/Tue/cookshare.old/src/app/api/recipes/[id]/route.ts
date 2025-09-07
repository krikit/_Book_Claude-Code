import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/recipes/[id] - 개별 레시피 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
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
        ingredients: {
          orderBy: { order: 'asc' },
        },
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

    if (!recipe) {
      return NextResponse.json(
        { error: '레시피를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('레시피 조회 실패:', error)
    return NextResponse.json(
      { error: '레시피를 불러오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - 레시피 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    
    const {
      title,
      description,
      image,
      servings,
      prepTime,
      cookTime,
      difficulty,
      category,
      ingredients,
      steps
    } = body

    // 기존 레시피 조회 및 권한 확인
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: { email: true }
        }
      }
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { error: '레시피를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    if (existingRecipe.author.email !== session.user.email) {
      return NextResponse.json(
        { error: '이 레시피를 수정할 권한이 없습니다' },
        { status: 403 }
      )
    }

    // 트랜잭션으로 레시피, 재료, 단계를 모두 업데이트
    const updatedRecipe = await prisma.$transaction(async (tx) => {
      // 기존 재료와 단계 삭제
      await tx.ingredient.deleteMany({
        where: { recipeId: id }
      })
      
      await tx.step.deleteMany({
        where: { recipeId: id }
      })

      // 레시피 기본 정보 업데이트
      const recipe = await tx.recipe.update({
        where: { id },
        data: {
          title,
          description: description || null,
          image: image || null,
          servings: parseInt(servings),
          prepTime: prepTime ? parseInt(prepTime) : null,
          cookTime: cookTime ? parseInt(cookTime) : null,
          difficulty,
          category,
        }
      })

      // 새로운 재료 생성
      if (ingredients && ingredients.length > 0) {
        await tx.ingredient.createMany({
          data: ingredients.map((ingredient: any, index: number) => ({
            recipeId: id,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit || null,
            order: index + 1
          }))
        })
      }

      // 새로운 단계 생성
      if (steps && steps.length > 0) {
        await tx.step.createMany({
          data: steps.map((step: any, index: number) => ({
            recipeId: id,
            instruction: step.instruction,
            image: step.image || null,
            order: index + 1
          }))
        })
      }

      return recipe
    })

    return NextResponse.json({
      message: '레시피가 성공적으로 수정되었습니다',
      recipe: updatedRecipe
    })

  } catch (error) {
    console.error('레시피 수정 실패:', error)
    return NextResponse.json(
      { error: '레시피 수정에 실패했습니다' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - 레시피 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = params

    // 기존 레시피 조회 및 권한 확인
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: { email: true }
        }
      }
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { error: '레시피를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 관리자이거나 본인의 레시피인 경우만 삭제 가능
    const isAdmin = session.user.role === 'ADMIN'
    const isOwner = existingRecipe.author.email === session.user.email
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: '이 레시피를 삭제할 권한이 없습니다' },
        { status: 403 }
      )
    }

    // 레시피 삭제 (Cascade로 관련 데이터도 함께 삭제됨)
    await prisma.recipe.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '레시피가 성공적으로 삭제되었습니다'
    })

  } catch (error) {
    console.error('레시피 삭제 실패:', error)
    return NextResponse.json(
      { error: '레시피 삭제에 실패했습니다' },
      { status: 500 }
    )
  }
}
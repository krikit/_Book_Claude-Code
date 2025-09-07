import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('시드 데이터 생성을 시작합니다...')

  // 테스트 사용자들 생성
  const user1 = await prisma.user.upsert({
    where: { email: 'test@cookshare.com' },
    update: {},
    create: {
      email: 'test@cookshare.com',
      name: '요리왕 김치',
      bio: '20년차 한식 전문가입니다. 전통 요리부터 퓨전까지 다양한 레시피를 공유합니다.',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'chef@cookshare.com' },
    update: {},
    create: {
      email: 'chef@cookshare.com',
      name: '셰프 박파스타',
      bio: '이탈리아 요리 전문가. 정통 이탈리안과 홈쿠킹 레시피를 전문으로 합니다.',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'baker@cookshare.com' },
    update: {},
    create: {
      email: 'baker@cookshare.com',
      name: '베이킹마스터',
      bio: '홈베이킹과 디저트 전문가입니다. 쉽고 맛있는 베이킹 레시피를 공유해요!',
    },
  })

  // 김치찌개 레시피
  const kimchiJjigae = await prisma.recipe.create({
    data: {
      title: '집밥 김치찌개',
      description: '매콤하고 진한 국물맛이 일품인 김치찌개 레시피입니다. 신김치와 돼지고기의 조화가 환상적이에요!',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop&crop=center',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      difficulty: 'Easy',
      category: 'Main',
      published: true,
      authorId: user1.id,
      ingredients: {
        create: [
          { name: '신김치', amount: '300', unit: 'g', order: 1 },
          { name: '돼지고기 (목살)', amount: '200', unit: 'g', order: 2 },
          { name: '두부', amount: '1/2', unit: '모', order: 3 },
          { name: '대파', amount: '1', unit: '대', order: 4 },
          { name: '양파', amount: '1/2', unit: '개', order: 5 },
          { name: '마늘', amount: '3', unit: '쪽', order: 6 },
          { name: '고춧가루', amount: '1', unit: '큰술', order: 7 },
          { name: '참기름', amount: '1', unit: '큰술', order: 8 }
        ]
      },
      steps: {
        create: [
          { 
            instruction: '신김치는 한 입 크기로 자르고, 돼지고기도 적당한 크기로 썰어주세요. 두부는 깍둑썰기, 대파와 양파는 어슷썰기 해주세요.',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&crop=center',
            order: 1
          },
          {
            instruction: '팬에 참기름을 두르고 돼지고기를 볶아 색이 변하면 김치를 넣고 함께 볶아주세요.',
            image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop&crop=center',
            order: 2
          },
          {
            instruction: '김치가 볶아지면 물 3컵을 넣고 끓어오르면 고춧가루를 넣어 간을 맞춰주세요.',
            order: 3
          },
          {
            instruction: '국물이 끓으면 두부와 양파를 넣고 10분 정도 더 끓여주세요.',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&crop=center',
            order: 4
          },
          {
            instruction: '마지막에 대파와 다진 마늘을 넣고 2분 정도 더 끓이면 완성입니다!',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop&crop=center',
            order: 5
          }
        ]
      }
    }
  })

  // 파스타 레시피
  const carbonara = await prisma.recipe.create({
    data: {
      title: '크림 카르보나라',
      description: '부드럽고 진한 크림소스가 일품인 카르보나라입니다. 베이컨의 고소함과 치즈의 풍미가 환상적으로 어우러져요.',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop&crop=center',
      servings: 2,
      prepTime: 10,
      cookTime: 20,
      difficulty: 'Medium',
      category: 'Main',
      published: true,
      authorId: user2.id,
      ingredients: {
        create: [
          { name: '스파게티면', amount: '200', unit: 'g', order: 1 },
          { name: '베이컨', amount: '150', unit: 'g', order: 2 },
          { name: '달걀', amount: '2', unit: '개', order: 3 },
          { name: '파마산 치즈', amount: '50', unit: 'g', order: 4 },
          { name: '생크림', amount: '100', unit: 'ml', order: 5 },
          { name: '마늘', amount: '2', unit: '쪽', order: 6 },
          { name: '파슬리', amount: '적당량', unit: '', order: 7 },
          { name: '후추', amount: '적당량', unit: '', order: 8 }
        ]
      },
      steps: {
        create: [
          {
            instruction: '끓는 소금물에 스파게티면을 넣고 포장지 표시 시간보다 1분 적게 삶아주세요.',
            order: 1
          },
          {
            instruction: '베이컨은 적당한 크기로 자르고, 마늘은 편썰기, 파슬리는 다져주세요.',
            order: 2
          },
          {
            instruction: '팬에 베이컨을 넣고 바삭하게 볶은 후 마늘을 넣어 향을 내주세요.',
            order: 3
          },
          {
            instruction: '삶은 면을 팬에 넣고 생크림을 부어 잘 섞어주세요.',
            order: 4
          },
          {
            instruction: '불을 끄고 달걀과 파마산 치즈를 넣어 재빨리 섞어주세요. 후추와 파슬리를 뿌리면 완성!',
            order: 5
          }
        ]
      }
    }
  })

  // 팬케이크 레시피
  const pancake = await prisma.recipe.create({
    data: {
      title: '폭신한 팬케이크',
      description: '아침식사나 브런치로 완벽한 폭신폭신한 팬케이크입니다. 메이플 시럽과 함께 드시면 더욱 맛있어요!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
      servings: 3,
      prepTime: 10,
      cookTime: 15,
      difficulty: 'Easy',
      category: 'Breakfast',
      published: true,
      authorId: user3.id,
      ingredients: {
        create: [
          { name: '박력분', amount: '200', unit: 'g', order: 1 },
          { name: '베이킹파우더', amount: '2', unit: '작은술', order: 2 },
          { name: '설탕', amount: '2', unit: '큰술', order: 3 },
          { name: '소금', amount: '1/2', unit: '작은술', order: 4 },
          { name: '달걀', amount: '1', unit: '개', order: 5 },
          { name: '우유', amount: '180', unit: 'ml', order: 6 },
          { name: '버터', amount: '30', unit: 'g', order: 7 }
        ]
      },
      steps: {
        create: [
          {
            instruction: '버터는 전자레인지에 녹이고, 달걀은 잘 풀어주세요.',
            order: 1
          },
          {
            instruction: '볼에 박력분, 베이킹파우더, 설탕, 소금을 넣고 잘 섞어주세요.',
            order: 2
          },
          {
            instruction: '다른 볼에 달걀, 우유, 녹인 버터를 넣고 섞은 후 가루 재료에 부어 살살 섞어주세요.',
            order: 3
          },
          {
            instruction: '팬을 달구고 반죽을 적당량 부어 기포가 올라오면 뒤집어 주세요.',
            order: 4
          },
          {
            instruction: '양면이 노릇하게 익으면 접시에 담고 메이플 시럽, 버터와 함께 서빙하세요.',
            order: 5
          }
        ]
      }
    }
  })

  // 불고기 레시피
  const bulgogi = await prisma.recipe.create({
    data: {
      title: '달콤한 소불고기',
      description: '부드럽고 달콤한 맛이 일품인 전통 소불고기 레시피입니다. 밥과 함께 먹으면 정말 맛있어요!',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop&crop=center',
      servings: 4,
      prepTime: 30,
      cookTime: 15,
      difficulty: 'Medium',
      category: 'Main',
      published: true,
      authorId: user1.id,
      ingredients: {
        create: [
          { name: '소고기 (불고기용)', amount: '500', unit: 'g', order: 1 },
          { name: '양파', amount: '1', unit: '개', order: 2 },
          { name: '당근', amount: '1/2', unit: '개', order: 3 },
          { name: '대파', amount: '2', unit: '대', order: 4 },
          { name: '간장', amount: '4', unit: '큰술', order: 5 },
          { name: '설탕', amount: '2', unit: '큰술', order: 6 },
          { name: '배', amount: '1/4', unit: '개', order: 7 },
          { name: '마늘', amount: '3', unit: '쪽', order: 8 },
          { name: '참기름', amount: '1', unit: '큰술', order: 9 }
        ]
      },
      steps: {
        create: [
          {
            instruction: '소고기는 얇게 썰어 준비하고, 배와 마늘은 갈아주세요.',
            order: 1
          },
          {
            instruction: '간장, 설탕, 간 배, 간 마늘, 참기름을 섞어 양념장을 만듭니다.',
            order: 2
          },
          {
            instruction: '소고기에 양념장을 넣고 30분간 재워주세요.',
            order: 3
          },
          {
            instruction: '양파, 당근, 대파는 적당한 크기로 썰어주세요.',
            order: 4
          },
          {
            instruction: '팬에 재운 소고기와 야채를 넣고 볶아서 완성하세요.',
            order: 5
          }
        ]
      }
    }
  })

  // 이미지가 없는 간단한 레시피들
  const eggRice = await prisma.recipe.create({
    data: {
      title: '간단한 계란볶음밥',
      description: '집에 있는 재료로 빠르게 만들 수 있는 계란볶음밥입니다.',
      servings: 1,
      prepTime: 5,
      cookTime: 10,
      difficulty: 'Easy',
      category: 'Main',
      published: true,
      authorId: user2.id,
      ingredients: {
        create: [
          { name: '밥', amount: '1', unit: '공기', order: 1 },
          { name: '달걀', amount: '2', unit: '개', order: 2 },
          { name: '간장', amount: '1', unit: '큰술', order: 3 },
          { name: '참기름', amount: '1', unit: '작은술', order: 4 },
          { name: '대파', amount: '조금', unit: '', order: 5 }
        ]
      },
      steps: {
        create: [
          {
            instruction: '달걀을 풀어서 스크램블을 만들어주세요.',
            order: 1
          },
          {
            instruction: '팬에 밥을 넣고 달걀과 함께 볶아주세요.',
            order: 2
          },
          {
            instruction: '간장과 참기름으로 간을 맞추고 대파를 넣어 완성하세요.',
            order: 3
          }
        ]
      }
    }
  })

  const toastSandwich = await prisma.recipe.create({
    data: {
      title: '치즈 토스트 샌드위치',
      description: '바쁜 아침에 간단하게 만들어 먹을 수 있는 샌드위치입니다.',
      servings: 1,
      prepTime: 5,
      cookTime: 5,
      difficulty: 'Easy',
      category: 'Breakfast',
      published: true,
      authorId: user3.id,
      ingredients: {
        create: [
          { name: '식빵', amount: '2', unit: '장', order: 1 },
          { name: '치즈', amount: '1', unit: '장', order: 2 },
          { name: '햄', amount: '1', unit: '장', order: 3 },
          { name: '버터', amount: '적당량', unit: '', order: 4 }
        ]
      },
      steps: {
        create: [
          {
            instruction: '식빵에 버터를 발라주세요.',
            order: 1
          },
          {
            instruction: '햄과 치즈를 올리고 다른 식빵으로 덮어주세요.',
            order: 2
          },
          {
            instruction: '팬에서 양면을 노릇하게 구워주세요.',
            order: 3
          }
        ]
      }
    }
  })

  // 좋아요 추가
  await prisma.like.create({
    data: {
      userId: user2.id,
      recipeId: kimchiJjigae.id
    }
  })

  await prisma.like.create({
    data: {
      userId: user1.id,
      recipeId: carbonara.id
    }
  })

  await prisma.like.create({
    data: {
      userId: user3.id,
      recipeId: bulgogi.id
    }
  })

  await prisma.like.create({
    data: {
      userId: user1.id,
      recipeId: eggRice.id
    }
  })

  // 댓글 추가
  await prisma.comment.create({
    data: {
      content: '정말 맛있게 만들어 먹었어요! 신김치가 포인트네요 👍',
      userId: user2.id,
      recipeId: kimchiJjigae.id
    }
  })

  await prisma.comment.create({
    data: {
      content: '크림소스가 정말 부드러워요. 다음에도 또 만들어야겠어요!',
      userId: user1.id,
      recipeId: carbonara.id
    }
  })

  await prisma.comment.create({
    data: {
      content: '정말 간단하고 맛있어요! 바쁜 아침에 딱이네요.',
      userId: user3.id,
      recipeId: eggRice.id
    }
  })

  console.log('시드 데이터가 성공적으로 생성되었습니다!')
  console.log(`- 사용자: ${user1.name}, ${user2.name}, ${user3.name}`)
  console.log(`- 레시피: ${kimchiJjigae.title}, ${carbonara.title}, ${pancake.title}, ${bulgogi.title}, ${eggRice.title}, ${toastSandwich.title}`)
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 중 오류:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Starting database cleanup and admin setup...')

  // 1. Delete all existing test recipes (any recipe that contains "테스트" in title or description)
  console.log('📋 Removing test recipes...')
  const testRecipes = await prisma.recipe.deleteMany({
    where: {
      OR: [
        { title: { contains: '테스트' } },
        { description: { contains: '테스트' } },
        { title: { contains: 'test', mode: 'insensitive' } },
        { description: { contains: 'test', mode: 'insensitive' } },
      ]
    }
  })
  console.log(`✅ Deleted ${testRecipes.count} test recipes`)

  // 2. Create or update admin user
  console.log('👤 Setting up admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cookshare.com' },
    update: {
      role: 'ADMIN',
      name: '관리자'
    },
    create: {
      email: 'admin@cookshare.com',
      name: '관리자',
      role: 'ADMIN'
    }
  })
  console.log(`✅ Admin user setup complete: ${adminUser.email}`)

  // 3. Show current database status
  const userCount = await prisma.user.count()
  const recipeCount = await prisma.recipe.count()
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })

  console.log('\n📊 Database Status:')
  console.log(`- Total users: ${userCount}`)
  console.log(`- Admin users: ${adminCount}`)
  console.log(`- Total recipes: ${recipeCount}`)

  console.log('\n🎉 Cleanup and admin setup completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
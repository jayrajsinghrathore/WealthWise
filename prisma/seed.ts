import { PrismaClient } from '@prisma/client'

import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const hashedPassword = await hash("password", 12)

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Test User",
      password: hashedPassword,
      transactions: {
        create: [
          {
            type: "income",
            amount: 3000,
            category: "Salary",
            description: "Monthly salary",
            date: new Date("2023-04-01"),
          },
          {
            type: "expense",
            amount: 800,
            category: "Housing",
            description: "Rent payment",
            date: new Date("2023-04-02"),
          },
          {
            type: "expense",
            amount: 120,
            category: "Food",
            description: "Grocery shopping",
            date: new Date("2023-04-05"),
          },
          {
            type: "expense",
            amount: 50,
            category: "Transportation",
            description: "Gas",
            date: new Date("2023-04-10"),
          },
          {
            type: "expense",
            amount: 200,
            category: "Entertainment",
            description: "Concert tickets",
            date: new Date("2023-04-15"),
          },
        ],
      },
    },
  })

  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

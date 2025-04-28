import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET all transactions for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST a new transaction
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.amount || !data.category || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: data.type,
        amount: Number.parseFloat(data.amount),
        category: data.category,
        description: data.description || "",
        date: new Date(data.date),
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// DELETE a transaction
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if the transaction exists and belongs to the user
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE a transaction
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const data = await request.json()

    // Check if the transaction exists and belongs to the user
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        type: data.type,
        amount: Number.parseFloat(data.amount),
        category: data.category,
        description: data.description || "",
        date: new Date(data.date),
      },
    })

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

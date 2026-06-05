import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const { amount, email } = await req.json();

    // 1. FIND USER FIRST (IMPORTANT FIX)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const reference = `VTU_${Date.now()}`;

    const paystackRes = await initializeTransaction(
      email,
      amount,
      reference
    );

    // save pending transaction
    await prisma.transaction.create({
  data: {
    userId: user.id, // better than email (IMPORTANT FIX)
    type: "FUNDING",
    amount,
    reference,
    status: "PENDING",
  },
});

    return NextResponse.json(paystackRes);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { message: "Missing reference" },
        { status: 400 }
      );
    }

    // 1. Verify with Paystack
    const response = await verifyTransaction(reference);

    const data = response.data;

    if (data.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      );
    }

    const email = data.customer.email;
    const amount = data.amount / 100;

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Find transaction (prevent duplicate credit)
    const existingTx = await prisma.transaction.findUnique({
      where: { reference },
    });

    if (!existingTx) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (existingTx.status === "SUCCESS") {
      return NextResponse.json({
        message: "Already processed",
      });
    }

    // 4. Credit wallet
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // 5. Update transaction
    await prisma.transaction.update({
      where: { reference },
      data: {
        status: "SUCCESS",
      },
    });

    return NextResponse.json({
      message: "Wallet funded successfully",
      amount,
    });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
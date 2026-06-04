import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: any = verifyToken(token);

    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // 🔥 UPDATE WALLET
    const wallet = await prisma.wallet.update({
      where: { userId: user.userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // 🔥 LOG TRANSACTION
    await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: "wallet_funding",
        amount,
        status: "success",
        description: "Mock wallet funding",
      },
    });

    return NextResponse.json({
      message: "Wallet funded successfully",
      wallet,
    });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
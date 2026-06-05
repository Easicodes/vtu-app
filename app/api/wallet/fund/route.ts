import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: decoded.userId },
    });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    const updatedWallet = await prisma.wallet.update({
      where: { userId: decoded.userId },
      data: {
        balance: wallet.balance + Number(amount),
      },
    });

    await prisma.transaction.create({
      data: {
        userId: decoded.userId,
        type: "FUNDING",
        amount: Number(amount),
        status: "SUCCESS",
        description: "Mock wallet funding",
      },
    });

    return NextResponse.json({
      message: "Wallet funded successfully",
      wallet: updatedWallet,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
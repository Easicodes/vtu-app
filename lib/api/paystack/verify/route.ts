import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];
    const user = verifyToken(token!);

    const { reference } = await req.json();

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (data.data.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      );
    }

    const amount = data.data.amount / 100;

    // update wallet
    const wallet = await prisma.wallet.update({
      where: { userId: user.userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // transaction log
    await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: "wallet_funding",
        amount,
        status: "success",
        description: "Paystack funding",
      },
    });

    return NextResponse.json({ wallet });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
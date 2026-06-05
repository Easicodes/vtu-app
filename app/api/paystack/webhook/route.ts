import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const signature = req.headers.get("x-paystack-signature");

    // 1. VERIFY PAYSTACK SIGNATURE (VERY IMPORTANT SECURITY STEP)
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // 2. ONLY PROCESS SUCCESSFUL PAYMENTS
    if (event.event === "charge.success") {
      const data = event.data;

      const reference = data.reference;
      const email = data.customer.email;
      const amount = data.amount / 100;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return NextResponse.json({ ok: true });

      const tx = await prisma.transaction.findUnique({
        where: { reference },
      });

      if (!tx || tx.status === "SUCCESS") {
        return NextResponse.json({ ok: true });
      }

      // 3. CREDIT WALLET
      await prisma.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // 4. UPDATE TRANSACTION
      await prisma.transaction.update({
        where: { reference },
        data: {
          status: "SUCCESS",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
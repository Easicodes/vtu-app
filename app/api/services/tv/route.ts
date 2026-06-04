import { prisma } from "@/lib/prisma";
import { mockTvProvider } from "@/lib/providers/mockTvProvider";

export async function POST(req: Request) {
  try {
    const { userId, provider, smartcardNumber, packageType, amount } =
      await req.json();

    if (!userId || !provider || !smartcardNumber || !packageType || !amount) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // GET USER
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user || !user.wallet) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // CHECK BALANCE
    if (user.wallet.balance < amount) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // CREATE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "TV",
        amount,
        reference: `tv_${Date.now()}`,
        status: "PENDING",
        description: `${provider} ${packageType} for ${smartcardNumber}`,
      },
    });

    // DEDUCT WALLET (RESERVE)
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    console.log("📺 Wallet reserved for TV subscription");

    // CALL PROVIDER
    const result = await mockTvProvider();

    console.log("📡 TV provider response:", result);

    // SUCCESS
    if (result.status === "success") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
        },
      });

      return Response.json({
        message: "TV subscription successful",
        reference: transaction.reference,
        providerRef: result.providerRef,
      });
    }

    // FAILURE → REFUND
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "FAILED",
      },
    });

    return Response.json(
      { error: "TV subscription failed" },
      { status: 500 }
    );

  } catch (error) {
    console.error("TV ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
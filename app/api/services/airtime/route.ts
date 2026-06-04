import { prisma } from "@/lib/prisma";
import { mockAirtimeProvider } from "@/lib/providers/mockAirtimeProvider";

export async function POST(req: Request) {
  try {
    const { userId, network, phone, amount } = await req.json();

    if (!userId || !network || !phone || !amount) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // GET USER + WALLET
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user || !user.wallet) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // CHECK BALANCE
    if (user.wallet.balance < amount) {
      return Response.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // CREATE TRANSACTION FIRST (PENDING)
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "AIRTIME",
        amount,
        reference: `airtime_${Date.now()}`,
        status: "PENDING",
        description: `${network} airtime to ${phone}`,
      },
    });

    // DEDUCT WALLET (RESERVE FUNDS)
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    console.log("💰 Wallet deducted (reserved)");

    // CALL MOCK PROVIDER
    const result = await mockAirtimeProvider();

    console.log("📡 Provider response:", result);

    // SUCCESS FLOW
    if (result.status === "success") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
        },
      });

      return Response.json({
        message: "Airtime sent successfully",
        reference: transaction.reference,
        providerRef: result.providerRef,
      });
    }

    // FAILURE FLOW → REFUND
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
      { error: "Airtime purchase failed" },
      { status: 500 }
    );

  } catch (error) {
    console.error("AIRTIME ERROR:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
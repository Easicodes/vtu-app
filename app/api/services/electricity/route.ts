import { prisma } from "@/lib/prisma";
import { mockElectricityProvider } from "@/lib/providers/mockElectricityProvider";

export async function POST(req: Request) {
  try {
    const { userId, disco, meterNumber, amount } = await req.json();

    if (!userId || !disco || !meterNumber || !amount) {
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
        type: "ELECTRICITY",
        amount,
        reference: `elec_${Date.now()}`,
        status: "PENDING",
        description: `${disco} meter ${meterNumber}`,
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

    console.log("⚡ Wallet reserved for electricity");

    // CALL PROVIDER
    const result = await mockElectricityProvider();

    console.log("📡 Electricity provider response:", result);

    // SUCCESS
    if (result.status === "success") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
        },
      });

      return Response.json({
        message: "Electricity purchase successful",
        token: result.token,
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
      { error: "Electricity purchase failed" },
      { status: 500 }
    );

  } catch (error) {
    console.error("ELECTRICITY ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
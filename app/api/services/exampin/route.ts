import { prisma } from "@/lib/prisma";
import { mockExamPinProvider } from "@/lib/providers/mockExamPinProvider";

export async function POST(req: Request) {
  try {
    const { userId, examType, amount } = await req.json();

    if (!userId || !examType || !amount) {
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
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // CREATE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: "EXAMPIN",
        amount,
        reference: `exam_${Date.now()}`,
        status: "PENDING",
        description: `${examType} exam pin purchase`,
      },
    });

    // DEDUCT WALLET
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    console.log("🧾 Wallet reserved for exam pin");

    // CALL PROVIDER
   const result = await mockExamPinProvider(examType);

    console.log("📡 Exam provider response:", result);

    // SUCCESS
    if (result.status === "success") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
        },
      });

      return Response.json({
        message: "Exam pin generated successfully",
        pin: result.pin,
        serial: result.serial,
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
      { error: "Exam pin purchase failed" },
      { status: 500 }
    );

  } catch (error) {
    console.error("EXAM PIN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
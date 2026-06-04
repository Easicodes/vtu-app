import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function GET() {
  return Response.json({ status: "webhook alive" });
}

export async function POST(req: Request) {
  try {
    console.log("🔥 POST WEBHOOK HIT");

    const rawBody = await req.text();

    const signature = req.headers.get("x-paystack-signature");

    console.log("📩 Signature:", signature);

    if (!signature) {
      return new Response("No signature", { status: 401 });
    }

    // VERIFY PAYSTACK SIGNATURE
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.log("❌ Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    console.log("📦 Event:", event.event);

    // ONLY PROCESS SUCCESSFUL PAYMENTS
    if (event.event !== "charge.success") {
      return Response.json({ ok: true });
    }

    const reference = event.data.reference;

    console.log("🔎 Reference:", reference);

    // DOUBLE CHECK WITH PAYSTACK
    const verification = await verifyTransaction(reference);

    if (verification.data.status !== "success") {
      console.log("❌ Payment not successful on verify");
      return Response.json({ message: "Not successful" });
    }

    // FIND TRANSACTION
    const transaction = await prisma.transaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      console.log("❌ Transaction not found");
      return Response.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // PREVENT DOUBLE CREDIT
    if (transaction.status === "SUCCESS") {
      console.log("⚠️ Already processed");
      return Response.json({ message: "Already processed" });
    }

    // CREDIT WALLET + UPDATE TRANSACTION
    await prisma.$transaction([
      prisma.transaction.update({
        where: { reference },
        data: {
          status: "SUCCESS",
        },
      }),

      prisma.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      }),
    ]);

    console.log("💰 WALLET CREDITED SUCCESSFULLY");

    return Response.json({
      message: "Wallet credited successfully",
    });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);

    return Response.json(
      {
        error: "Webhook failed",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
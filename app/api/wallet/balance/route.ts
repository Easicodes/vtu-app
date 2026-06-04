import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = getAuthUserId(req);

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    return Response.json({
      balance: wallet?.balance || 0,
    });

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
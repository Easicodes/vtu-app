import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = getAuthUserId(req);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wallet: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      wallet: user.wallet,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
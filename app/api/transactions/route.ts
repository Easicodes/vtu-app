import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return Response.json({ message: "No token" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = verifyToken(token);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return Response.json({ transactions });
  } catch (err: any) {
    return Response.json(
      { message: err.message || "Error fetching transactions" },
      { status: 500 }
    );
  }
}
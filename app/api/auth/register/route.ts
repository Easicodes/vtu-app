import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullname, email, phone, password } = await req.json();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json({ error: "User exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        phone,
        password: hashed,
      },
    });

    // CREATE WALLET AFTER USER
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });

    return Response.json({
      message: "User created",
      userId: user.id,
    });

  } catch (error) {
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
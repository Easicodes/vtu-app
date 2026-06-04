import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });

  } catch (error) {
    return Response.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
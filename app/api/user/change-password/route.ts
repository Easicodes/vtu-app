import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { userId, oldPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return Response.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return Response.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
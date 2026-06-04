import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      fullname,
      phone
    } = body;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        fullname,
        phone,
      },
    });

    return Response.json({
      message: "Profile updated",
      user,
    });

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
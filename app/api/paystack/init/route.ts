import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { initializeTransaction } from "@/lib/providers/paystack";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const user: any = verifyToken(token);

    const { amount } = await req.json();

    const paystack = await initializeTransaction({
      email: user.email,
      amount,
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference: paystack.reference,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    // 1. CHECK AUTH HEADER
    const auth = req.headers.get("authorization");

    if (!auth) {
      return NextResponse.json(
        { message: "No authorization header" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 401 }
      );
    }

    // 2. VERIFY USER (SAFE)
    let user;
    try {
      user = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3. READ BODY
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || amount < 100) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // 4. ENSURE EMAIL EXISTS
    if (!user?.email) {
      return NextResponse.json(
        { message: "User email missing in token" },
        { status: 400 }
      );
    }

    // 5. INIT PAYSTACK
    const paystack = await initializeTransaction({
      email: user.email,
      amount,
    });

    // 6. RETURN CLEAN RESPONSE
    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference: paystack.reference,
    });

  } catch (err: any) {
    console.error("PAYSTACK INIT ERROR:", err);

    return NextResponse.json(
      {
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

const PAYSTACK_BASE_URL = "https://api.paystack.co";

/**
 * =========================
 * INITIALIZE TRANSACTION
 * =========================
 */
export async function initializeTransaction(
  email: string,
  amount: number,
  reference: string
) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack uses kobo
          reference,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/success`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to initialize payment");
    }

    return data;
  } catch (err: any) {
    console.error("Paystack Init Error:", err.message);
    throw err;
  }
}

/**
 * =========================
 * VERIFY TRANSACTION
 * =========================
 */
export async function verifyTransaction(reference: string) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify transaction");
    }

    return data;
  } catch (err: any) {
    console.error("Paystack Verify Error:", err.message);
    throw err;
  }
}
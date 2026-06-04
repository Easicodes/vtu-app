const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function initializeTransaction({
  email,
  amount,
}: {
  email: string;
  amount: number;
}) {
  const res = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Paystack init failed");
  }

  return data.data;
}
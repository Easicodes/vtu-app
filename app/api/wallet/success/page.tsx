"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params.get("reference");

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) return;

      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();
        console.log("VERIFY RESULT:", data);

        // small delay so user sees success screen
        setTimeout(() => {
          router.push("/dashboard?updated=true");
        }, 1500);

      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      }
    }

    verifyPayment();
  }, [reference]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-green-600 text-2xl font-bold">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-500 mt-2">
          Confirming your wallet funding...
        </p>
      </div>
    </div>
  );
}
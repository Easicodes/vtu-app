"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/apiClient";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference");

    async function verify() {
      try {
        await apiRequest(
          "/api/paystack/verify",
          "POST",
          { reference },
          true
        );

        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        router.push("/wallet/fund");
      }
    }

    if (reference) verify();
  }, []);

  return (
    <div className="p-10 text-center">
      <p>Verifying payment...</p>
    </div>
  );
}
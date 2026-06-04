"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FundWalletPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function handleFund() {
    if (!amount || amount < 100) {
      alert("Minimum funding is ₦100");
      return;
    }

    try {
      setLoading(true);

      // 🔥 MOCK API CALL (replace later with real backend)
      const res = await fetch("/api/wallet/mock-fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Funding failed");
        return;
      }

      alert("🎉 Wallet funded successfully!");

      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow">

        <h1 className="text-xl font-bold mb-4">
          Fund Wallet (Mock)
        </h1>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-xl mb-4"
        />

        <button
          onClick={handleFund}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          {loading ? "Processing..." : "Fund Wallet"}
        </button>

      </div>
    </div>
  );
}
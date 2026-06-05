"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

export default function FundWalletPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // 🔥 FUND WALLET FUNCTION (PAYSTACK INIT)
  async function fundWallet() {
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch("/api/paystack/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email: user.email,
        }),
      });

      const data = await res.json();

      // 🔁 REDIRECT TO PAYSTACK
      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
        return;
      }

      alert(data.message || "Payment initialization failed");
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">

        <h1 className="text-xl font-bold mb-2">
          Fund Wallet
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Enter amount to fund your VTU wallet
        </p>

        {/* AMOUNT INPUT */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* FUND BUTTON */}
        <button
          onClick={fundWallet}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <PlusCircle size={18} />
          {loading ? "Processing..." : "Fund Wallet"}
        </button>

        {/* BACK */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-3 text-sm text-gray-500"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}
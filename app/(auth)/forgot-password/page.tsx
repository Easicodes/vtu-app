"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // placeholder (backend later)
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-1 text-sm text-gray-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <h1 className="text-xl font-bold text-blue-600 mb-2">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border pl-10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl"
          >
            Send Reset Link
          </button>

        </form>

        {sent && (
          <p className="text-green-600 text-sm mt-4 text-center">
            Reset link sent (demo mode)
          </p>
        )}

      </div>
    </div>
  );
}
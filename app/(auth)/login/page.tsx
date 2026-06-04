"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      router.push("/dashboard");

    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Login with your email account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border pl-10 pr-10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition"
          >
            {loading ? "Logging in..." : "Login"}
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* FORGOT PASSWORD LINK (NEW PAGE) */}
        <div className="mt-5 text-center">

          <button
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-blue-600 flex items-center justify-center gap-1 mx-auto"
          >
            <KeyRound className="w-4 h-4" />
            Forgot Password?
          </button>

          <div className="mt-3 text-center">
  <p className="text-sm text-gray-500">
    Not yet registered?
  </p>

  <button
    onClick={() => router.push("/register")}
    className="text-blue-600 text-sm font-medium hover:underline"
  >
    Create an account
  </button>
</div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          VTU App • Secure Login
        </p>

      </div>
    </div>
  );
}
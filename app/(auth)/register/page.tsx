"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      router.push("/login");

    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg">
            <User size={36} className="text-white" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Join VTU PRO and start transacting
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl border p-6">

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>

              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600">Phone</label>

              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  className="w-full pl-11 pr-4 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          {/* GOOGLE ONLY (UI) */}
          <div className="mt-6">

            <button
              type="button"
              className="w-full border rounded-2xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                G
              </div>

              Continue with Google
            </button>

          </div>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}
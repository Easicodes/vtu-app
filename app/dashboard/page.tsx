"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Wallet,
  Phone,
  Wifi,
  Zap,
  Tv,
  User,
  PlusCircle,
  Receipt,
  Settings,
  GraduationCap,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiRequest } from "@/lib/apiClient";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAllTx, setShowAllTx] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    loadData();
  }, []);

  async function loadData() {
    try {
      const wallet = await apiRequest("/wallet/balance", "GET", null, true);
      const tx = await apiRequest("/transactions", "GET", null, true);

      setBalance(wallet.balance);
      setTransactions(tx.transactions || []);
    } catch (err) {
      console.error(err);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const services = [
    { name: "Airtime", icon: Phone, route: "/airtime" },
    { name: "Data", icon: Wifi, route: "/data" },
    { name: "Electricity", icon: Zap, route: "/electricity" },
    { name: "TV", icon: Tv, route: "/tv" },
    { name: "Exam PIN", icon: GraduationCap, route: "/exam-pin" },
    { name: "Wallet", icon: Wallet, route: "/wallet" },
    { name: "More", icon: MoreHorizontal, route: "/services" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* TOP HEADER */}
      <div className="bg-blue-600 text-white p-5 rounded-b-3xl">

        {/* TOP ICONS */}
        <div className="flex justify-end gap-3 mb-3">

          <button
            onClick={() => router.push("/profile")}
            className="bg-white/20 p-2 rounded-full"
          >
            <User size={18} />
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="bg-white/20 p-2 rounded-full"
          >
            <Settings size={18} />
          </button>

        </div>

        <p className="text-sm opacity-80">Welcome back</p>

        <h1 className="text-xl font-bold">
          {user?.fullname || "User"}
        </h1>

        {/* WALLET CARD */}
        <div className="bg-white text-black mt-4 p-4 rounded-2xl shadow">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-xs">Wallet Balance</p>

              <h2 className="text-2xl font-bold mt-1">
                {hidden ? "₦••••••" : `₦${balance.toLocaleString()}`}
              </h2>
            </div>

            <button onClick={() => setHidden(!hidden)}>
              {hidden ? <EyeOff /> : <Eye />}
            </button>

          </div>

          <button
            onClick={() => router.push("/wallet/fund")}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            Fund Wallet
          </button>

        </div>
      </div>

      {/* SERVICES */}
      <div className="p-4">

        <h2 className="font-semibold mb-3">VTU Services</h2>

        <div className="grid grid-cols-4 gap-3">

          {services.map((s, i) => {
            const Icon = s.icon;

            return (
              <button
                key={i}
                onClick={() => router.push(s.route)}
                className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center active:scale-95 transition"
              >
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>

                <p className="text-xs mt-2 text-center">{s.name}</p>
              </button>
            );
          })}

        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="p-4">

        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Recent Transactions</h2>

          <button
            onClick={() => setShowAllTx(!showAllTx)}
            className="text-blue-600 text-sm flex items-center gap-1"
          >
            {showAllTx ? "Collapse" : "View more"}
            {showAllTx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="mt-3 space-y-3">

          {(showAllTx ? transactions : transactions.slice(0, 3)).length === 0 ? (
            <p className="text-gray-500 text-sm">
              No transactions yet
            </p>
          ) : (
            (showAllTx ? transactions : transactions.slice(0, 3)).map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-xl flex justify-between shadow-sm"
              >
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {tx.status}
                  </p>
                </div>

                <p className="font-bold text-red-500">
                  ₦{Number(tx.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}

        </div>
      </div>

      {/* LOGOUT */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">

        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg active:scale-95"
        >
          Logout
        </button>

      </div>

    </div>
  );
}
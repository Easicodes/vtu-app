"use client";

import Link from "next/link";
import {
  Wifi,
  Tv,
  Zap,
  GraduationCap,
  ShieldCheck,
  Smartphone,
  Wallet,
  ArrowRight,
  Star,
} from "lucide-react";

const services = [
  {
    title: "Data Bundles",
    icon: Wifi,
    desc: "Buy SME, CG and Corporate data instantly at discounted rates.",
  },
  {
    title: "TV Subscription",
    icon: Tv,
    desc: "Renew DSTV, GOTV and Startimes within seconds.",
  },
  {
    title: "Electricity Bills",
    icon: Zap,
    desc: "Pay electricity bills and receive tokens instantly.",
  },
  {
    title: "Exam Pins",
    icon: GraduationCap,
    desc: "Purchase WAEC, NECO and NABTEB pins instantly.",
  },
];

const testimonials = [
  {
    name: "Precious Adriel",
    text: "Fast transactions, great pricing and excellent support.",
  },
  {
    name: "John Philip",
    text: "Everything works seamlessly. I use it daily.",
  },
  {
    name: "Peace Adeyemi",
    text: "One of the best VTU platforms I've used.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-2xl text-blue-600">
            VTU PRO
          </h1>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-3xl">

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              ⚡ Automated VTU Platform
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Buy Data, Airtime, TV &
              Electricity Bills Instantly
            </h1>

            <p className="mt-6 text-lg text-blue-100">
              Fast, secure and reliable VTU platform with
              instant delivery and discounted prices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="border border-white px-6 py-3 rounded-xl"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-gray-50 p-6 rounded-2xl text-center">
            <h3 className="text-3xl font-bold">10K+</h3>
            <p>Users</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center">
            <h3 className="text-3xl font-bold">99.9%</h3>
            <p>Success Rate</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center">
            <h3 className="text-3xl font-bold">24/7</h3>
            <p>Support</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl text-center">
            <h3 className="text-3xl font-bold">Instant</h3>
            <p>Delivery</p>
          </div>

        </div>

      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Our Services
          </h2>
          <p className="text-gray-500 mt-2">
            Everything you need in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="border rounded-3xl p-6 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600" />
                </div>

                <h3 className="font-bold text-xl mt-4">
                  {service.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {service.desc}
                </p>
              </div>
            );
          })}

        </div>

      </section>

      {/* WHY US */}
      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-3xl">
              <Wallet className="text-blue-600 mb-4" size={40} />
              <h3 className="font-bold text-xl">
                Wallet Funding
              </h3>
              <p className="text-gray-500 mt-2">
                Fund your wallet and enjoy instant transactions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl">
              <ShieldCheck className="text-green-600 mb-4" size={40} />
              <h3 className="font-bold text-xl">
                Secure Platform
              </h3>
              <p className="text-gray-500 mt-2">
                Protected accounts and secure payments.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl">
              <Smartphone className="text-purple-600 mb-4" size={40} />
              <h3 className="font-bold text-xl">
                Mobile Friendly
              </h3>
              <p className="text-gray-500 mt-2">
                Works perfectly on phones, tablets and desktop.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 py-20">

        <h2 className="text-center text-4xl font-bold mb-12">
          What Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="border rounded-3xl p-6"
            >
              <Star className="fill-yellow-400 text-yellow-400" />

              <p className="mt-4 text-gray-600">
                "{item.text}"
              </p>

              <h4 className="font-semibold mt-4">
                {item.name}
              </h4>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20">

        <div className="max-w-4xl mx-auto text-center px-4">

          <h2 className="text-4xl font-bold">
            Ready To Get Started?
          </h2>

          <p className="mt-4 text-blue-100">
            Join thousands of customers using our VTU platform daily.
          </p>

          <Link
            href="/register"
            className="inline-flex mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold"
          >
            Create Free Account
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500">
        © 2026 VTU PRO. All rights reserved.
      </footer>

    </main>
  );
}
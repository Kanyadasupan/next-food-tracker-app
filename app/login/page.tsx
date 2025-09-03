"use client";

import Link from 'next/link';
import { useState } from 'react';
import{ useRouter } from 'next/navigation';

/**
 * @fileoverview This is the Login page component for the Food Tracker application.
 * It's built with Next.js using TypeScript and styled with Tailwind CSS.
 */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-red-500 p-4">
      <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="กรุณาป้อนอีเมล"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="กรุณาป้อนรหัสผ่าน"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <span className="text-purple-600 hover:text-purple-800 font-semibold transition duration-200">
              Register here
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

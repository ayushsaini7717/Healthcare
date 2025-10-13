"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error.includes("OTP sent")) {
        console.log(result.error);
        alert("OTP sent! Please verify your email. "+result.error);
        window.location.href = "/verify-otp";
      } else {
        alert(result.error);
      }
    } else {
      window.location.href = "/";
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-3 p-6 border w-80 mx-auto mt-20 rounded-lg"
    >
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white py-2 rounded" type="submit">
        Login
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verified,setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, type: "verification" }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Email verified! You can now log in.");
    //   window.location.href = "/login";
      setVerified(true);
    } else {
      alert(data.message);
    }
  };

  return (
    !verified ? <form
      onSubmit={handleVerify}
      className="flex flex-col gap-3 p-6 border w-100 mx-auto mt-20 rounded-lg"
    >
    <span className="flex gap-2">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" className="min-w-5 text-nowrap bg-black text-white rounded-md text-sm px-2 cursor-pointer" onClick={async ()=>{
        setLoading(true);
        const res=await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/otp`,{
            method: "POST",
            body: JSON.stringify({
                email
            })
        })
        const data=await res.json();
        setLoading(false);
        if(res.ok){
            alert("otp sent");
        }else{
            alert("something went wrong");
        }
      }}>
        {loading ? <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>: <div>GET OTP</div>}
        
        </button>

    </span>
      <input
        type="text"
        placeholder="OTP"
        className="border p-2 rounded"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button className="bg-green-600 text-white py-2 rounded" type="submit">
        Verify OTP
      </button>
    </form> : 
    <div className="flex h-[100vh] justify-center items-center gap-2">
        <input placeholder="Enter password" className="border-2 rounded-md p-2" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
        <button className="bg-green-600 text-white py-2 rounded px-2" onClick={async ()=>{
            const res=await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/auth/verify-otp`,{
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    type: "accountCreation"
                })
            })
            // const data = await res.json();
            if(res.ok){
                window.location.href='/login';
            }
        }}>Create Account</button>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "👋 Hello! I’m your healthcare assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  // -----------------------
  // 🎙️ Speech-to-Text (STT)
  // -----------------------
  const handleSpeechToText = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }

    recognitionRef.current.start();
  };

  // ------------------------
  // 🔊 Text-to-Speech (TTS)
  // ------------------------
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  // ------------------------
  // 💬 Handle Send
  // ------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://mchat-backend-isxf.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          message: userInput,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      // ✅ Expected structure:
      // {
      //   "session_id": "...",
      //   "intent": "greeting",
      //   "entities": {},
      //   "reply": "Hello! I’m your healthcare assistant. How can I help you today?"
      // }

      const botReply = {
        sender: "bot",
        text: data.reply || "🤖 Sorry, I couldn’t process that.",
      };
      //@ts-ignore
      setMessages((prev) => [...prev, botReply]);
      speak(botReply.text);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  // ------------------------
  // 💎 UI
  // ------------------------
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white py-16 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Bot className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Health Chat Assistant</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1 scrollbar-thin scrollbar-thumb-emerald-200">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-600 animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input + Controls */}
        <div className="flex items-center gap-3 mt-2">
          <input
            type="text"
            value={input}
            placeholder="Speak or type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          {/* 🎙️ Voice Input Button */}
          <Button
            onClick={handleSpeechToText}
            type="button"
            variant="outline"
            className={`rounded-full p-3 border-emerald-500 ${
              listening ? "bg-emerald-100 text-emerald-700" : "text-gray-700"
            }`}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={loading}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-3"
          >
            <Send className="h-5 w-5" />
          </Button>

          {/* 🔊 Manual TTS Button */}
          <Button
            onClick={() => speak(input || "Hello, how can I assist you?")}
            variant="outline"
            className="rounded-full p-3 text-gray-700"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

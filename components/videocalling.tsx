"use client";

import React, { useRef, useState, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Function to start meeting
  const startMeeting = async (element: HTMLDivElement) => {
    const appID = 1575355159;
    const serverSecret = "205ffa826514ea6a8904e66bf029d7e4";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "User" // You can dynamically use user name
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Invite Link",
          url: `${window.location.origin}?roomID=${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: true,
    });
  };

  // Initialize Zego only when joined
  useEffect(() => {
    if (isJoined && containerRef.current) {
      startMeeting(containerRef.current);
    }
  }, [isJoined]);

  // Handle join button click
  const handleJoin = () => {
    if (roomId.trim() !== "") {
      setIsJoined(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-green-50 via-white to-emerald-50">
      {!isJoined ? (
        // 🟢 Join Meeting Section
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-green-200">
          <h1 className="text-3xl font-semibold text-emerald-700 mb-6">
            Join a Consultation
          </h1>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-5 text-gray-800 placeholder-gray-400 transition"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
          >
            Join
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Enter the meeting ID shared by your healthcare provider
          </p>
        </div>
      ) : (
        // 🎥 Video Call Section
        <div className="flex flex-col h-screen w-screen from-emerald-100 via-white to-green-50 text-gray-800">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-3 bg-emerald-600 text-white shadow-md">
            <h1 className="text-xl font-semibold">👩‍⚕️ Consultation Room</h1>
            <span className="text-sm opacity-90">
              Room ID: <strong>{roomId}</strong>
            </span>
          </header>

          {/* Video Area */}
          <div
            ref={containerRef}
            className="flex-1 m-4 rounded-xl overflow-hidden border border-emerald-200 shadow-lg bg-white"
          />

          {/* Footer */}
          <footer className="py-2 text-center text-xs text-gray-500 border-t border-emerald-200">
            Powered by <span className="text-emerald-600 font-medium">Zego + BP HealthCare</span>
          </footer>
        </div>
      )}
    </div>
  );
};

export default VideoCall;

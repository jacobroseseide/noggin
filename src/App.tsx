import { useState } from "react";
import logo from "figma:asset/ad58094748433b4de87596d818146b9da22d2517.png";
import { Button } from "./components/ui/button";
import SpeedChallenge from "./components/SpeedChallenge";
import FocusChallenge from "./components/FocusChallenge";
import LogicChallenge from "./components/LogicChallenge";
import MemoryChallenge from "./components/MemoryChallenge";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "speed" | "focus" | "logic" | "memory" | "results">("home");

  if (currentPage === "speed") {
    return <SpeedChallenge onNext={() => setCurrentPage("focus")} />;
  }

  if (currentPage === "focus") {
    return <FocusChallenge onNext={() => setCurrentPage("logic")} />;
  }

  if (currentPage === "logic") {
    return <LogicChallenge onNext={() => setCurrentPage("memory")} />;
  }

  if (currentPage === "memory") {
    return <MemoryChallenge onNext={() => setCurrentPage("results")} />;
  }

  if (currentPage === "results") {
    // Mock performance data - in a real app this would come from the actual game results
    const mockResults = {
      overall: 82,
      challenges: [
        { name: "Speed", score: 85, description: "Excellent reaction time" },
        { name: "Focus", score: 78, description: "Good attention to detail" },
        { name: "Logic", score: 90, description: "Strong problem solving" },
        { name: "Memory", score: 75, description: "Solid recall ability" }
      ]
    };

    return (
      <div
        className="min-h-screen flex flex-col bg-[#FDF9F3]"
        style={{ fontFamily: "Anonymous Pro, monospace" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Logo */}
          <div className="mb-8">
            <img
              src={logo}
              alt="Noggin Logo"
              className="w-24 h-24 mx-auto"
            />
          </div>
          
          {/* Header */}
          <h1 className="text-3xl text-[#A987D0] mb-8 text-center">
            Your Results
          </h1>
          
          {/* Summary Card */}
          <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-3xl p-8 mb-8 max-w-md w-full">
            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className="text-4xl text-[#A987D0] mb-2">
                Score: {mockResults.overall}%
              </div>
              <div className="text-[#A987D0] opacity-75 text-sm">
                Overall Performance
              </div>
            </div>
            
            {/* Individual Challenge Breakdown */}
            <div className="space-y-4">
              {mockResults.challenges.map((challenge, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-[#A987D0]">{challenge.name}</div>
                    <div className="text-[#A987D0] opacity-60 text-sm">
                      {challenge.description}
                    </div>
                  </div>
                  <div className="text-[#A987D0] text-lg ml-4">
                    {challenge.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Come Back Tomorrow Button */}
          <Button 
            className="px-8 py-3 rounded-full bg-[#FDF9F3] text-[#A987D0] border-2 border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
            onClick={() => setCurrentPage("home")}
          >
            Come Back Tomorrow
          </Button>
        </div>
        
        {/* Footer */}
        <footer className="pb-8 px-8">
          <div className="flex justify-center items-center gap-8">
            <a
              href="#"
              className="transition-colors text-sm"
              style={{ color: "#AAAAAA", opacity: "0.75" }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors text-sm"
              style={{ color: "#AAAAAA", opacity: "0.75" }}
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Main content area with vertical centering */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo at top center */}
        <div className="mb-16">
          <img
            src={logo}
            alt="Noggin Logo"
            className="w-64 h-64"
          />
        </div>

        {/* Greeting text */}
        <div className="mb-6">
          <h1 className="text-center text-[#A987D0] text-4xl -mt-8">
            Good morning, Jacob
          </h1>
        </div>

        {/* Start button */}
        <Button 
          className="px-8 py-3 rounded-full bg-[#FDF9F3] text-[#A987D0] border-2 border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
          onClick={() => setCurrentPage("speed")}
        >
          start
        </Button>
      </div>

      {/* Footer at bottom */}
      <footer className="pb-8 px-8">
        <div className="flex justify-center items-center gap-8">
          <a
            href="#"
            className="transition-colors text-sm"
            style={{ color: "#AAAAAA", opacity: "0.75" }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="transition-colors text-sm"
            style={{ color: "#AAAAAA", opacity: "0.75" }}
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
import logo from "figma:asset/ad58094748433b4de87596d818146b9da22d2517.png";
import { Button } from "./ui/button";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: string;
}

function ActivityCard({ title, description, icon }: ActivityCardProps) {
  return (
    <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-6 hover:bg-[#A987D0] hover:text-[#FDF9F3] transition-colors cursor-pointer group">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl mb-2 text-[#A987D0] group-hover:text-[#FDF9F3]">{title}</h3>
      <p className="text-sm text-[#A987D0] group-hover:text-[#FDF9F3] opacity-75">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const activities = [
    {
      title: "Memory",
      description: "Train your recall and working memory",
      icon: "🧠"
    },
    {
      title: "Focus",
      description: "Improve concentration and attention",
      icon: "🎯"
    },
    {
      title: "Logic",
      description: "Challenge your reasoning skills",
      icon: "🧮"
    },
    {
      title: "Speed",
      description: "Boost your processing speed",
      icon: "⚡"
    },
    {
      title: "Language",
      description: "Enhance verbal abilities",
      icon: "💬"
    },
    {
      title: "Spatial",
      description: "Develop visual-spatial skills",
      icon: "🧩"
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Noggin Logo"
            className="w-12 h-12"
          />
          <h1 className="text-2xl text-[#A987D0]">Noggin</h1>
        </div>
        <Button 
          variant="ghost" 
          className="text-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
        >
          Profile
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#A987D0] mb-4">Choose Your Training</h2>
            <p className="text-[#A987D0] opacity-75">Select an area to strengthen your cognitive abilities</p>
          </div>

          {/* Activity grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                description={activity.description}
                icon={activity.icon}
              />
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-16 text-center">
            <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-8 max-w-md mx-auto">
              <h3 className="text-xl text-[#A987D0] mb-4">Today's Progress</h3>
              <div className="flex justify-around">
                <div>
                  <div className="text-2xl text-[#A987D0]">0</div>
                  <div className="text-sm text-[#A987D0] opacity-75">Exercises</div>
                </div>
                <div>
                  <div className="text-2xl text-[#A987D0]">0</div>
                  <div className="text-sm text-[#A987D0] opacity-75">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl text-[#A987D0]">0</div>
                  <div className="text-sm text-[#A987D0] opacity-75">Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
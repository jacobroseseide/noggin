# 🧠 Noggin - Brain Training App

**Wake up your brain in just 4 minutes each day!**

Noggin is a minimalist, playful web application designed to help users sharpen their cognitive abilities through a series of engaging brain-training challenges. Built with React and TypeScript, it provides a seamless, linear experience that tests speed, focus, logic, and memory.

![Noggin Logo](src/assets/logo.png)

## ✨ Features

### 🎯 **Linear Challenge Flow**

- **Home** → **Speed Challenge** → **Focus Challenge** → **Logic Challenge** → **Memory Challenge** → **Results**
- Each challenge is designed to be completed in under a minute
- Total session time: ~4 minutes

### 🧩 **Four Brain Training Challenges**

1. **Speed Challenge** (25 seconds)

   - Tap highlighted shapes as quickly as possible
   - Tests reaction time and visual processing speed
   - 3x3 grid with various shape emojis

2. **Focus Challenge** (25 seconds)

   - Find the unique shape among pairs
   - Tests attention to detail and pattern recognition
   - 3x5 grid with 15 shapes (7 pairs + 1 unique)

3. **Logic Challenge** (30 seconds)

   - Solve logic puzzles with multiple choice answers
   - Tests reasoning ability and problem-solving skills
   - Example: "If two cats can catch two mice in two minutes, how many cats are needed to catch 100 mice in 100 minutes?"

4. **Memory Challenge** (Variable time)
   - Memorize a sequence of 12 symbols (5 seconds)
   - Recreate the sequence from shuffled positions
   - Tests working memory and recall ability

### 🎨 **Design & User Experience**

- **Minimalist Design**: Clean, distraction-free interface
- **Brand Colors**:
  - Primary: `#EC8BD0` (Noggin Pink)
  - Secondary: `#A77DFF` (Noggin Purple)
  - Background: `#FDF9F3` (Warm Cream)
- **Typography**: Anonymous Pro monospace font for clarity
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Progress Tracking**: Visual progress bars and step indicators

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/noggin.git
   cd noggin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Font**: Google Fonts (Anonymous Pro)
- **Package Manager**: npm

## 📁 Project Structure

```
noggin/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── SpeedChallenge.tsx  # Speed training challenge
│   │   ├── FocusChallenge.tsx  # Focus training challenge
│   │   ├── LogicChallenge.tsx  # Logic training challenge
│   │   └── MemoryChallenge.tsx # Memory training challenge
│   ├── assets/                 # Images and static assets
│   ├── styles/                 # Global styles and CSS
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── public/                     # Static public assets
├── package.json                # Dependencies and scripts
└── vite.config.ts             # Vite configuration
```

## 🎮 How to Play
1. **Start**: Click the "start" button on the home page
2. **Speed Challenge**: Tap the highlighted shape as quickly as possible
3. **Focus Challenge**: Find and click the shape that appears only once
4. **Logic Challenge**: Select the correct answer to the logic puzzle
5. **Memory Challenge**: Memorize the symbol sequence, then recreate it
6. **Results**: View your performance breakdown and scores

## 🎯 Scoring System

Each challenge contributes to your overall brain training score:

- **Speed**: Based on reaction time and accuracy
- **Focus**: Time to find the unique shape
- **Logic**: Correctness of reasoning
- **Memory**: Accuracy of sequence recreation

## 📝 License

**Copyright (c) 2025 Jacob Rose-Seiden**

This code is provided for demonstration and portfolio purposes only.

**Permission is NOT granted to:**

- Copy, modify, or distribute this code
- Create derivative works
- Use this code in any commercial or non-commercial projects
- Fork or clone this repository for any purpose other than viewing

This code is made available solely for the purpose of demonstrating programming skills to potential employers and may not be used for any other purpose without explicit written permission from the author.

**All rights reserved.**

## 🙏 Acknowledgments

- Inspired by cognitive training research and brain training methodologies
- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind
- Used Figma Make for wireframes and baseline code

## 📞 Contact

- **LinkedIn**: https://www.linkedin.com/in/jacobroseseiden
- **Email**: jacobroseseiden.prof@gmail.com
- **Portfolio**: This project is part of my professional portfolio

---

**Ready to wake up your brain? Start your 4-minute daily training session today!** 🧠✨

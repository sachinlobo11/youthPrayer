import React, { useState, useMemo,useEffect } from "react";
import { getLevelAndRank } from "./xpSystem";
import AIChat from "./../AIChat"

export default function Quiz({ questions,onClose,quizId }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("xp") || "0"));
  const [motivation, setMotivation] = useState("");
  const [showAI,setShowAI]=useState(false);
  const [wrongAnswers,setwrongAnswers]=useState({});
  const motivationWords = [
      "Keep pressing on!",
      "God strengthens you!",
      "Every setback is a setup!",
      "Stay faithful, victory is near!",
      "Don’t give up — you are chosen!"
    ];
  const questionsfix = [
    {
      question: "Who was the first king of Israel?",
      options: ["David", "Saul", "Solomon", "Samuel"],
      answer: "Saul",
    },
    {
      question: "In which city was Jesus born?",
      options: ["Jerusalem", "Nazareth", "Bethlehem", "Capernaum"],
      answer: "Bethlehem",
    },
    {
      question: "How many fruits of the Spirit are listed in Galatians 5?",
      options: ["7", "9", "12", "10"],
      answer: "9",
    },
  ];
  // 🌌 Particle generation
  const particleCount = 30;
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.4,
        d: 6 + Math.random() * 12,
        delay: -Math.random() * 20,
      })),
    []
  );


  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  const markQuizCompleted = (quizId) => {
  const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]");
  if (!completed.includes(quizId)) {
    completed.push(quizId);
    localStorage.setItem("completedQuizzes", JSON.stringify(completed));
  }
};


const handleAnswer = (option) => {
  setSelected(option);
  const questionKey = questions[currentQ].question;
  const correctAnswer = questions[currentQ].answer;
  setTimeout(() => {
    const completed = JSON.parse(localStorage.getItem("completedQuizzes") || "[]");
    if (option === correctAnswer) {
      setScore((s) => s + 1);
      // ✅ Award XP only if quiz not completed
      
      
      if (!completed.includes(quizId)) {
        setXp((prev) => prev + 10);
      }
    } else {
       if (!completed.includes(quizId)) {
        
      setXp((prev) => Math.max(0, prev - 5));
    }
      setMotivation(motivationWords[Math.floor(Math.random() * motivationWords.length)]);
      setwrongAnswers(prev => ({
        ...prev,
        [questionKey]: correctAnswer
      }));
      
      setTimeout(() => setMotivation(""), 5000);
       
    }
    if (currentQ + 1 < questions.length) {
      setCurrentQ((c) => c + 1);
      
      setSelected(null);
    } else {
      setShowResult(true);
  
      markQuizCompleted(quizId); // ✅ mark completed when done
    }
  }, 700);
};

const { level, rank, progress } = getLevelAndRank(xp);
  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center overflow-hidden">
      {/* ✨ Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Aurora waves */}
        <div
          className="absolute inset-0 opacity-50 animate-aurora"
          style={{
          backgroundImage: `radial-gradient(1200px 800px at 20% 20%, rgba(4, 123, 243, 0.81), transparent 60%),
            radial-gradient(1000px 700px at 80% 30%, rgba(11, 15, 248, 0.35), transparent 60%),
            radial-gradient(900px 600px at 50% 80%, rgba(206, 154, 13, 0.97), transparent 60%),
            linear-gradient(#000, #000)`
        }}
        />

        {/* Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: `${p.d}s`,
              animationDelay: `${p.delay}s`,
              transform: `translate3d(-50%, -50%, 0) scale(${p.s})`,
            }}
          />
        ))}
      </div>

      {/* Main Quiz Card */}
      <div className="relative w-full max-w-xl p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-10">
        {/* XP + Rank Display */}
        <div className="mb-6">
          <p className="text-sm">Level {level} — <span className="font-semibold">{rank}</span></p>
          <span className="text-sm">{xp} xp earned</span>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-3 bg-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {!showResult ? (
          <>
            <h2 className="text-2xl font-bold mb-6 tracking-wide">
              Question {currentQ + 1} of {questions.length}
            </h2>
            <p className="mb-6 text-lg">{questions[currentQ].question}</p>
            <div className="grid gap-4">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  className={`px-4 py-3 rounded-xl border border-white/20 transition-all
                    ${
                      selected === null
                        ? "bg-white/5 hover:bg-white/20"
                        : selected === opt && opt === questions[currentQ].answer
                        ? "bg-emerald-500/40 border-emerald-400 shadow-glow-green"
                        : selected === opt
                        ? "bg-red-500/40 border-red-400 shadow-glow-red"
                        : "bg-white/5 opacity-50"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

             {/* Motivation if XP lost */}
            {motivation && (
              <div className="mt-4 text-center text-pink-300 animate-marquee">
                {motivation}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 animate-bounce">
              Quiz Completed 🎉
            </h2>
            <p className="mb-6 text-lg">
              You Answered{" "}
              <span className="text-emerald-400 font-semibold">{score}</span> out
              of {questions.length}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/30 transition"
            >
              Closemm {Object.keys(wrongAnswers).length}
            </button>
                  {Object.keys(wrongAnswers).length > 0 && (
        <button onClick={() => setShowAI(true)} className="btn">
          Reveal Answers with AI
        </button>
      )}
      {showAI && <AIChat wrongAnswers={wrongAnswers} onClose={() => setShowAI(false)} />}
          </div>
        )}
      </div>

      {/* 🌌 Extra Styles */}
      <style>{`
        .particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 9999px;
          background: white;
          box-shadow: 0 0 10px rgba(255,255,255,.7);
          animation: floaty linear infinite;
        }
        @keyframes floaty {
          from { transform: translate3d(-50%, -50%, 0) scale(var(--s,1)) translateY(0px);}
          50% { transform: translate3d(-50%, -50%, 0) scale(var(--s,1)) translateY(-20px);}
          to { transform: translate3d(-50%, -50%, 0) scale(var(--s,1)) translateY(0px);}
        }
        .animate-aurora {
          animation: auroraMove 2s ease-in-out infinite alternate;
        }
        @keyframes auroraMove {
  0% {
    transform: 
      translateX(-10%) 
      translateY(-10%) 
      scale(1) 
      rotateZ(0deg) 
      rotateX(0deg) 
      rotateY(0deg);
    filter: blur(60px);
  }
  50% {
    transform: 
      translateX(5%) 
      translateY(5%) 
      scale(1.1) 
      rotateZ(180deg) 
      rotateX(20deg) 
      rotateY(20deg);
    filter: blur(70px);
  }
  100% {
    transform: 
      translateX(10%) 
      translateY(10%) 
      scale(1.2) 
      rotateZ(360deg) 
      rotateX(10deg) 
      rotateY(10deg);
    filter: blur(80px);
  }
}

.animate-aurora {
  animation: auroraMove 50s linear infinite;
}


        .shadow-glow-green {
          box-shadow: 0 0 20px rgba(16,185,129,0.7);
        }
        .shadow-glow-red {
          box-shadow: 0 0 20px rgba(239,68,68,0.7);
        }
      `}</style>
    </div>
  );
}

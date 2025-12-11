import React, { useMemo, useState,useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Play, BookOpenText, ArrowLeft, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopMenu from "./components/TopMenu";
import QuizWrapper from "./components/QuizWrapper";
import STUDIES from "./data/STUDIES.json";
import { askAI } from './ai'
import { getLevelAndRank } from "./components/xpSystem";



// ---- Sample Data -----------------------------------------------------------
/**const STUDIES = [
  {
    id: 1,
    title: "Love of God",
    thumbnail:
      "https://images.unsplash.com/photo-1532446813800-37c8a0071b0d?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/NY9oWqozBRc",
    notes: `# Love of God\n\n## Key Points\n- God's love is **unconditional**.\n- Shown fully in the sacrifice of Jesus.\n- We are called to love one another.\n\n## Reflection\n- Recall moments you personally sensed God's love.\n- How can you reflect this love this week?\n\n> *“We love because he first loved us.”* — 1 John 4:19\n`,
    verses: ["John 3:16", "Romans 5:8", "1 John 4:8", "1 John 4:19"],
    sermon: "Ps. abc",
    duration: "18:42",
  },
  {
    id: 2,
    title: "Faith in Trials",
    thumbnail:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/1QOqYw1Y9T8?rel=0",
    notes: `# Faith in Trials\n\n**Main Idea:** Trials are opportunities for steadfast faith to grow.\n\n### Outline\n1. Joy in testing (James 1:2-4)\n2. Faith defined (Hebrews 11:1)\n3. Praying for wisdom (James 1:5)\n\n### Application\n- Journal one trial and how God formed your character through it.\n- Pray for wisdom daily this week.\n`,
    verses: ["James 1:2-4", "Hebrews 11:1", "James 1:5"],
    sermon: "Ps. abc",
    duration: "24:03",
  },
  {
    id: 3,
    title: "Walking in the Spirit",
    thumbnail:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/o9Z8nRvlC5g?rel=0",
    notes: `# Walking in the Spirit\n\n- The Spirit produces the **fruit** of Christlike character (Galatians 5:22-23).\n- Keep in step with the Spirit through prayer, Scripture, and obedience.\n\n## Discussion\n- Which fruit of the Spirit is God highlighting to you?\n- How will you practice it today?\n`,
    verses: ["Galatians 5:16-26", "Romans 8:1-11"],
    sermon: "Ps.ght",
    duration: "16:27",
  },
];*/

// ---- UI Helpers ------------------------------------------------------------
const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200 dark:text-black">{children}</span>
);

const Card = ({ children, className = "" , layoutId, onClick}) => (
  <motion.div layoutId={layoutId} onClick={onClick} className={`rounded-2xl bg-white shadow-sm border border-gray-100 ${className}`}>{children}
</motion.div>
);


const Button = ({ children, onClick, variant = "primary", className = "", type = "button" }) => {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition";
  const styles = {
    primary: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent hover:bg-gray-100",
    neon: "bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.8)] hover:opacity-90",
  };
  return (
    <motion.button whileTap={{ scale: 0.96 }}
whileHover={{ y: -1 }} type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </motion.button>
  );
};

// Futuristic 3D background (blur + animated gradients)
function FuturisticBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <style>{`
        @keyframes float-xy { 
          0%,100% { transform: translate3d(0,0,0) scale(1); } 
          50% { transform: translate3d(30px,-20px,0) scale(1.05); } 
        }
        @keyframes float-xy-2 { 
          0%,100% { transform: translate3d(0,0,0) scale(1); } 
          50% { transform: translate3d(-24px,24px,0) scale(1.07); } 
        }
        @keyframes orbit { 
          to { transform: rotate(360deg); } 
        }
        @keyframes scan { 
          0% { background-position: 0% 0%; } 
          100% { background-position: 200% 200%; } 
        }
        @keyframes gridShift {
          0% { background-position: 0 0, 0 0; } 
          100% { background-position: 40px 20px, 20px 40px; } 
        }
        @keyframes twinkle {
          0%,100% { opacity: .18; } 
          50% { opacity: .5; } 
        }
      `}</style>

      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 40%, #0b1020 0%, #060912 55%, #02050a 80%, #000 100%)",
        }}
      />

      {/* Neon plasma blobs */}
      
    </div>
  );
}

function DevotionalGenerator() {
  const [devotional, setDevotional] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const result = await askAI("Write a 3-sentence devotional based on John 3:16.");
    setDevotional(result);
    setLoading(false);
  }

  return (
    <div className="mt-6">
      <button onClick={handleGenerate} className="btn">
        {loading ? 'Generating...' : 'Generate Devotional'}
      </button>
      {devotional && <p className="mt-4 italic">{devotional}</p>}
    </div>
  );
}



// ---- Main App --------------------------------------------------------------
export default function BibleStudyLMS() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");

const [menuOpen, setMenuOpen] = useState(false);
const [showChangelog, setShowChangelog] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [countdown, setCountdown] = useState("");

const [showQuiz, setShowQuiz] = useState(false);

const [activeQuiz, setActiveQuiz] = useState(null);
const [xp, setXp] = useState(() => parseInt(localStorage.getItem("xp") || "0"));

 useEffect(() => {
    const syncXp = () => setXp(parseInt(localStorage.getItem("xp") || "0"));
    window.addEventListener("storage", syncXp);
    return () => window.removeEventListener("storage", syncXp);
  }, []);


const { level, rank, progress } = getLevelAndRank(xp);
//const [xp, setXP] = useState(() => Number(localStorage.getItem("xp") || 0));
const [perStudyProgress, setPerStudyProgress] = useState(() => {
  try { return JSON.parse(localStorage.getItem("progress") || "{}"); } catch { return {}; }
});

// load/apply dark mode
useEffect(() => {
  const saved = localStorage.getItem("darkMode") === "true";
  setDarkMode(saved);
  if (saved) document.documentElement.classList.add("dark");
}, []);
useEffect(() => {
  if (darkMode) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  localStorage.setItem("darkMode", String(darkMode));
}, [darkMode]);

// persist XP + per-study quiz progress
useEffect(() => localStorage.setItem("xp", String(xp)), [xp]);
useEffect(() => localStorage.setItem("progress", JSON.stringify(perStudyProgress)), [perStudyProgress]);

// (KEEP) countdown to next Tuesday 5:30 AM  — already in your code

  // load markdown when selected changes
  useEffect(() => {
    if (selected) {
      fetch(selected.notesFile)
        .then((res) => res.text())
        .then((text) => setNotes(text));
    }
  }, [selected]);
  const filtered = useMemo(() => {
    if (!query.trim()) return STUDIES;
    const q = query.toLowerCase();
    return STUDIES.filter(
      (s) => s.title.toLowerCase().includes(q) || s.verses.join(" ").toLowerCase().includes(q) || s.sermon.toLowerCase().includes(q)
    );
  }, [query]);

  if (selected) {
    return (
      <div className="min-h-screen relative p-6 md:p-10 text-gray-900 dark:text-gray-100">
      {/*</div>*<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-10">*/}
        <FuturisticBackground />
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="text-white"onClick={() => setSelected(null)}>
              <ArrowLeft size={18} /> Back to studies
            </Button>
            <div className="flex items-center gap-2">
              <Badge>{selected.duration}</Badge>
              <Badge>{selected.verses.length} verses</Badge>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white">{selected.title}</h1>


          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="sticky top-6 overflow-hidden">
  <div className="w-full aspect-video">
    <iframe
      className="w-full h-full"
      src={selected.videoUrl}
      title={selected.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
  <div className="p-5 border-t border-gray-100">
    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
      <BookOpenText size={18} /> Bible Verses
    </h2>
    <ul className="flex overflow-x-auto space-x-2 py-2 scrollbar-thin scrollbar-thumb-gray-300">
  {selected.verses.map((v, i) => (
    <li
      key={i}
      className="flex-shrink-0 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap"
    >
      {v}
    </li>
  ))}
</ul>

  </div>
</Card>

            {/* Notes Panel */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Study Notes </h2>
                
              </div>
              <div className="prose prose-sm md:prose-base max-w-none">
                <ReactMarkdown>{notes}</ReactMarkdown>
                 <button
          onClick={() => setShowQuiz(true)}
          className="mt-4 px-4 py-2 rounded-lg bg-black text-white hover:bg-blue-700 transition"
        >
          Take Quiz
        </button>

              </div>
              
            </Card>
            
              {/* Render Quiz when button clicked */}
      {showQuiz && <QuizWrapper quizId={selected.id}  onClose={() => setShowQuiz(false)} />}
            
          </div>
        </div>
      </div>
    );
  }

if (activeQuiz) {
  return (
    <QuizPage
      quiz={activeQuiz}
      onExit={() => setActiveQuiz(null)}
      onComplete={(results) => {
        console.log("Quiz results:", results);
        setActiveQuiz(null);
      }}
    />
  );
}


  return (
    
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-xl ">Grow Deeper in Faith!</h1>
  <TopMenu />
</div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight"> Connect and Pray</h1>
            <p className="text-gray-600 mt-1">Browse studies, watch the teaching, and read notes.</p>
          </div>
          {/* XP Roadmap */}
  <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">Level {level} . {rank} </span>
      <span className="text-sm text-gray-400"> Next:{progress}/100 XP</span>
    </div>
    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-3 bg-blue-500 transition-all shadow-md shadow-blue-500/50"

        style={{ width: `${progress}%` }}
      />
      {/* Milestones */}
      {[25, 50, 75, 100].map((m) => (
        <div
          key={m}
          className="absolute top-0 h-3 w-[1px] bg-gray-300"
          style={{ left: `${m}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>{rank}</span>
      <span>Next Rank →</span>
    </div>
  </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 w-full md:w-80">
            <Search size={18} className="shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles or verses…"
              className="w-full outline-none text-sm"
            />
          </div>
        </div>
         

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice().reverse().map((s) => (
            <Card key={s.id} className="overflow-hidden group">
              <div className="relative">
                <img src={s.thumbnail} alt={s.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge>{s.duration}</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 min-h-[1rem]">{s.title}</h3>
                <h5 className=" text-sm  ">{s.sermon}</h5>
                <div className="flex flex-wrap gap-2">
                  {s.verses.slice(0, 3).map((v, i) => (
                    <Badge key={i}>{v}</Badge>
                  ))}
                </div>
                <Button className="w-full justify-center mt-2" onClick={() => setSelected(s)}>
                  <Play size={16} /> Play & Notes
                </Button>
              </div>
            </Card>

      
     
          ))}
        </div>
        
      </div>
<footer className="w-full bg-black text-gray-300 py-6 mt-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 text-center">

        {/* Title */}
        <h2 className="text-lg font-semibold tracking-wide text-white">
          End Time Full Gospel Harvesters Church Mangalore
        </h2> 
       <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Chokmah 0.5.0 , All Rights Reserved.
        </p>
      </div></footer>

    </div>
  );
}











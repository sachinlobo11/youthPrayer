import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Play, BookOpenText, ArrowLeft, Search } from "lucide-react";

// ---- Sample Data -----------------------------------------------------------
const STUDIES = [
  {
    id: 1,
    title: "Love of God",
    thumbnail:
      "https://images.unsplash.com/photo-1532446813800-37c8a0071b0d?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Z1Yd7upQsXY?rel=0",
    notes: `# Love of God\n\n## Key Points\n- God's love is **unconditional**.\n- Shown fully in the sacrifice of Jesus.\n- We are called to love one another.\n\n## Reflection\n- Recall moments you personally sensed God's love.\n- How can you reflect this love this week?\n\n> *“We love because he first loved us.”* — 1 John 4:19\n`,
    verses: ["John 3:16", "Romans 5:8", "1 John 4:8", "1 John 4:19"],
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
    duration: "16:27",
  },
];

// ---- UI Helpers ------------------------------------------------------------
const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">{children}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "primary", className = "", type = "button" }) => {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition";
  const styles = {
    primary: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent hover:bg-gray-100",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ---- Main App --------------------------------------------------------------
export default function BibleStudyLMS() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return STUDIES;
    const q = query.toLowerCase();
    return STUDIES.filter(
      (s) => s.title.toLowerCase().includes(q) || s.verses.join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  if (selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelected(null)}>
              <ArrowLeft size={18} /> Back to studies
            </Button>
            <div className="flex items-center gap-2">
              <Badge>{selected.duration}</Badge>
              <Badge>{selected.verses.length} verses</Badge>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">{selected.title}</h1>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Video Panel */}
            <Card className="overflow-hidden">
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
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  {selected.verses.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Notes Panel */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Study Notes (Markdown)</h2>
                <Badge>Markdown</Badge>
              </div>
              <div className="prose prose-sm md:prose-base max-w-none">
                <ReactMarkdown>{selected.notes}</ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bible Study LMS</h1>
            <p className="text-gray-600 mt-1">Browse studies, watch the teaching, and read notes in Markdown.</p>
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
          {filtered.map((s) => (
            <Card key={s.id} className="overflow-hidden group">
              <div className="relative">
                <img src={s.thumbnail} alt={s.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge>{s.duration}</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 min-h-[2.5rem]">{s.title}</h3>
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
    </div>
  );
}

import React,{ useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Moon, Sun, Clock, BookOpen, Video, ShoppingBag } from "lucide-react";
import ChangelogModal from "./ChangelogModal";
console.log("TOP")
export default function TopMenu() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [tuesdayCountdown, setTuesdayCountdown] = useState("");
  const [showChangelog, setShowChangelog] = useState(false);
const [fridayCountdown, setFridayCountdown] = useState("");

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Countdown until next Tuesday 5:30 AM
  useEffect(() => {
  function getNext(dayOfWeek, hour, minute) {
    const now = new Date();
    const next = new Date(now);
    const delta = (dayOfWeek - now.getDay() + 7) % 7;
    next.setDate(now.getDate() + delta);
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 7);
    return next;
  }

  function updateCountdown() {
    const now = new Date();
    const nextTuesday = getNext(2, 5, 30); // Tuesday
    const nextFriday = getNext(5, 5, 30);  // Friday

    const diffTuesday = nextTuesday - now;
    const diffFriday = nextFriday - now;

    const target = diffTuesday < diffFriday ? diffTuesday : diffFriday;

    const hrs = Math.floor(target / (1000 * 60 * 60));
    const mins = Math.floor((target % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((target % (1000 * 60)) / 1000);

    setCountdown(`${hrs}h ${mins}m ${secs}s`);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
  return () => clearInterval(timer);
}, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        Menu <ChevronDown size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50"
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Night Mode"}
            </button>

            <a
              href="https://meet.google.com/zgf-vgxw-gsj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Video size={18} /> Join Meeting
            </a>

            

            <a
              href="https://chokmah.vercel.app"
              className="flex items-center gap-3 px-4 py-3 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <BookOpen size={18} /> Friday Bible Study Notes
            </a>
             <button
                  onClick={() => {
                    setShowChangelog(true);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ShoppingBag size={18}/> What's New
                </button>
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-10">
              <Clock size={18} /> {countdown} until Next Meeting
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Changelog Modal */}
      <AnimatePresence>
        {showChangelog && (
          <ChangelogModal onClose={() => setShowChangelog(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

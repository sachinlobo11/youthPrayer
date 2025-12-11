import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ChangelogModal({ onClose }) {
  const changelog = `
# What's New ✨

## [0.2.0] – 2025-08-21
- Added dropdown menu with night mode
- Added countdown timer for Tuesday 5:30 AM meeting
- Added link to Friday Bible study notes

## [0.1.0] – 2025-08-18
- Initial release with Bible Study grid
- Video player with markdown notes
- Search by title and verses
  `;
console.log("Kbb")
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4 dark:text-white">Changelog</h2>
        <div className="prose dark:prose-invert max-h-80 overflow-y-auto">
          <ReactMarkdown>{changelog}</ReactMarkdown>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// src/xpSystem.js
export const ranks = ["Disciple", "Teacher", "Shepherd", "Elder", "Apostle", "Servant Leader"];

export function getLevelAndRank(xp) {
  const level = Math.floor(xp / 100) + 1; 
  const rank = ranks[Math.min(ranks.length - 1, Math.floor(xp / 100))];
  const progress = xp % 100; // progress toward next level
  return { level, rank, progress };
}

// 
const quizModules = import.meta.glob("./data/*.json", { eager: true });

export const quizzes = Object.fromEntries(
  Object.entries(quizModules)
    .map(([path, mod]) => {
      const match = path.match(/(\d+)\.json$/);
      if (!match) {
        console.warn(`Invalid quiz path: ${path}`);
        return null;
      }
      return [match[1], mod?.default ?? null];
    })
    .filter(Boolean)
);

// Example: quizzes["1"] → JSON of 1.json

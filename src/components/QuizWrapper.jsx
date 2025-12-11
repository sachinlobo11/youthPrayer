import { quizzes } from "../loadAllQuizzes";
import Quiz from "./Quiz";
import React, { useMemo, useState,useEffect } from "react";
export default function QuizWrapper({ quizId, onClose }) {
  const questions = quizzes[quizId] || [];

  if (!questions.length) {
    return <p className="text-red-400">No quiz found for ID {quizId}</p>;
  }

  return <Quiz questions={questions} quizId={quizId} onClose={onClose} />;
}

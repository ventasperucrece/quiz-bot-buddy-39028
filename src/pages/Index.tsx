import { useState } from "react";
import { QuizInput } from "@/components/QuizInput";
import { QuizQuestion } from "@/components/QuizQuestion";
import { QuizResults } from "@/components/QuizResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type GameState = "input" | "quiz" | "results";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("input");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuiz = async (topic: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic }
      });

      if (error) {
        console.error('Error al invocar la función:', error);
        throw new Error(error.message);
      }

      if (!data || !data.questions) {
        throw new Error('No se recibieron preguntas del servidor');
      }

      setQuestions(data.questions);
      setGameState("quiz");
      setCurrentQuestionIndex(0);
      setScore(0);
      
      toast({
        title: "¡Quiz generado!",
        description: `5 preguntas sobre ${topic} están listas.`,
      });
    } catch (error) {
      console.error('Error completo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo generar el quiz. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameState("results");
    }
  };

  const handleRestart = () => {
    setGameState("input");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      {gameState === "input" && (
        <QuizInput onGenerateQuiz={handleGenerateQuiz} isLoading={isLoading} />
      )}

      {gameState === "quiz" && questions[currentQuestionIndex] && (
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {gameState === "results" && (
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
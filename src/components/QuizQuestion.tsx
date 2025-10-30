import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Resetear el estado cuando cambia la pregunta
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [questionNumber]);

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(index);
    setHasAnswered(true);
    const isCorrect = index === question.correctAnswer;
    onAnswer(isCorrect);
  };

  const getOptionClassName = (index: number) => {
    if (!hasAnswered) {
      return "hover:border-primary hover:bg-primary/5 cursor-pointer transition-all";
    }
    
    if (index === question.correctAnswer) {
      return "border-success bg-success/10";
    }
    
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return "border-destructive bg-destructive/10";
    }
    
    return "opacity-50";
  };

  const getOptionIcon = (index: number) => {
    if (!hasAnswered) return null;
    
    if (index === question.correctAnswer) {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
    
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Pregunta {questionNumber} de {totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all",
                i < questionNumber ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <Card className="p-8 shadow-[var(--shadow-card)] border-2">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered}
              className={cn(
                "w-full p-4 text-left rounded-lg border-2 flex items-center justify-between gap-3",
                getOptionClassName(index)
              )}
            >
              <span className="flex-1">{option}</span>
              {getOptionIcon(index)}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">
            <Button
              onClick={onNext}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {questionNumber === totalQuestions ? "Ver Resultados" : "Siguiente Pregunta"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
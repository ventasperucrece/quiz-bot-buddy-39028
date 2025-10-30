import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RefreshCw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizResults = ({ score, totalQuestions, onRestart }: QuizResultsProps) => {
  const percentage = (score / totalQuestions) * 100;
  
  const getMessage = () => {
    if (percentage === 100) return "¡Perfecto! 🎉";
    if (percentage >= 80) return "¡Excelente! 🌟";
    if (percentage >= 60) return "¡Bien hecho! 👏";
    if (percentage >= 40) return "¡Buen intento! 💪";
    return "Sigue practicando 📚";
  };

  const getColor = () => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="p-8 shadow-[var(--shadow-card)] border-2 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-[var(--shadow-glow)]">
          <Trophy className="w-12 h-12 text-primary-foreground" />
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-bold">¡Quiz Completado!</h2>
          <p className="text-xl text-muted-foreground">{getMessage()}</p>
        </div>

        <div className="py-8">
          <div className={cn("text-7xl font-bold", getColor())}>
            {score}/{totalQuestions}
          </div>
          <p className="text-lg text-muted-foreground mt-2">
            {percentage.toFixed(0)}% correcto
          </p>
        </div>

        <div className="grid gap-3 pt-4">
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Nuevo Quiz
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Quiz IA',
                  text: `¡Obtuve ${score}/${totalQuestions} en Quiz IA! 🎯`,
                });
              }
            }}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Compartir Resultado
          </Button>
        </div>
      </Card>
    </div>
  );
};
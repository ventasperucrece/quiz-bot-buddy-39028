import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface QuizInputProps {
  onGenerateQuiz: (topic: string) => void;
  isLoading: boolean;
}

export const QuizInput = ({ onGenerateQuiz, isLoading }: QuizInputProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerateQuiz(topic.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-[var(--shadow-glow)]">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Quiz IA
        </h1>
        <p className="text-lg text-muted-foreground">
          Ingresa un tema y la IA generará 5 preguntas desafiantes para ti
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Ej: Diseño UX, Marketing Digital, JavaScript..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-14 px-6 text-lg border-2 focus-visible:ring-2 focus-visible:ring-primary transition-all"
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          size="lg"
          disabled={!topic.trim() || isLoading}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-[var(--shadow-card)]"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Generando quiz...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generar Quiz
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {["Diseño UX", "Marketing", "JavaScript", "CSS"].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => setTopic(suggestion)}
            disabled={isLoading}
            className="transition-all hover:border-primary hover:text-primary"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
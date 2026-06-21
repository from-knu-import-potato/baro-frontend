import { Bot } from 'lucide-react';

interface AiDemandCardProps {
  prediction: string;
}

const AiDemandCard = ({ prediction }: AiDemandCardProps) => {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 w-7 h-7 rounded-full bg-baro-blue flex items-center justify-center mt-0.5">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0 bg-muted/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <p className="text-xs leading-relaxed text-foreground/80">{prediction}</p>
        </div>
      </div>
    </div>
  );
};

export default AiDemandCard;

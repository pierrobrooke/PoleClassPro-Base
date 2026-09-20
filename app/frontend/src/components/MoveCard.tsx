import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NotionMove } from '@/hooks/useNotionMoves';

interface MoveCardProps {
  move: NotionMove;
  onSelect?: (move: NotionMove) => void;
  selected?: boolean;
  compact?: boolean;
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-coral/15 text-coral border-coral/30',
  Intermediate: 'bg-lavender/15 text-lavender border-lavender/30',
  Advanced: 'bg-ocean/15 text-ocean border-ocean/30',
  Expert: 'bg-gold/15 text-gold border-gold/30',
};

const categoryColors: Record<string, string> = {
  Spin: 'bg-lavender/15 text-lavender border-lavender/30',
  Static: 'bg-ocean/15 text-ocean border-ocean/30',
  Transition: 'bg-gold/15 text-gold border-gold/30',
  Floor: 'bg-coral/15 text-coral border-coral/30',
  Climb: 'bg-ocean/15 text-ocean border-ocean/30',
  Invert: 'bg-lavender/15 text-lavender border-lavender/30',
  Trick: 'bg-coral/15 text-coral border-coral/30',
  Pose: 'bg-gold/15 text-gold border-gold/30',
};

export function MoveCard({ move, onSelect, selected, compact }: MoveCardProps) {
  const level = move.level || '';
  const category = move.category || '';

  if (compact) {
    return (
      <div
        onClick={() => onSelect?.(move)}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
          selected
            ? 'border-ocean bg-ocean/10 shadow-sm'
            : 'border-[rgba(184,192,204,0.14)] bg-[#1E2530] hover:border-ocean/40 hover:bg-[#283241]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading font-semibold text-sm truncate text-[#F7F4EF]">{move.name}</span>
          <div className="flex gap-1 shrink-0">
            {level && (
              <Badge variant="outline" className={`text-xs ${levelColors[level] || 'bg-muted/15 text-muted-foreground border-muted/30'}`}>
                {level}
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className={`text-xs ${categoryColors[category] || 'bg-muted/15 text-muted-foreground border-muted/30'}`}>
                {category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={() => onSelect?.(move)}
      className={`cursor-pointer transition-all duration-200 bg-[#313D4D] border-[rgba(184,192,204,0.14)] card-hover ${
        selected
          ? 'border-ocean ring-2 ring-ocean/20 shadow-md'
          : 'hover:border-ocean/40'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="font-heading text-base text-[#F7F4EF]">{move.name}</CardTitle>
          <div className="flex gap-1">
            {level && (
              <Badge variant="outline" className={`text-xs ${levelColors[level] || 'bg-muted/15 text-muted-foreground border-muted/30'}`}>
                {level}
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className={`text-xs ${categoryColors[category] || 'bg-muted/15 text-muted-foreground border-muted/30'}`}>
                {category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {move.notes_teaching_tips && (
          <p className="text-sm text-[#B8C0CC] mb-3 line-clamp-2">{move.notes_teaching_tips}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {(move.muscle_groups || []).map((muscle) => (
            <Badge key={muscle} variant="secondary" className="text-xs bg-[#283241] text-[#B8C0CC] border-[rgba(184,192,204,0.14)]">
              {muscle}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
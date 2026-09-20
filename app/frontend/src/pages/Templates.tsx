import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { buildClassTemplates, ClassTemplate } from '@/data/classTemplates';
import { useNotionMoves } from '@/hooks/useNotionMoves';
import { NotionMove } from '@/hooks/useNotionMoves';
import { useReferenceData } from '@/hooks/useReferenceData';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  StretchHorizontal,
  RotateCw,
  Dumbbell,
  Music2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const templateIcons: Record<string, React.ReactNode> = {
  'template-beginner-flow': <Flame className="h-6 w-6" />,
  'template-advanced-tricks': <Zap className="h-6 w-6" />,
  'template-flexibility-focus': <StretchHorizontal className="h-6 w-6" />,
  'template-spin-combos': <RotateCw className="h-6 w-6" />,
  'template-strength-conditioning': <Dumbbell className="h-6 w-6" />,
  'template-exotic-floorwork': <Music2 className="h-6 w-6" />,
};

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
  mixed: 'bg-blue-100 text-blue-800 border-blue-200',
};

const notionLevelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
  Expert: 'bg-purple-100 text-purple-700',
};

/**
 * Try to match a template move name against Notion moves.
 * Uses case-insensitive partial matching.
 */
function findNotionMatch(moveName: string, notionMoves: NotionMove[]): NotionMove | null {
  const normalized = moveName.toLowerCase().trim();

  // Exact match first
  const exact = notionMoves.find((m) => m.name.toLowerCase().trim() === normalized);
  if (exact) return exact;

  // Partial match: template name is contained in Notion name or vice versa
  const partial = notionMoves.find(
    (m) =>
      m.name.toLowerCase().includes(normalized) || normalized.includes(m.name.toLowerCase().trim())
  );
  return partial || null;
}

interface MatchedMove {
  templateName: string;
  notionMove: NotionMove | null;
}

export default function Templates() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<ClassTemplate | null>(null);
  const { moves: notionMoves, loading: movesLoading } = useNotionMoves();
  const refData = useReferenceData();
  const classTemplates = useMemo(() => buildClassTemplates(refData), [refData]);

  // Extract move names from templates and match against Notion moves
  const getMatchedMoves = useMemo(() => {
    return (template: ClassTemplate): MatchedMove[] => {
      return template.moves.map((m) => ({
        templateName: m.name,
        notionMove: findNotionMatch(m.name, notionMoves),
      }));
    };
  }, [notionMoves]);

  const handleUseTemplate = (template: ClassTemplate) => {
    const matchedMoves = getMatchedMoves(template);
    const resolvedNotionMoves = matchedMoves
      .filter((m) => m.notionMove !== null)
      .map((m) => m.notionMove as NotionMove);

    // Save template data to localStorage so Dashboard can load it
    const classData = {
      classTitle: template.name,
      classLevel: template.level,
      classDuration: template.duration,
      overview: template.overview,
      studentOutcome: template.studentOutcome,
      selectedSetup: template.setupChecklist.reduce(
        (acc, item) => ({ ...acc, [item]: true }),
        {} as Record<string, boolean>
      ),
      selectedWarmups: template.warmups,
      selectedTechniques: template.techniques,
      selectedMoves: resolvedNotionMoves,
      selectedCues: template.cues,
      selectedSafety: template.safetyNotes.reduce(
        (acc, item) => ({ ...acc, [item]: true }),
        {} as Record<string, boolean>
      ),
      selectedPlaylists: template.playlists,
      selectedPrep: template.instructorPrep.reduce(
        (acc, item) => ({ ...acc, [item]: true }),
        {} as Record<string, boolean>
      ),
      selectedCoolDowns: template.coolDowns,
      // Also store unmatched move names for reference
      unmatchedMoveNames: matchedMoves
        .filter((m) => m.notionMove === null)
        .map((m) => m.templateName),
    };
    localStorage.setItem('poleDanceClassPlan', JSON.stringify(classData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-purple" />
            <h1 className="font-heading font-bold text-3xl text-foreground">Class Templates</h1>
          </div>
          <p className="font-body text-muted-foreground">
            Start with a pre-built class plan and customize it to fit your style. Each template
            includes warmups, moves, cues, playlists, and more.
          </p>
          {movesLoading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="sr-only">Loading</span>
            </div>
          )}
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate?.id === template.id
                  ? 'border-purple ring-2 ring-purple/20 shadow-md'
                  : 'border-border hover:border-purple/40'
              }`}
            >
              {/* Template Icon & Level */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple/10 text-purple">
                  {templateIcons[template.id]}
                </div>
                <Badge className={`${levelColors[template.level]} border`}>
                  {template.level.charAt(0).toUpperCase() + template.level.slice(1)}
                </Badge>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading font-bold text-lg mb-2">{template.name}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
                {template.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{template.duration} min</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>{template.moves.length} moves</span>
                </div>
              </div>

              {/* Focus Tags */}
              <div className="flex flex-wrap gap-1.5">
                {template.focus.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Detail Panel */}
        {selectedTemplate && (
          <div className="mt-8 rounded-xl border border-purple/30 bg-card p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading font-bold text-2xl mb-1">{selectedTemplate.name}</h2>
                <p className="font-body text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              <Button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="bg-purple text-white hover:bg-purple-light gap-2 font-heading shrink-0"
              >
                Use This Template
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Template Contents Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-heading font-medium text-sm mb-2">Warmup</h4>
                <ul className="space-y-1">
                  {selectedTemplate.warmups.map((w) => (
                    <li key={w.id} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple shrink-0" />
                      {w.name} ({w.duration})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-heading font-medium text-sm mb-2">
                  Moves
                  {!movesLoading && notionMoves.length > 0 && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (matched with Notion)
                    </span>
                  )}
                </h4>
                <ul className="space-y-1.5">
                  {getMatchedMoves(selectedTemplate).map((matched) => (
                    <li
                      key={matched.templateName}
                      className="text-xs flex items-start gap-1.5"
                    >
                      {matched.notionMove ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground font-medium">
                              {matched.notionMove.name}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {matched.notionMove.level && (
                                <Badge
                                  className={`text-[10px] px-1.5 py-0 ${notionLevelColors[matched.notionMove.level] || 'bg-gray-100 text-gray-700'}`}
                                >
                                  {matched.notionMove.level}
                                </Badge>
                              )}
                              {matched.notionMove.category && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {matched.notionMove.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{matched.templateName}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {movesLoading && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Matching...</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-heading font-medium text-sm mb-2">Techniques</h4>
                <ul className="space-y-1">
                  {selectedTemplate.techniques.map((t) => (
                    <li key={t.id} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple shrink-0" />
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-heading font-medium text-sm mb-2">Cool Down</h4>
                <ul className="space-y-1">
                  {selectedTemplate.coolDowns.slice(0, 5).map((c) => (
                    <li key={c.id} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-purple shrink-0" />
                      {c.name}
                    </li>
                  ))}
                  {selectedTemplate.coolDowns.length > 5 && (
                    <li className="text-xs text-muted-foreground">
                      +{selectedTemplate.coolDowns.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Student Outcome */}
            <div className="mt-4 p-4 rounded-lg bg-lavender">
              <h4 className="font-heading font-medium text-sm mb-1">Student Outcome</h4>
              <p className="text-sm text-muted-foreground font-body">
                {selectedTemplate.studentOutcome}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
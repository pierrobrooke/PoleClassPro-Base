import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import {
  Printer,
  Download,
  Share2,
  ClipboardList,
  Target,
  CheckSquare,
  Flame,
  GraduationCap,
  Layers,
  MessageCircle,
  AlertTriangle,
  Music,
  UserCheck,
  Snowflake,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import type {
  WarmupExercise,
  TeachingTechnique,
  CoachingCue,
  PlaylistSuggestion,
  CoolDownExercise,
} from '@/hooks/useReferenceData';
import type { NotionMove } from '@/hooks/useNotionMoves';

interface ClassPlanData {
  classTitle: string;
  classLevel: string;
  classDuration: string;
  overview: string;
  studentOutcome: string;
  selectedSetup: Record<string, boolean>;
  selectedWarmups: WarmupExercise[];
  selectedTechniques: TeachingTechnique[];
  selectedMoves: NotionMove[];
  selectedCues: CoachingCue[];
  selectedSafety: Record<string, boolean>;
  selectedPlaylists: PlaylistSuggestion[];
  selectedPrep: Record<string, boolean>;
  selectedCoolDowns: CoolDownExercise[];
}

interface ComboData {
  name: string;
  moves: NotionMove[];
}

export default function ClassSummary() {
  const [classPlan, setClassPlan] = useState<ClassPlanData | null>(null);
  const [comboData, setComboData] = useState<ComboData | null>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Load class plan from localStorage
    const savedPlan = localStorage.getItem('poleDanceClassPlan');
    if (savedPlan) {
      try {
        const data = JSON.parse(savedPlan);
        setClassPlan(data);
        setHasData(true);
      } catch {
        // ignore
      }
    }

    // Load combo from localStorage
    const savedCombo = localStorage.getItem('poleDanceCurrentCombo');
    if (savedCombo) {
      try {
        const data = JSON.parse(savedCombo);
        if (data.moves && data.moves.length > 0) {
          setComboData(data);
          setHasData(true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const getCheckedItems = (record: Record<string, boolean> | undefined) => {
    if (!record) return [];
    return Object.entries(record)
      .filter(([, checked]) => checked)
      .map(([item]) => item);
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Info className="h-16 w-16 text-purple/40 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
              No Class Plan Yet
            </h1>
            <p className="font-body text-foreground/70 mb-6 max-w-md">
              Start building your class plan in the Class Builder or choose a template to get
              started. Your choices will automatically appear here.
            </p>
            <div className="flex gap-3">
              <Link to="/dashboard">
                <Button className="bg-purple text-white hover:bg-purple-light gap-2 font-heading">
                  Open Class Builder
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" className="gap-2 font-heading">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const setupItems = getCheckedItems(classPlan?.selectedSetup);
  const safetyItems = getCheckedItems(classPlan?.selectedSafety);
  const prepItems = getCheckedItems(classPlan?.selectedPrep);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Logo for print */}
        <div className="hidden print:block mb-6">
          <Logo width={200} height={50} className="text-foreground" />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Class Summary</h1>
            <p className="font-body text-foreground mt-1">
              Your complete class plan ready for your session
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 font-heading" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2 font-heading">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2 font-heading">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Class Title Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-dark via-purple to-purple-light text-white overflow-hidden">
          <CardContent className="py-8">
            <div className="flex items-center gap-3 mb-2">
              {classPlan?.classLevel && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {classPlan.classLevel.charAt(0).toUpperCase() + classPlan.classLevel.slice(1)}
                </Badge>
              )}
              {classPlan?.classDuration && (
                <Badge className="bg-white/20 text-white border-white/30">
                  {classPlan.classDuration} minutes
                </Badge>
              )}
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl">
              {classPlan?.classTitle || 'Untitled Class'}
            </h2>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {/* Overview */}
          {classPlan?.overview && (
            <SummarySection icon={<ClipboardList />} title="Class Overview">
              <p className="font-body text-foreground">{classPlan.overview}</p>
            </SummarySection>
          )}

          {/* Student Outcome */}
          {classPlan?.studentOutcome && (
            <SummarySection icon={<Target />} title="Student Outcome">
              <p className="font-body text-foreground">{classPlan.studentOutcome}</p>
            </SummarySection>
          )}

          {/* Setup Checklist */}
          {setupItems.length > 0 && (
            <SummarySection icon={<CheckSquare />} title="Setup Checklist">
              <ul className="space-y-2">
                {setupItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-body text-sm">
                    <div className="w-4 h-4 rounded border-2 border-purple flex items-center justify-center">
                      <div className="w-2 h-2 rounded-sm bg-purple" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </SummarySection>
          )}

          {/* Warmup */}
          {classPlan?.selectedWarmups && classPlan.selectedWarmups.length > 0 && (
            <SummarySection icon={<Flame />} title="Warmup">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {classPlan.selectedWarmups.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3 rounded-lg bg-lavender border border-purple/10"
                  >
                    <p className="font-heading font-medium text-sm">{exercise.name}</p>
                    <p className="text-xs text-foreground/70">{exercise.duration}</p>
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Teaching Techniques */}
          {classPlan?.selectedTechniques && classPlan.selectedTechniques.length > 0 && (
            <SummarySection icon={<GraduationCap />} title="Teaching Techniques">
              <div className="flex flex-wrap gap-2">
                {classPlan.selectedTechniques.map((technique) => (
                  <Badge key={technique.id} variant="outline" className="font-body py-1.5 px-3">
                    {technique.name}
                  </Badge>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Moves */}
          {classPlan?.selectedMoves && classPlan.selectedMoves.length > 0 && (
            <SummarySection icon={<Layers />} title="Moves">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {classPlan.selectedMoves.map((move) => (
                  <div
                    key={move.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <span className="font-heading font-medium text-sm">{move.name}</span>
                    <div className="flex gap-1">
                      {move.level && (
                        <Badge variant="outline" className="text-xs">
                          {move.level}
                        </Badge>
                      )}
                      {move.category && (
                        <Badge variant="outline" className="text-xs">
                          {move.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Combo */}
          {comboData && comboData.moves.length > 0 && (
            <SummarySection icon={<Layers />} title={`Combo: ${comboData.name || 'Untitled'}`}>
              <div className="flex flex-wrap items-center gap-2">
                {comboData.moves.map((move, index) => (
                  <div key={`${move.id}-${index}`} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple/5 border border-purple/20">
                      <span className="w-5 h-5 rounded-full bg-purple text-white text-xs flex items-center justify-center font-heading">
                        {index + 1}
                      </span>
                      <span className="font-heading text-sm font-medium">{move.name}</span>
                    </div>
                    {index < comboData.moves.length - 1 && (
                      <span className="text-purple/40">→</span>
                    )}
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Coaching Cues */}
          {classPlan?.selectedCues && classPlan.selectedCues.length > 0 && (
            <SummarySection icon={<MessageCircle />} title="Coaching Cues">
              <div className="space-y-2">
                {classPlan.selectedCues.map((cue) => (
                  <div key={cue.id} className="flex items-start gap-2 p-2 rounded bg-lavender/50">
                    <span className="text-pink font-bold">"</span>
                    <p className="font-body text-sm italic">{cue.cue}</p>
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Safety Notes */}
          {safetyItems.length > 0 && (
            <SummarySection icon={<AlertTriangle />} title="Safety Notes">
              <ul className="space-y-2">
                {safetyItems.map((note) => (
                  <li key={note} className="flex items-start gap-2 font-body text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </SummarySection>
          )}

          {/* Playlist */}
          {classPlan?.selectedPlaylists && classPlan.selectedPlaylists.length > 0 && (
            <SummarySection icon={<Music />} title="Playlist">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {classPlan.selectedPlaylists.map((pl) => (
                  <div key={pl.id} className="p-3 rounded-lg border border-pink/20 bg-pink/5">
                    <p className="font-heading font-medium text-sm">{pl.name}</p>
                    <p className="text-xs text-foreground/70 mt-1">{pl.mood}</p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {pl.bpm} BPM
                    </Badge>
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Cool Down */}
          {classPlan?.selectedCoolDowns && classPlan.selectedCoolDowns.length > 0 && (
            <SummarySection icon={<Snowflake />} title="Cool Down">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {classPlan.selectedCoolDowns.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3 rounded-lg bg-lavender border border-purple/10"
                  >
                    <p className="font-heading font-medium text-sm">{exercise.name}</p>
                    <p className="text-xs text-foreground/70">{exercise.duration}</p>
                  </div>
                ))}
              </div>
            </SummarySection>
          )}

          {/* Instructor Prep */}
          {prepItems.length > 0 && (
            <SummarySection icon={<UserCheck />} title="Instructor Prep">
              <ul className="space-y-2">
                {prepItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-body text-sm">
                    <div className="w-4 h-4 rounded border-2 border-purple flex items-center justify-center">
                      <div className="w-2 h-2 rounded-sm bg-purple" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </SummarySection>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 font-heading text-base">
          <div className="text-purple">{icon}</div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
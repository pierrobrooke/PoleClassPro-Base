import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClassSection, ChecklistItem } from '@/components/ClassSection';
import { MoveCard } from '@/components/MoveCard';
import { Navigation } from '@/components/Navigation';
import {
  ClipboardList,
  Target,
  CheckSquare,
  MessageCircle,
  AlertTriangle,
  Music,
  UserCheck,
  Flame,
  GraduationCap,
  Layers,
  Save,
  FileText,
  Snowflake,
  Check,
  Sparkles,
  X,
  Search,
  Loader2,
} from 'lucide-react';
import { useReferenceData } from '@/hooks/useReferenceData';
import type {
  WarmupExercise,
  TeachingTechnique,
  CoachingCue,
  PlaylistSuggestion,
  CoolDownExercise,
} from '@/hooks/useReferenceData';
import { useNotionMoves } from '@/hooks/useNotionMoves';
import type { NotionMove } from '@/hooks/useNotionMoves';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { moves: notionMoves, loading: movesLoading, error: movesError, levels, categories } = useNotionMoves();
  const {
    warmupExercises,
    teachingTechniques,
    coachingCues,
    playlistSuggestions,
    coolDownExercises,
    safetyNotes,
    setupChecklist,
    instructorPrep,
    loading: refLoading,
  } = useReferenceData();

  const [classTitle, setClassTitle] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [classDuration, setClassDuration] = useState('60');
  const [overview, setOverview] = useState('');
  const [studentOutcome, setStudentOutcome] = useState('');
  const [selectedSetup, setSelectedSetup] = useState<Record<string, boolean>>({});
  const [selectedWarmups, setSelectedWarmups] = useState<WarmupExercise[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<TeachingTechnique[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<NotionMove[]>([]);
  const [selectedCues, setSelectedCues] = useState<CoachingCue[]>([]);
  const [selectedSafety, setSelectedSafety] = useState<Record<string, boolean>>({});
  const [selectedPlaylists, setSelectedPlaylists] = useState<PlaylistSuggestion[]>([]);
  const [selectedPrep, setSelectedPrep] = useState<Record<string, boolean>>({});
  const [selectedCoolDowns, setSelectedCoolDowns] = useState<CoolDownExercise[]>([]);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [aiSections, setAiSections] = useState<Record<string, string>>({});

  // Move search & filter state
  const [moveSearchQuery, setMoveSearchQuery] = useState('');
  const [moveLevelFilter, setMoveLevelFilter] = useState('all');
  const [moveCategoryFilter, setMoveCategoryFilter] = useState('all');

  const filteredMoves = useMemo(() => {
    return notionMoves.filter((move) => {
      const matchesSearch = moveSearchQuery === '' ||
        move.name.toLowerCase().includes(moveSearchQuery.toLowerCase()) ||
        move.tags?.some(t => t.toLowerCase().includes(moveSearchQuery.toLowerCase()));
      const matchesLevel = moveLevelFilter === 'all' || move.level === moveLevelFilter;
      const matchesCategory = moveCategoryFilter === 'all' || move.category === moveCategoryFilter;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [notionMoves, moveSearchQuery, moveLevelFilter, moveCategoryFilter]);

  const dismissAiSection = (key: string) => {
    setAiSections((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleAutoSave = useCallback(() => {
    // Simulate saving to localStorage
    const classData = {
      classTitle, classLevel, classDuration, overview, studentOutcome,
      selectedSetup, selectedWarmups, selectedTechniques, selectedMoves,
      selectedCues, selectedSafety, selectedPlaylists, selectedPrep, selectedCoolDowns,
    };
    localStorage.setItem('poleDanceClassPlan', JSON.stringify(classData));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  }, [classTitle, classLevel, classDuration, overview, studentOutcome,
    selectedSetup, selectedWarmups, selectedTechniques, selectedMoves,
    selectedCues, selectedSafety, selectedPlaylists, selectedPrep, selectedCoolDowns]);

  // Auto-save every 20 seconds
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      handleAutoSave();
    }, 20000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [handleAutoSave]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('poleDanceClassPlan');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.classTitle) setClassTitle(data.classTitle);
        if (data.classLevel) setClassLevel(data.classLevel);
        if (data.classDuration) setClassDuration(data.classDuration);
        if (data.overview) setOverview(data.overview);
        if (data.studentOutcome) setStudentOutcome(data.studentOutcome);
        if (data.selectedSetup) setSelectedSetup(data.selectedSetup);
        if (data.selectedWarmups) setSelectedWarmups(data.selectedWarmups);
        if (data.selectedTechniques) setSelectedTechniques(data.selectedTechniques);
        if (data.selectedMoves) setSelectedMoves(data.selectedMoves);
        if (data.selectedCues) setSelectedCues(data.selectedCues);
        if (data.selectedSafety) setSelectedSafety(data.selectedSafety);
        if (data.selectedPlaylists) setSelectedPlaylists(data.selectedPlaylists);
        if (data.selectedPrep) setSelectedPrep(data.selectedPrep);
        if (data.selectedCoolDowns) setSelectedCoolDowns(data.selectedCoolDowns);
        if (data.aiGeneratedSections) setAiSections(data.aiGeneratedSections);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const toggleCoolDown = (exercise: CoolDownExercise) => {
    setSelectedCoolDowns((prev) =>
      prev.find((c) => c.id === exercise.id)
        ? prev.filter((c) => c.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const toggleWarmup = (exercise: WarmupExercise) => {
    setSelectedWarmups((prev) =>
      prev.find((w) => w.id === exercise.id)
        ? prev.filter((w) => w.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const toggleTechnique = (technique: TeachingTechnique) => {
    setSelectedTechniques((prev) =>
      prev.find((t) => t.id === technique.id)
        ? prev.filter((t) => t.id !== technique.id)
        : [...prev, technique]
    );
  };

  const toggleMove = (move: NotionMove) => {
    setSelectedMoves((prev) =>
      prev.find((m) => m.id === move.id)
        ? prev.filter((m) => m.id !== move.id)
        : [...prev, move]
    );
  };

  const toggleCue = (cue: CoachingCue) => {
    setSelectedCues((prev) =>
      prev.find((c) => c.id === cue.id)
        ? prev.filter((c) => c.id !== cue.id)
        : [...prev, cue]
    );
  };

  const togglePlaylist = (playlist: PlaylistSuggestion) => {
    setSelectedPlaylists((prev) =>
      prev.find((p) => p.id === playlist.id)
        ? prev.filter((p) => p.id !== playlist.id)
        : [...prev, playlist]
    );
  };

  return (
    <div className="min-h-screen bg-[#151A22]">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-[#F7F4EF]">Class Builder</h1>
            <p className="font-body text-[#B8C0CC] mt-1">
              Create a structured pole fitness class plan
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/templates">
              <Button variant="outline" className="gap-2 font-heading border-[rgba(184,192,204,0.14)] text-[#B8C0CC] hover:text-[#F7F4EF] hover:bg-[#283241]">
                <Layers className="h-4 w-4" />
                Start from Template
              </Button>
            </Link>
            <Link to="/summary">
              <Button variant="outline" className="gap-2 font-heading border-[rgba(184,192,204,0.14)] text-[#B8C0CC] hover:text-[#F7F4EF] hover:bg-[#283241]">
                <FileText className="h-4 w-4" />
                View Summary
              </Button>
            </Link>
            <Button onClick={handleAutoSave} className="gradient-coral-gold text-[#151A22] hover:opacity-90 gap-2 font-heading font-bold">
              <Save className="h-4 w-4" />
              Save Class
            </Button>
          </div>
        </div>

        {/* Class Overview Fields */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Class Title (e.g., Beginner Spins Flow)"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
            className="font-body"
          />
          <Select value={classLevel} onValueChange={setClassLevel}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="mixed">Mixed Levels</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classDuration} onValueChange={setClassDuration}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="75">75 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Class Overview */}
          <ClassSection title="Class Overview" icon={<ClipboardList className="h-5 w-5" />} defaultOpen>
            {aiSections.overview && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Suggestion</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-purple hover:text-purple-dark"
                      onClick={() => {
                        setOverview(aiSections.overview);
                        dismissAiSection('overview');
                      }}
                    >
                      Use this
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-muted-foreground"
                      onClick={() => dismissAiSection('overview')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.overview}</p>
              </div>
            )}
            <Textarea
              placeholder="Describe the overall theme and focus of this class..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="font-body min-h-[100px]"
            />
          </ClassSection>

          {/* Student Outcome */}
          <ClassSection title="Student Outcome" icon={<Target className="h-5 w-5" />}>
            {aiSections.skillBuilding && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Suggestion</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-purple hover:text-purple-dark"
                      onClick={() => {
                        setStudentOutcome(aiSections.skillBuilding);
                        dismissAiSection('skillBuilding');
                      }}
                    >
                      Use this
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-muted-foreground"
                      onClick={() => dismissAiSection('skillBuilding')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.skillBuilding}</p>
              </div>
            )}
            <Textarea
              placeholder="What will students be able to do after this class? (e.g., Students will be able to execute 3 basic spins with proper form...)"
              value={studentOutcome}
              onChange={(e) => setStudentOutcome(e.target.value)}
              className="font-body min-h-[100px]"
            />
          </ClassSection>

          {/* Setup Checklist */}
          <ClassSection title="Setup Checklist" icon={<CheckSquare className="h-5 w-5" />}>
            <div className="grid md:grid-cols-2 gap-1">
              {setupChecklist.map((item) => (
                <ChecklistItem
                  key={item}
                  label={item}
                  checked={selectedSetup[item] || false}
                  onChange={(checked) =>
                    setSelectedSetup((prev) => ({ ...prev, [item]: checked }))
                  }
                />
              ))}
            </div>
          </ClassSection>

          {/* Warmup */}
          <ClassSection title="Warmup" icon={<Flame className="h-5 w-5" />}>
            {aiSections.warmup && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Warmup Suggestion</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('warmup')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.warmup}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-3 font-body">
              Select warmup exercises for your class. Click to add/remove.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {warmupExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => toggleWarmup(exercise)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedWarmups.find((w) => w.id === exercise.id)
                      ? 'border-purple bg-purple/5'
                      : 'border-border hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-medium text-sm">{exercise.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {exercise.duration}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {exercise.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                </div>
              ))}
            </div>
            {selectedWarmups.length > 0 && (
              <div className="mt-4 p-3 bg-lavender rounded-lg">
                <p className="text-sm font-heading font-medium mb-2">
                  Selected ({selectedWarmups.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedWarmups.map((w) => (
                    <Badge key={w.id} className="bg-purple text-white">
                      {w.name} - {w.duration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </ClassSection>

          {/* Teaching Techniques */}
          <ClassSection title="Teaching Techniques" icon={<GraduationCap className="h-5 w-5" />}>
            <div className="space-y-2">
              {teachingTechniques.map((technique) => (
                <div
                  key={technique.id}
                  onClick={() => toggleTechnique(technique)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTechniques.find((t) => t.id === technique.id)
                      ? 'border-purple bg-purple/5'
                      : 'border-border hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-medium">{technique.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {technique.bestFor.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ClassSection>

          {/* Moves to Pull From */}
          <ClassSection title="Moves to Pull From" icon={<Layers className="h-5 w-5" />}>
            {aiSections.combinations && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Combinations & Choreography</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('combinations')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.combinations}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-3 font-body">
              Select moves from the database to include in this class.{' '}
              <Link to="/moves" className="text-purple hover:underline">
                View full database →
              </Link>
            </p>

            {/* Search and Filter Controls */}
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search moves..."
                  value={moveSearchQuery}
                  onChange={(e) => setMoveSearchQuery(e.target.value)}
                  className="pl-9 font-body"
                />
              </div>
              <Select value={moveLevelFilter} onValueChange={setMoveLevelFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Filter by Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={moveCategoryFilter} onValueChange={setMoveCategoryFilter}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {movesLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-purple mr-2" />
                <span className="sr-only">Loading</span>
              </div>
            )}

            {/* Error State */}
            {movesError && (
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-body">
                <p className="font-medium">Failed to load moves</p>
                <p className="mt-1 text-xs">{movesError}</p>
              </div>
            )}

            {/* Moves Grid */}
            {!movesLoading && !movesError && (
              <>
                {filteredMoves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm font-body">
                    {notionMoves.length === 0
                      ? 'No moves found. Make sure your Notion database is synced.'
                      : 'No moves match your current filters.'}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredMoves.map((move) => (
                      <MoveCard
                        key={move.id}
                        move={move}
                        compact
                        selected={!!selectedMoves.find((m) => m.id === move.id)}
                        onSelect={(m) => toggleMove(m as NotionMove)}
                      />
                    ))}
                  </div>
                )}
                {filteredMoves.length > 0 && filteredMoves.length !== notionMoves.length && (
                  <p className="text-xs text-muted-foreground mt-2 font-body">
                    Showing {filteredMoves.length} of {notionMoves.length} moves
                  </p>
                )}
              </>
            )}

            {selectedMoves.length > 0 && (
              <div className="mt-4 p-3 bg-lavender rounded-lg">
                <p className="text-sm font-heading font-medium mb-2">
                  Selected Moves ({selectedMoves.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMoves.map((m) => (
                    <Badge key={m.id} className="bg-purple text-white">
                      {m.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </ClassSection>

          {/* Safety Notes - moved under Moves to Pull From */}
          <ClassSection title="Safety Notes" icon={<AlertTriangle className="h-5 w-5" />}>
            {aiSections.safety && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Safety Notes</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('safety')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.safety}</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-1">
              {safetyNotes.map((note) => (
                <ChecklistItem
                  key={note}
                  label={note}
                  checked={selectedSafety[note] || false}
                  onChange={(checked) =>
                    setSelectedSafety((prev) => ({ ...prev, [note]: checked }))
                  }
                />
              ))}
            </div>
          </ClassSection>

          {/* Coaching Cues */}
          <ClassSection title="Coaching Cues" icon={<MessageCircle className="h-5 w-5" />}>
            <div className="grid md:grid-cols-2 gap-2">
              {coachingCues.map((cue) => (
                <div
                  key={cue.id}
                  onClick={() => toggleCue(cue)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCues.find((c) => c.id === cue.id)
                      ? 'border-purple bg-purple/5'
                      : 'border-border hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {cue.category}
                    </Badge>
                  </div>
                  <p className="text-sm font-body">"{cue.cue}"</p>
                </div>
              ))}
            </div>
          </ClassSection>

          {/* Playlist */}
          <ClassSection title="Playlist" icon={<Music className="h-5 w-5" />}>
            {aiSections.music && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Music Suggestions</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('music')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.music}</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {playlistSuggestions.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => togglePlaylist(playlist)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlaylists.find((p) => p.id === playlist.id)
                      ? 'border-pink bg-pink/5'
                      : 'border-border hover:border-pink/40'
                  }`}
                >
                  <h4 className="font-heading font-medium text-sm">{playlist.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{playlist.mood}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {playlist.bpm} BPM
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {playlist.duration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ClassSection>

          {/* Instructor Prep */}
          <ClassSection title="Instructor Prep" icon={<UserCheck className="h-5 w-5" />}>
            {aiSections.instructorNotes && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Instructor Notes</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('instructorNotes')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.instructorNotes}</p>
              </div>
            )}
            <div className="space-y-1">
              {instructorPrep.map((item) => (
                <ChecklistItem
                  key={item}
                  label={item}
                  checked={selectedPrep[item] || false}
                  onChange={(checked) =>
                    setSelectedPrep((prev) => ({ ...prev, [item]: checked }))
                  }
                />
              ))}
            </div>
          </ClassSection>

          {/* Cool Down */}
          <ClassSection title="Cool Down" icon={<Snowflake className="h-5 w-5" />}>
            {aiSections.coolDown && (
              <div className="mb-3 p-3 bg-purple/5 border border-purple/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple" />
                    <span className="text-xs font-heading font-medium text-purple">AI Cool Down Suggestion</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => dismissAiSection('coolDown')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap font-body">{aiSections.coolDown}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-3 font-body">
              Select cool down exercises (5–10 min). Focus on stretching shoulders, lats, wrists, hip flexors, and glutes.
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {coolDownExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => toggleCoolDown(exercise)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedCoolDowns.find((c) => c.id === exercise.id)
                      ? 'border-purple bg-purple/5'
                      : 'border-border hover:border-purple/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-medium text-sm">{exercise.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {exercise.duration}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {exercise.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                </div>
              ))}
            </div>
            {selectedCoolDowns.length > 0 && (
              <div className="mt-4 p-3 bg-lavender rounded-lg">
                <p className="text-sm font-heading font-medium mb-2">
                  Selected ({selectedCoolDowns.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCoolDowns.map((c) => (
                    <Badge key={c.id} className="bg-purple text-white">
                      {c.name} - {c.duration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </ClassSection>
        </div>
      </div>

      {/* Auto-save Toast Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-2 bg-purple text-white px-4 py-3 rounded-lg shadow-lg">
            <Check className="h-4 w-4" />
            <span className="font-heading text-sm">Class plan auto-saved</span>
          </div>
        </div>
      )}
    </div>
  );
}
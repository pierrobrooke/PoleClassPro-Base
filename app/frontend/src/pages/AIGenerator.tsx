import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { Sparkles, Loader2, Copy, Check, ArrowRight, ArrowLeft, Save, ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import { client } from '@/lib/api';
import { useNotionMoves } from '@/hooks/useNotionMoves';
import { NotionMove } from '@/hooks/useNotionMoves';

interface GeneratorFormData {
  level: string;
  duration: string;
  focus: string;
  numStudents: string;
  equipment: string;
  theme: string;
  additionalNotes: string;
}

const STEPS = [
  { id: 'level', label: 'Class Level', description: 'What level are your students?' },
  { id: 'duration', label: 'Duration', description: 'How long is your class?' },
  { id: 'focus', label: 'Focus Area', description: 'What\'s the main focus of this class?' },
  { id: 'details', label: 'Details', description: 'Any additional details?' },
];

export default function AIGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<GeneratorFormData>({
    level: '',
    duration: '60',
    focus: '',
    numStudents: '',
    equipment: '',
    theme: '',
    additionalNotes: '',
  });
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Notion moves integration
  const { moves, loading: movesLoading } = useNotionMoves();
  const [selectedMoveIds, setSelectedMoveIds] = useState<Set<string>>(new Set());
  const [moveSearchQuery, setMoveSearchQuery] = useState('');
  const [moveSectionExpanded, setMoveSectionExpanded] = useState(false);

  const filteredMoves = useMemo(() => {
    if (!moveSearchQuery.trim()) return moves;
    const query = moveSearchQuery.toLowerCase();
    return moves.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.level?.toLowerCase().includes(query) ||
        m.category?.toLowerCase().includes(query)
    );
  }, [moves, moveSearchQuery]);

  const selectedMoves = useMemo(() => {
    return moves.filter((m) => selectedMoveIds.has(m.id));
  }, [moves, selectedMoveIds]);

  const toggleMoveSelection = (move: NotionMove) => {
    setSelectedMoveIds((prev) => {
      const next = new Set(prev);
      if (next.has(move.id)) {
        next.delete(move.id);
      } else {
        next.add(move.id);
      }
      return next;
    });
  };

  const clearMoveSelection = () => {
    setSelectedMoveIds(new Set());
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setGeneratedPlan('');

    const prompt = buildPrompt(formData);

    try {
      await client.ai.gentxt({
        messages: [
          {
            role: 'system',
            content: `You are an expert pole dance instructor and class planner. You create detailed, safe, and engaging pole fitness class plans. Your plans include warmup, skill progression, combinations, cool down, and safety notes. Format your response in clear sections with bullet points. Be specific about timing, repetitions, and transitions between moves.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'deepseek-v3.2',
        stream: true,
        onChunk: (chunk) => {
          if (chunk.content) {
            setGeneratedPlan((prev) => prev + chunk.content);
          }
        },
        onComplete: () => {
          setIsGenerating(false);
        },
        onError: (err) => {
          setError(err?.message || 'Failed to generate class plan. Please try again.');
          setIsGenerating(false);
        },
        timeout: 60000,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate class plan. Please try again.';
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  const buildPrompt = (data: GeneratorFormData): string => {
    let prompt = `Create a detailed pole dance class plan with the following parameters:\n\n`;
    prompt += `- Level: ${data.level || 'Beginner'}\n`;
    prompt += `- Duration: ${data.duration} minutes\n`;
    prompt += `- Focus Area: ${data.focus || 'General pole fitness'}\n`;

    if (data.numStudents) {
      prompt += `- Number of Students: ${data.numStudents}\n`;
    }
    if (data.equipment) {
      prompt += `- Available Equipment: ${data.equipment}\n`;
    }
    if (data.theme) {
      prompt += `- Class Theme/Vibe: ${data.theme}\n`;
    }
    if (data.additionalNotes) {
      prompt += `- Additional Notes: ${data.additionalNotes}\n`;
    }

    // Include selected Notion moves in the prompt
    if (selectedMoves.length > 0) {
      prompt += `\n**IMPORTANT - Include these specific moves from my repertoire in the class plan:**\n`;
      selectedMoves.forEach((move) => {
        let moveDesc = `- ${move.name}`;
        if (move.level) moveDesc += ` (Level: ${move.level})`;
        if (move.category) moveDesc += ` [${move.category}]`;
        if (move.prerequisites) moveDesc += ` — Prerequisites: ${move.prerequisites}`;
        prompt += moveDesc + '\n';
      });
      prompt += `\nPlease incorporate these moves naturally into the class progression, ensuring proper warmup and prerequisite skills are addressed before attempting them.\n`;
    }

    prompt += `\nPlease structure the class plan with these sections:
1. **Class Overview** - Brief description and goals
2. **Warmup** (8-10 min) - Specific exercises with timing
3. **Skill Building** - Progressive drills leading to the main moves
4. **Main Combinations/Choreography** - Detailed sequences
5. **Cool Down** (5-8 min) - Stretches and recovery
6. **Safety Reminders** - Key safety points for this class
7. **Music Suggestions** - Mood/tempo recommendations for each section
8. **Instructor Notes** - Tips for teaching this class effectively`;

    return prompt;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseGeneratedPlan = (plan: string) => {
    const sections: Record<string, string> = {};
    const sectionPatterns = [
      { key: 'overview', patterns: ['class overview', 'overview', 'description', 'goals'] },
      { key: 'warmup', patterns: ['warmup', 'warm-up', 'warm up'] },
      { key: 'skillBuilding', patterns: ['skill building', 'skill progression', 'drills', 'technique'] },
      { key: 'combinations', patterns: ['combination', 'choreography', 'main combo', 'sequences'] },
      { key: 'coolDown', patterns: ['cool down', 'cool-down', 'cooldown', 'stretches', 'recovery'] },
      { key: 'safety', patterns: ['safety', 'safety reminders', 'safety notes'] },
      { key: 'music', patterns: ['music', 'playlist', 'music suggestions'] },
      { key: 'instructorNotes', patterns: ['instructor notes', 'instructor tips', 'teaching tips'] },
    ];

    const lines = plan.split('\n');
    let currentSection = 'overview';

    for (const line of lines) {
      const lowerLine = line.toLowerCase().replace(/[*#\-_]/g, '').trim();

      let matched = false;
      for (const section of sectionPatterns) {
        if (section.patterns.some((p) => lowerLine.startsWith(p) || lowerLine.includes(p))) {
          if (lowerLine.length < 60) {
            currentSection = section.key;
            matched = true;
            break;
          }
        }
      }

      if (!matched && line.trim()) {
        sections[currentSection] = (sections[currentSection] || '') + line + '\n';
      }
    }

    return sections;
  };

  const handleSaveToBuilder = () => {
    const parsed = parseGeneratedPlan(generatedPlan);

    // Map level string to match Dashboard's expected values
    const levelMap: Record<string, string> = {
      'beginner': 'beginner',
      'beginner-intermediate': 'intermediate',
      'intermediate': 'intermediate',
      'intermediate-advanced': 'advanced',
      'advanced': 'advanced',
      'mixed': 'mixed',
    };

    const classData = {
      classTitle: `AI Generated: ${formData.focus || 'Pole Class'}`,
      classLevel: levelMap[formData.level] || 'beginner',
      classDuration: formData.duration,
      overview: parsed.overview?.trim() || generatedPlan.substring(0, 500),
      studentOutcome: parsed.skillBuilding?.trim() || '',
      // Store parsed sections as AI-generated content for the builder to display
      aiGeneratedSections: {
        warmup: parsed.warmup?.trim() || '',
        skillBuilding: parsed.skillBuilding?.trim() || '',
        combinations: parsed.combinations?.trim() || '',
        coolDown: parsed.coolDown?.trim() || '',
        safety: parsed.safety?.trim() || '',
        music: parsed.music?.trim() || '',
        instructorNotes: parsed.instructorNotes?.trim() || '',
      },
      // Store the full plan for reference
      fullAIPlan: generatedPlan,
    };
    localStorage.setItem('poleDanceClassPlan', JSON.stringify(classData));
    window.location.href = '/dashboard';
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.level;
      case 1:
        return !!formData.duration;
      case 2:
        return !!formData.focus;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getLevelColor = (level: string): string => {
    const l = level?.toLowerCase() || '';
    if (l.includes('beginner')) return 'bg-green-100 text-green-700';
    if (l.includes('intermediate')) return 'bg-yellow-100 text-yellow-700';
    if (l.includes('advanced')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const renderMovesSection = () => {
    return (
      <div className="mt-4 border border-border rounded-lg overflow-hidden">
        {/* Collapsible Header */}
        <button
          type="button"
          onClick={() => setMoveSectionExpanded(!moveSectionExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple" />
            <span className="font-heading font-medium text-sm">Include Specific Moves</span>
            {selectedMoveIds.size > 0 && (
              <Badge className="bg-purple text-white text-xs">{selectedMoveIds.size} selected</Badge>
            )}
          </div>
          {moveSectionExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Expanded Content */}
        {moveSectionExpanded && (
          <div className="p-4 border-t border-border space-y-3">
            {movesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 text-purple animate-spin mr-2" />
                <span className="sr-only">Loading</span>
              </div>
            ) : moves.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body text-center py-4">
                No moves found. Connect your Notion database to browse moves.
              </p>
            ) : (
              <>
                {/* Search & Clear */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search moves by name, level, or category..."
                      value={moveSearchQuery}
                      onChange={(e) => setMoveSearchQuery(e.target.value)}
                      className="pl-9 font-body h-9 text-sm"
                    />
                  </div>
                  {selectedMoveIds.size > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearMoveSelection}
                      className="text-xs text-muted-foreground hover:text-foreground gap-1 shrink-0"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Selected Moves Preview */}
                {selectedMoves.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMoves.map((move) => (
                      <Badge
                        key={move.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 gap-1 text-xs"
                        onClick={() => toggleMoveSelection(move)}
                      >
                        {move.name}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Scrollable Move List */}
                <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border">
                  {filteredMoves.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 font-body">
                      No moves match your search.
                    </p>
                  ) : (
                    filteredMoves.map((move) => {
                      const isSelected = selectedMoveIds.has(move.id);
                      return (
                        <div
                          key={move.id}
                          onClick={() => toggleMoveSelection(move)}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple/5' : 'hover:bg-muted/30'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'border-purple bg-purple' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="font-body text-sm flex-1 truncate">{move.name}</span>
                          {move.level && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${getLevelColor(move.level)}`}>
                              {move.level}
                            </span>
                          )}
                          {move.category && (
                            <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
                              {move.category}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <p className="text-xs text-muted-foreground font-body">
                  {filteredMoves.length} move{filteredMoves.length !== 1 ? 's' : ''} available
                  {selectedMoveIds.size > 0 && ` · ${selectedMoveIds.size} selected`}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
              <SelectTrigger className="font-body text-lg h-12">
                <SelectValue placeholder="Select student level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to pole</SelectItem>
                <SelectItem value="beginner-intermediate">Beginner-Intermediate - Basic spins mastered</SelectItem>
                <SelectItem value="intermediate">Intermediate - Inverts & climbs</SelectItem>
                <SelectItem value="intermediate-advanced">Intermediate-Advanced - Aerial combos</SelectItem>
                <SelectItem value="advanced">Advanced - Complex tricks & transitions</SelectItem>
                <SelectItem value="mixed">Mixed Levels - Multi-level class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <Select value={formData.duration} onValueChange={(val) => setFormData({ ...formData, duration: val })}>
              <SelectTrigger className="font-body text-lg h-12">
                <SelectValue placeholder="Select class duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes - Express class</SelectItem>
                <SelectItem value="45">45 minutes - Short class</SelectItem>
                <SelectItem value="60">60 minutes - Standard class</SelectItem>
                <SelectItem value="75">75 minutes - Extended class</SelectItem>
                <SelectItem value="90">90 minutes - Workshop style</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Spins & Transitions',
                'Strength & Conditioning',
                'Flexibility & Flow',
                'Tricks & Inversions',
                'Choreography & Dance',
                'Floorwork',
                'Climbing & Holds',
                'Exotic/Sensual Style',
                'Competition Prep',
              ].map((focus) => (
                <div
                  key={focus}
                  onClick={() => setFormData({ ...formData, focus })}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                    formData.focus === focus
                      ? 'border-purple bg-purple/10 text-purple font-medium'
                      : 'border-border hover:border-purple/40 text-foreground'
                  }`}
                >
                  <span className="text-sm font-heading">{focus}</span>
                </div>
              ))}
            </div>
            <Input
              placeholder="Or type a custom focus..."
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              className="font-body h-12"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Number of students (e.g., 6-8)"
              value={formData.numStudents}
              onChange={(e) => setFormData({ ...formData, numStudents: e.target.value })}
              className="font-body"
            />
            <Input
              placeholder="Available equipment (e.g., static poles, spinning poles, mats, resistance bands)"
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="font-body"
            />
            <Input
              placeholder="Class theme/vibe (e.g., empowering, playful, sultry, athletic)"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="font-body"
            />
            <Textarea
              placeholder="Any additional notes? (injuries to accommodate, specific moves to include/avoid, special occasion, etc.)"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="font-body min-h-[100px]"
            />
            {/* Notion Moves Selection Section */}
            {renderMovesSection()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple/10 to-pink/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-purple" />
            <span className="font-heading font-medium text-purple">AI-Powered</span>
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground">AI Class Generator</h1>
          <p className="font-body text-muted-foreground mt-2">
            Answer a few questions and let AI create a complete class plan for you
          </p>
        </div>

        {/* Show form or result */}
        {!generatedPlan && !isGenerating ? (
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all ${
                      idx === currentStep
                        ? 'bg-purple text-white'
                        : idx < currentStep
                        ? 'bg-purple/20 text-purple'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-8 md:w-12 h-0.5 mx-1 ${
                        idx < currentStep ? 'bg-purple/40' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="mb-8">
              <h2 className="font-heading font-bold text-xl mb-1">{STEPS[currentStep].label}</h2>
              <p className="font-body text-muted-foreground mb-6">{STEPS[currentStep].description}</p>
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 font-heading"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-purple text-white hover:bg-purple-light gap-2 font-heading"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-purple to-pink text-white hover:opacity-90 gap-2 font-heading"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Class Plan
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
            {/* Generation Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-pink flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg">Generated Class Plan</h2>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline">{formData.level}</Badge>
                    <Badge variant="outline">{formData.duration} min</Badge>
                    <Badge variant="outline">{formData.focus}</Badge>
                    {selectedMoves.length > 0 && (
                      <Badge variant="outline" className="text-purple border-purple/40">
                        {selectedMoves.length} move{selectedMoves.length !== 1 ? 's' : ''} included
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {!isGenerating && generatedPlan && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 font-heading">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveToBuilder}
                    className="bg-purple text-white hover:bg-purple-light gap-2 font-heading"
                  >
                    <Save className="h-4 w-4" />
                    Add to Class Builder
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isGenerating && !generatedPlan && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-purple animate-spin mb-4" />
                <p className="font-heading text-muted-foreground">Generating your class plan...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-body text-sm">{error}</p>
              </div>
            )}

            {/* Generated Content */}
            {generatedPlan && (
              <div className="prose prose-sm max-w-none font-body">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {generatedPlan}
                </div>
              </div>
            )}

            {/* Streaming indicator */}
            {isGenerating && generatedPlan && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Loader2 className="h-4 w-4 text-purple animate-spin" />
                <span className="text-sm text-muted-foreground font-body">Still generating...</span>
              </div>
            )}

            {/* Actions after generation */}
            {!isGenerating && generatedPlan && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedPlan('');
                    setCurrentStep(0);
                  }}
                  className="gap-2 font-heading"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-purple to-pink text-white hover:opacity-90 gap-2 font-heading"
                >
                  <Sparkles className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
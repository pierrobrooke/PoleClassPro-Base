import type {
  WarmupExercise,
  TeachingTechnique,
  CoachingCue,
  PlaylistSuggestion,
  CoolDownExercise,
} from '@/hooks/useReferenceData';

export interface TemplateMoveRef {
  name: string;
  level?: string;
}

export interface ClassTemplate {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  duration: string;
  focus: string[];
  overview: string;
  studentOutcome: string;
  setupChecklist: string[];
  warmups: WarmupExercise[];
  techniques: TeachingTechnique[];
  moves: TemplateMoveRef[];
  cues: CoachingCue[];
  safetyNotes: string[];
  playlists: PlaylistSuggestion[];
  instructorPrep: string[];
  coolDowns: CoolDownExercise[];
}

interface ReferenceDataInput {
  warmupExercises: WarmupExercise[];
  teachingTechniques: TeachingTechnique[];
  coachingCues: CoachingCue[];
  playlistSuggestions: PlaylistSuggestion[];
  coolDownExercises: CoolDownExercise[];
  safetyNotes: string[];
  setupChecklist: string[];
  instructorPrep: string[];
}

export function buildClassTemplates(data: ReferenceDataInput): ClassTemplate[] {
  const {
    warmupExercises,
    teachingTechniques,
    coachingCues,
    playlistSuggestions,
    coolDownExercises,
    safetyNotes,
    setupChecklist,
    instructorPrep,
  } = data;

  // Helper to find items by ID
  const findWarmups = (ids: string[]) => warmupExercises.filter((w) => ids.includes(w.id));
  const findTechniques = (ids: string[]) => teachingTechniques.filter((t) => ids.includes(t.id));
  const findCues = (ids: string[]) => coachingCues.filter((c) => ids.includes(c.id));
  const findPlaylists = (ids: string[]) => playlistSuggestions.filter((p) => ids.includes(p.id));
  const findCoolDowns = (ids: string[]) => coolDownExercises.filter((c) => ids.includes(c.id));

  return [
    {
      id: 'template-beginner-flow',
      name: 'Beginner Flow',
      description:
        'A gentle introduction to pole fitness focusing on basic spins, floor work, and building confidence. Perfect for first-timers or those in their first few months.',
      level: 'beginner',
      duration: '60',
      focus: ['Spins', 'Floor Work', 'Confidence Building'],
      overview:
        'This class introduces students to foundational pole spins and floor work. The focus is on building grip strength, body awareness, and confidence on the pole. Students will learn 2-3 basic spins and a short floor work sequence they can practice at home.',
      studentOutcome:
        'Students will be able to execute a fireman spin and chair spin with proper hand placement and controlled descent. They will also learn a 4-count body wave on the floor.',
      setupChecklist: setupChecklist.slice(0, 8),
      warmups: findWarmups(['wu-1', 'wu-3', 'wu-4', 'wu-5', 'wu-7', 'wu-8']),
      techniques: findTechniques(['tt-1', 'tt-2', 'tt-7']),
      moves: [
        { name: 'Fireman Spin', level: 'Beginner' },
        { name: 'Chair Spin', level: 'Beginner' },
        { name: 'Body Wave Floor Work', level: 'Beginner' },
        { name: 'Fan Kick', level: 'Beginner' },
      ],
      cues: findCues(['cc-1', 'cc-2', 'cc-4', 'cc-7']),
      safetyNotes: safetyNotes.slice(0, 6),
      playlists: findPlaylists(['pl-1', 'pl-5', 'pl-4']),
      instructorPrep: instructorPrep.slice(0, 6),
      coolDowns: findCoolDowns(['cd-7', 'cd-8', 'cd-11', 'cd-12', 'cd-13', 'cd-16']),
    },
    {
      id: 'template-advanced-tricks',
      name: 'Advanced Tricks',
      description:
        'A challenging class for experienced students ready to tackle inversions, shoulder mounts, and advanced static holds. Requires strong upper body and grip.',
      level: 'advanced',
      duration: '75',
      focus: ['Inversions', 'Strength', 'Advanced Holds'],
      overview:
        'This advanced class focuses on building the strength and technique needed for shoulder mounts and advanced inverted holds. Students will work on conditioning drills, progressive skill-building, and safe spotting techniques for high-level moves.',
      studentOutcome:
        'Students will progress toward a controlled shoulder mount entry and hold a jade split for 3+ seconds. They will understand proper muscle engagement and self-spotting techniques.',
      setupChecklist: setupChecklist,
      warmups: findWarmups(['wu-1', 'wu-2', 'wu-3', 'wu-5', 'wu-6', 'wu-9', 'wu-10']),
      techniques: findTechniques(['tt-2', 'tt-3', 'tt-4', 'tt-6']),
      moves: [
        { name: 'Crucifix', level: 'Intermediate' },
        { name: 'Gemini', level: 'Intermediate' },
        { name: 'Shoulder Mount', level: 'Advanced' },
        { name: 'Jade Split', level: 'Advanced' },
        { name: 'Iron X', level: 'Expert' },
      ],
      cues: findCues(['cc-1', 'cc-2', 'cc-3', 'cc-5', 'cc-6']),
      safetyNotes: safetyNotes,
      playlists: findPlaylists(['pl-1', 'pl-3', 'pl-4']),
      instructorPrep: instructorPrep,
      coolDowns: findCoolDowns(['cd-1', 'cd-3', 'cd-5', 'cd-9', 'cd-14', 'cd-15', 'cd-16']),
    },
    {
      id: 'template-flexibility-focus',
      name: 'Flexibility Focus',
      description:
        'A class dedicated to improving flexibility for pole through active and passive stretching, with pole-assisted stretches and graceful movement sequences.',
      level: 'mixed',
      duration: '60',
      focus: ['Flexibility', 'Stretching', 'Grace'],
      overview:
        'This flexibility-focused class uses the pole as a stretching tool to deepen splits, backbends, and shoulder mobility. Suitable for all levels with modifications offered. The class combines active flexibility drills with passive holds and ends with a relaxing cool-down flow.',
      studentOutcome:
        'Students will improve their active flexibility in hip flexors and hamstrings by 10-15%. They will learn 3 pole-assisted stretches they can incorporate into their home practice.',
      setupChecklist: [...setupChecklist.slice(0, 7), 'Yoga blocks and straps available'],
      warmups: findWarmups(['wu-1', 'wu-2', 'wu-4', 'wu-7', 'wu-8']),
      techniques: findTechniques(['tt-1', 'tt-7', 'tt-5']),
      moves: [
        { name: 'Butterfly', level: 'Intermediate' },
        { name: 'Jade Split', level: 'Advanced' },
        { name: 'Body Wave Floor Work', level: 'Beginner' },
      ],
      cues: findCues(['cc-2', 'cc-4', 'cc-5', 'cc-7']),
      safetyNotes: [
        'Never force a stretch beyond comfort',
        'Ensure students are fully warmed up before deep stretches',
        'Offer modifications for all flexibility levels',
        'Watch for hyperextension in joints',
        'Remind students to breathe through stretches',
        'Use props (blocks, straps) for support',
      ],
      playlists: findPlaylists(['pl-2', 'pl-4', 'pl-6']),
      instructorPrep: [
        'Review class plan and timing',
        'Warm up your own body',
        'Prepare modifications for different levels',
        'Set up music playlist in order',
        'Lay out yoga blocks and straps',
        'Set intention for the class',
      ],
      coolDowns: findCoolDowns(['cd-1', 'cd-3', 'cd-4', 'cd-6', 'cd-9', 'cd-14', 'cd-16']),
    },
    {
      id: 'template-spin-combos',
      name: 'Spin Combos',
      description:
        'An energetic class focused on linking spins into flowing combinations. Great for intermediate students who have mastered individual spins and want to connect them.',
      level: 'intermediate',
      duration: '60',
      focus: ['Spins', 'Transitions', 'Flow'],
      overview:
        'This class takes students beyond individual spins into the art of combining them into seamless sequences. Students will learn transition techniques, momentum management, and how to create their own mini-combos. The class builds toward a 3-spin combination performed to music.',
      studentOutcome:
        'Students will be able to link 3 spins together with smooth transitions, maintaining control and proper form throughout. They will understand how to manage momentum between spins.',
      setupChecklist: setupChecklist.slice(0, 9),
      warmups: findWarmups(['wu-1', 'wu-3', 'wu-4', 'wu-5', 'wu-7', 'wu-10']),
      techniques: findTechniques(['tt-1', 'tt-4', 'tt-5', 'tt-2']),
      moves: [
        { name: 'Fireman Spin', level: 'Beginner' },
        { name: 'Chair Spin', level: 'Beginner' },
        { name: 'Back Hook Spin', level: 'Beginner' },
        { name: 'Fan Kick', level: 'Beginner' },
      ],
      cues: findCues(['cc-1', 'cc-2', 'cc-4', 'cc-8']),
      safetyNotes: safetyNotes.slice(0, 7),
      playlists: findPlaylists(['pl-1', 'pl-5', 'pl-2']),
      instructorPrep: instructorPrep.slice(0, 7),
      coolDowns: findCoolDowns(['cd-7', 'cd-8', 'cd-10', 'cd-11', 'cd-12', 'cd-13', 'cd-16']),
    },
    {
      id: 'template-strength-conditioning',
      name: 'Strength & Conditioning',
      description:
        'A conditioning-heavy class that builds the strength needed for pole through drills, holds, and progressive overload exercises on and off the pole.',
      level: 'mixed',
      duration: '60',
      focus: ['Strength', 'Conditioning', 'Endurance'],
      overview:
        'This strength-focused class combines pole-specific conditioning with bodyweight exercises to build the muscle groups essential for pole progress. Includes timed holds, climb drills, and grip endurance work. All exercises have beginner and advanced modifications.',
      studentOutcome:
        'Students will complete a full conditioning circuit including 3 climb attempts, 30-second holds, and grip endurance drills. They will understand which muscle groups to target for their pole goals.',
      setupChecklist: setupChecklist,
      warmups: findWarmups(['wu-1', 'wu-5', 'wu-6', 'wu-8', 'wu-9', 'wu-10']),
      techniques: findTechniques(['tt-4', 'tt-7', 'tt-3']),
      moves: [
        { name: 'Climb', level: 'Beginner' },
        { name: 'Crucifix', level: 'Intermediate' },
        { name: 'Fireman Spin', level: 'Beginner' },
        { name: 'Gemini', level: 'Intermediate' },
      ],
      cues: findCues(['cc-1', 'cc-2', 'cc-3', 'cc-5', 'cc-7']),
      safetyNotes: [
        ...safetyNotes.slice(0, 5),
        'Monitor students for fatigue-related form breakdown',
        'Encourage rest between sets',
        'Provide easier modifications when needed',
      ],
      playlists: findPlaylists(['pl-1', 'pl-3', 'pl-5']),
      instructorPrep: instructorPrep,
      coolDowns: findCoolDowns(['cd-1', 'cd-3', 'cd-5', 'cd-9', 'cd-14', 'cd-15', 'cd-16']),
    },
    {
      id: 'template-exotic-floorwork',
      name: 'Exotic Floor Work',
      description:
        'A sensual and expressive class focused on fluid floor transitions, body waves, and low-flow choreography. Emphasis on musicality and personal expression.',
      level: 'beginner',
      duration: '60',
      focus: ['Floor Work', 'Expression', 'Musicality'],
      overview:
        'This class explores the art of floor work and low-flow movement. Students will learn body waves, hip circles, transitions between standing and floor, and how to move expressively with music. No pole experience required — just willingness to move and have fun!',
      studentOutcome:
        'Students will learn a 16-count floor work sequence combining body waves, hip rolls, and a graceful floor-to-standing transition. They will develop confidence in expressive movement.',
      setupChecklist: [...setupChecklist.slice(0, 8), 'Knee pads available for students'],
      warmups: findWarmups(['wu-1', 'wu-2', 'wu-4', 'wu-7', 'wu-8']),
      techniques: findTechniques(['tt-1', 'tt-5', 'tt-4']),
      moves: [
        { name: 'Body Wave Floor Work', level: 'Beginner' },
        { name: 'Fan Kick', level: 'Beginner' },
      ],
      cues: findCues(['cc-2', 'cc-4', 'cc-5', 'cc-8']),
      safetyNotes: [
        'Provide knee pads for floor work',
        'Ensure floor is clean and free of debris',
        'Warm up wrists thoroughly for weight-bearing',
        'Offer modifications for knee sensitivities',
        'Encourage students to move at their own pace',
      ],
      playlists: findPlaylists(['pl-2', 'pl-6', 'pl-4']),
      instructorPrep: [
        'Review class plan and timing',
        'Warm up your own body',
        'Practice the choreography sequence',
        'Set up music playlist in order',
        'Distribute knee pads',
        'Set intention for the class',
      ],
      coolDowns: findCoolDowns(['cd-7', 'cd-8', 'cd-10', 'cd-14', 'cd-16']),
    },
  ];
}
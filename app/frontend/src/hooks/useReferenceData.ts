import { useState, useEffect } from 'react';
import {
  fetchWarmupExercises,
  fetchTeachingTechniques,
  fetchCoachingCues,
  fetchPlaylistSuggestions,
  fetchCoolDownExercises,
  fetchSafetyNotes,
  fetchSetupChecklist,
  fetchInstructorPrep,
  WarmupExercise,
  TeachingTechnique,
  CoachingCue,
  PlaylistSuggestion,
  CoolDownExercise,
  SafetyNote,
  SetupChecklistItem,
  InstructorPrepItem,
} from '@/lib/referenceDataApi';

export type {
  WarmupExercise,
  TeachingTechnique,
  CoachingCue,
  PlaylistSuggestion,
  CoolDownExercise,
  SafetyNote,
  SetupChecklistItem,
  InstructorPrepItem,
};

interface ReferenceData {
  warmupExercises: WarmupExercise[];
  teachingTechniques: TeachingTechnique[];
  coachingCues: CoachingCue[];
  playlistSuggestions: PlaylistSuggestion[];
  coolDownExercises: CoolDownExercise[];
  safetyNotes: string[];
  setupChecklist: string[];
  instructorPrep: string[];
}

interface UseReferenceDataReturn extends ReferenceData {
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// --- Cache ---
const CACHE_KEY = 'poleclass_reference_data_cache';
const CACHE_TS_KEY = 'poleclass_reference_data_cache_ts';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

let memoryCache: ReferenceData | null = null;
let fetchPromise: Promise<ReferenceData> | null = null;

function readLocalCache(): ReferenceData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocalCache(data: ReferenceData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
  } catch {
    // Storage full — ignore
  }
}

function isCacheStale(): boolean {
  const ts = localStorage.getItem(CACHE_TS_KEY);
  if (!ts) return true;
  return Date.now() - parseInt(ts, 10) > CACHE_TTL_MS;
}

async function fetchAllReferenceData(): Promise<ReferenceData> {
  const [
    warmupExercises,
    teachingTechniques,
    coachingCues,
    playlistSuggestions,
    coolDownExercises,
    safetyNotesRaw,
    setupChecklistRaw,
    instructorPrepRaw,
  ] = await Promise.all([
    fetchWarmupExercises(),
    fetchTeachingTechniques(),
    fetchCoachingCues(),
    fetchPlaylistSuggestions(),
    fetchCoolDownExercises(),
    fetchSafetyNotes(),
    fetchSetupChecklist(),
    fetchInstructorPrep(),
  ]);

  const data: ReferenceData = {
    warmupExercises,
    teachingTechniques,
    coachingCues,
    playlistSuggestions,
    coolDownExercises,
    safetyNotes: safetyNotesRaw.map((s) => s.note),
    setupChecklist: setupChecklistRaw.map((s) => s.item),
    instructorPrep: instructorPrepRaw.map((s) => s.item),
  };

  memoryCache = data;
  writeLocalCache(data);
  return data;
}

const emptyData: ReferenceData = {
  warmupExercises: [],
  teachingTechniques: [],
  coachingCues: [],
  playlistSuggestions: [],
  coolDownExercises: [],
  safetyNotes: [],
  setupChecklist: [],
  instructorPrep: [],
};

export function useReferenceData(): UseReferenceDataReturn {
  const initialData = memoryCache || readLocalCache();
  const [data, setData] = useState<ReferenceData>(initialData || emptyData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      memoryCache = initialData;

      if (isCacheStale()) {
        fetchAllReferenceData()
          .then((fresh) => setData(fresh))
          .catch(() => { /* silently fail — cached data is showing */ });
      }
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetchAllReferenceData();
    }

    fetchPromise
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load reference data');
        setLoading(false);
        fetchPromise = null;
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLoading(true);
    setError(null);
    fetchPromise = fetchAllReferenceData();
    fetchPromise
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load reference data');
        setLoading(false);
        fetchPromise = null;
      });
  };

  return { ...data, loading, error, refresh };
}
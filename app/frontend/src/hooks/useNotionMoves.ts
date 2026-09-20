import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchMoves, PoleMove } from '@/lib/movesApi';

/**
 * Legacy interface kept for backward compatibility with existing components.
 * Maps PoleMove fields to the shape components expect.
 */
export interface NotionMove {
  id: string;
  name: string;
  level: string;
  category: string;
  pole_type: string;
  body_position: string;
  grip_type: string;
  muscle_groups: string[];
  prerequisites: string;
  tags: string[];
  is_combo_starter: boolean;
  notes_teaching_tips: string;
  instagram_link: string;
  instagram_search: string;
  video_reference: string;
  taught_yet: boolean;
  // New Supabase fields
  teaching_cues: string;
  common_mistakes: string;
  safety_note: string;
  exit_moves: string[];
  curriculum_week: number | null;
}

/**
 * Map a Supabase PoleMove row to the NotionMove shape used by existing components.
 */
function mapToNotionMove(pm: PoleMove): NotionMove {
  return {
    id: pm.id,
    name: pm.move_name,
    level: pm.level || '',
    category: Array.isArray(pm.category) ? pm.category.join(', ') : '',
    pole_type: Array.isArray(pm.pole_type) ? pm.pole_type.join(', ') : '',
    body_position: pm.body_position || '',
    grip_type: Array.isArray(pm.grip_type) ? pm.grip_type.join(', ') : '',
    muscle_groups: Array.isArray(pm.muscle_groups) ? pm.muscle_groups : [],
    prerequisites: pm.prerequisites || '',
    tags: Array.isArray(pm.tags) ? pm.tags : [],
    is_combo_starter: pm.is_combo_starter || false,
    notes_teaching_tips: pm.teaching_cues || '',
    instagram_link: '',
    instagram_search: '',
    video_reference: pm.video_url || '',
    taught_yet: false,
    // New fields
    teaching_cues: pm.teaching_cues || '',
    common_mistakes: pm.common_mistakes || '',
    safety_note: pm.safety_note || '',
    exit_moves: Array.isArray(pm.exit_moves) ? pm.exit_moves : [],
    curriculum_week: pm.curriculum_week,
  };
}

interface UseNotionMovesReturn {
  moves: NotionMove[];
  loading: boolean;
  error: string | null;
  levels: string[];
  categories: string[];
  poleTypes: string[];
  refresh: () => void;
}

// --- Cache Configuration ---
const CACHE_KEY = 'poleclass_moves_cache';
const CACHE_TIMESTAMP_KEY = 'poleclass_moves_cache_ts';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — background refresh after this

// --- In-memory cache (shared across hook instances within same session) ---
let memoryCache: NotionMove[] | null = null;
let fetchPromise: Promise<NotionMove[]> | null = null;

/**
 * Read cached moves from localStorage.
 * Returns null if cache is missing or corrupted.
 */
function readLocalCache(): NotionMove[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * Write moves to localStorage with a timestamp.
 */
function writeLocalCache(moves: NotionMove[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(moves));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/**
 * Check if the local cache is stale (older than CACHE_TTL_MS).
 */
function isCacheStale(): boolean {
  const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!ts) return true;
  return Date.now() - parseInt(ts, 10) > CACHE_TTL_MS;
}

/**
 * Fetch moves from Supabase and update both memory and local caches.
 */
async function fetchAndCache(): Promise<NotionMove[]> {
  const poleMoves = await fetchMoves();
  const mapped = poleMoves.map(mapToNotionMove);
  memoryCache = mapped;
  writeLocalCache(mapped);
  return mapped;
}

export function useNotionMoves(): UseNotionMovesReturn {
  // Initialize from memory cache or localStorage
  const initialMoves = memoryCache || readLocalCache();
  const [moves, setMoves] = useState<NotionMove[]>(initialMoves || []);
  const [loading, setLoading] = useState(!initialMoves);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have cached data, show it immediately
    if (initialMoves && initialMoves.length > 0) {
      setMoves(initialMoves);
      setLoading(false);
      memoryCache = initialMoves;

      // Background refresh if cache is stale
      if (isCacheStale()) {
        fetchAndCache()
          .then((fresh) => setMoves(fresh))
          .catch(() => {
            // Silently fail — we already have cached data showing
          });
      }
      return;
    }

    // No cache — fetch fresh data
    if (!fetchPromise) {
      fetchPromise = fetchAndCache();
    }

    fetchPromise
      .then((data) => {
        setMoves(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load moves');
        setLoading(false);
        fetchPromise = null;
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPromise = fetchAndCache();
    fetchPromise
      .then((data) => {
        setMoves(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load moves');
        setLoading(false);
        fetchPromise = null;
      });
  }, []);

  const levels = useMemo(() => {
    const set = new Set<string>();
    moves.forEach((m) => { if (m.level) set.add(m.level); });
    return Array.from(set).sort();
  }, [moves]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    moves.forEach((m) => {
      if (m.category) {
        // category may be comma-separated from array join
        m.category.split(', ').forEach((c) => { if (c) set.add(c); });
      }
    });
    return Array.from(set).sort();
  }, [moves]);

  const poleTypes = useMemo(() => {
    const set = new Set<string>();
    moves.forEach((m) => {
      if (m.pole_type) {
        m.pole_type.split(', ').forEach((p) => { if (p) set.add(p); });
      }
    });
    return Array.from(set).sort();
  }, [moves]);

  return { moves, loading, error, levels, categories, poleTypes, refresh };
}
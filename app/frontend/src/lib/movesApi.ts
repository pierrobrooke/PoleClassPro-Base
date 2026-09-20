import { supabase } from './supabaseClient';

/**
 * Represents a pole move from the public.pole_moves table in Supabase.
 * Array columns are Postgres text[] arrays.
 */
export interface PoleMove {
  id: string;
  move_name: string;
  level: string;
  category: string[];
  body_position: string;
  grip_type: string[];
  muscle_groups: string[];
  pole_type: string[];
  tags: string[];
  is_combo_starter: boolean;
  curriculum_week: number | null;
  prerequisites: string;
  teaching_cues: string;
  common_mistakes: string;
  safety_note: string;
  exit_moves: string[];
  video_url: string;
  footwear: string;
  skin_contact_required: string;
  skin_contact_body_part: string[];
}

/**
 * Fetch all moves from the public.pole_moves table via Supabase anon client.
 * Read-only access via RLS policies — no auth needed.
 */
export async function fetchMoves(): Promise<PoleMove[]> {
  const { data, error } = await supabase
    .from('pole_moves')
    .select('*')
    .order('move_name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch moves from Supabase: ${error.message}`);
  }

  return (data || []) as PoleMove[];
}
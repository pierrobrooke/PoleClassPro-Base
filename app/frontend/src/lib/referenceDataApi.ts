import { supabase } from './supabaseClient';

// --- Types matching the Supabase tables ---

export interface WarmupExercise {
  id: string;
  name: string;
  duration: string;
  category: 'Cardio' | 'Stretch' | 'Strength' | 'Mobility';
  description: string;
}

export interface TeachingTechnique {
  id: string;
  name: string;
  description: string;
  best_for: string[];
}

export interface CoachingCue {
  id: string;
  category: string;
  cue: string;
  move_related: string[];
}

export interface PlaylistSuggestion {
  id: string;
  name: string;
  mood: string;
  bpm: string;
  duration: string;
}

export interface CoolDownExercise {
  id: string;
  name: string;
  duration: string;
  category: 'On Pole' | 'Floor' | 'Standing';
  description: string;
}

export interface SafetyNote {
  id: string;
  note: string;
  sort_order: number;
}

export interface SetupChecklistItem {
  id: string;
  item: string;
  sort_order: number;
}

export interface InstructorPrepItem {
  id: string;
  item: string;
  sort_order: number;
}

// --- Fetch functions ---

export async function fetchWarmupExercises(): Promise<WarmupExercise[]> {
  const { data, error } = await supabase
    .from('warmup_exercises')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchTeachingTechniques(): Promise<TeachingTechnique[]> {
  const { data, error } = await supabase
    .from('teaching_techniques')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchCoachingCues(): Promise<CoachingCue[]> {
  const { data, error } = await supabase
    .from('coaching_cues')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchPlaylistSuggestions(): Promise<PlaylistSuggestion[]> {
  const { data, error } = await supabase
    .from('playlist_suggestions')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchCoolDownExercises(): Promise<CoolDownExercise[]> {
  const { data, error } = await supabase
    .from('cool_down_exercises')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchSafetyNotes(): Promise<SafetyNote[]> {
  const { data, error } = await supabase
    .from('safety_notes')
    .select('*')
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchSetupChecklist(): Promise<SetupChecklistItem[]> {
  const { data, error } = await supabase
    .from('setup_checklist')
    .select('*')
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchInstructorPrep(): Promise<InstructorPrepItem[]> {
  const { data, error } = await supabase
    .from('instructor_prep')
    .select('*')
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data || [];
}
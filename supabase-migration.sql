-- ============================================================
-- PoleClass Pro: Reference Data Tables Migration
-- Run this in your Supabase SQL Editor (aszxnzbrbhqxzxvtjqyn)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. WARMUP EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS warmup_exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Cardio', 'Stretch', 'Strength', 'Mobility')),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE warmup_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_warmup_exercises" ON warmup_exercises
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 2. TEACHING TECHNIQUES
-- ============================================================
CREATE TABLE IF NOT EXISTS teaching_techniques (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  best_for TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teaching_techniques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_teaching_techniques" ON teaching_techniques
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 3. COACHING CUES
-- ============================================================
CREATE TABLE IF NOT EXISTS coaching_cues (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '',
  cue TEXT NOT NULL,
  move_related TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coaching_cues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_coaching_cues" ON coaching_cues
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 4. PLAYLIST SUGGESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS playlist_suggestions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '',
  bpm TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE playlist_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_playlist_suggestions" ON playlist_suggestions
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 5. COOL DOWN EXERCISES
-- ============================================================
CREATE TABLE IF NOT EXISTS cool_down_exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('On Pole', 'Floor', 'Standing')),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cool_down_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_cool_down_exercises" ON cool_down_exercises
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 6. SAFETY NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS safety_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE safety_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_safety_notes" ON safety_notes
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 7. SETUP CHECKLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS setup_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE setup_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_setup_checklist" ON setup_checklist
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- 8. INSTRUCTOR PREP
-- ============================================================
CREATE TABLE IF NOT EXISTS instructor_prep (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE instructor_prep ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read_instructor_prep" ON instructor_prep
  FOR SELECT TO anon, authenticated USING (true);

COMMIT;

-- ============================================================
-- SEED DATA
-- Run this after the tables are created
-- ============================================================

-- Warmup Exercises
INSERT INTO warmup_exercises (id, name, duration, category, description) VALUES
  ('wu-1', 'Shoulder Rolls', '1 min', 'Mobility', 'Roll shoulders forward and backward to warm up the rotator cuff.'),
  ('wu-2', 'Cat-Cow Stretches', '2 min', 'Stretch', 'Alternate between arching and rounding the spine on all fours.'),
  ('wu-3', 'Wrist Circles', '1 min', 'Mobility', 'Circle wrists in both directions to prepare for grip work.'),
  ('wu-4', 'Hip Circles', '1 min', 'Mobility', 'Large circles with the hips to warm up hip joints.'),
  ('wu-5', 'Jumping Jacks', '2 min', 'Cardio', 'Full body cardio to elevate heart rate.'),
  ('wu-6', 'Plank Hold', '30 sec', 'Strength', 'Isometric core engagement to activate stabilizers.'),
  ('wu-7', 'Leg Swings', '1 min', 'Mobility', 'Forward and lateral leg swings to open up hip flexors.'),
  ('wu-8', 'Arm Circles', '1 min', 'Mobility', 'Progressive arm circles from small to large.'),
  ('wu-9', 'Burpees', '1 min', 'Cardio', 'Full body explosive movement for cardio and strength.'),
  ('wu-10', 'Pole Grip Squeezes', '30 sec', 'Strength', 'Squeeze and release the pole to activate forearm muscles.')
ON CONFLICT (id) DO NOTHING;

-- Teaching Techniques
INSERT INTO teaching_techniques (id, name, description, best_for) VALUES
  ('tt-1', 'Demonstration & Mirror', 'Instructor demonstrates the full move, then students mirror it.', ARRAY['Visual learners', 'New moves']),
  ('tt-2', 'Progressive Breakdown', 'Break complex moves into smaller steps, mastering each before combining.', ARRAY['Complex moves', 'Mixed levels']),
  ('tt-3', 'Peer Spotting Pairs', 'Students pair up to spot each other with instructor guidance.', ARRAY['Inversions', 'Building confidence']),
  ('tt-4', 'Drill & Repeat', 'Repeat the same move or transition multiple times to build muscle memory.', ARRAY['Spins', 'Transitions', 'Conditioning']),
  ('tt-5', 'Flow Freestyle', 'Students create their own combinations using taught moves with music.', ARRAY['Creativity', 'Advanced students', 'Cool-down']),
  ('tt-6', 'Video Review', 'Record students performing moves and review together for feedback.', ARRAY['Form correction', 'Progress tracking']),
  ('tt-7', 'Scaffolded Challenge', 'Offer 3 levels of the same move so all students can participate.', ARRAY['Mixed levels', 'Inclusivity'])
ON CONFLICT (id) DO NOTHING;

-- Coaching Cues
INSERT INTO coaching_cues (id, category, cue, move_related) VALUES
  ('cc-1', 'Grip', 'Squeeze like you''re wringing out a towel', ARRAY['All spins']),
  ('cc-2', 'Core', 'Zip up your core - belly button to spine', ARRAY['All moves']),
  ('cc-3', 'Shoulders', 'Pack your shoulders down and back', ARRAY['Climbs', 'Holds']),
  ('cc-4', 'Legs', 'Point your toes - energy through the feet', ARRAY['All moves']),
  ('cc-5', 'Breathing', 'Exhale on the effort, inhale on the hold', ARRAY['All moves']),
  ('cc-6', 'Hips', 'Stack your hips over your shoulders', ARRAY['Inversions']),
  ('cc-7', 'Mindset', 'Trust your grip - your body knows what to do', ARRAY['New moves', 'Fear-based']),
  ('cc-8', 'Transitions', 'Slow is smooth, smooth is fast', ARRAY['Combos', 'Flow'])
ON CONFLICT (id) DO NOTHING;

-- Playlist Suggestions
INSERT INTO playlist_suggestions (id, name, mood, bpm, duration) VALUES
  ('pl-1', 'Warm Up Vibes', 'Energetic & Upbeat', '120-130', '10 min'),
  ('pl-2', 'Sensual Flow', 'Slow & Sultry', '80-95', '15 min'),
  ('pl-3', 'Power Moves', 'Intense & Driving', '130-145', '10 min'),
  ('pl-4', 'Cool Down', 'Calm & Relaxing', '60-80', '8 min'),
  ('pl-5', 'Freestyle Jam', 'Mixed & Creative', '100-120', '12 min'),
  ('pl-6', 'Exotic Floor', 'Dark & Moody', '85-100', '10 min')
ON CONFLICT (id) DO NOTHING;

-- Cool Down Exercises
INSERT INTO cool_down_exercises (id, name, duration, category, description) VALUES
  ('cd-1', 'Chest & Shoulder Opener (On Pole)', '1 min each side', 'On Pole', 'Stand facing the pole, place your right hand on it, and gently turn your body away to stretch the chest and shoulder. Repeat on both sides.'),
  ('cd-2', 'Pole Stretch - Pectorals (Partner Assisted)', '1 min', 'On Pole', 'Use the pole as an anchor while a partner gently assists in deepening the pectoral stretch.'),
  ('cd-3', 'Pole Stretch - Lats', '1 min each side', 'On Pole', 'Grab the pole high, step back, and lean away to stretch the lats deeply.'),
  ('cd-4', 'Side Body Stretch (On Pole)', '1 min each side', 'On Pole', 'Line your hip up with the pole, step back with the outside leg into a lunge, and reach the outside arm overhead cupping the pole to stretch lats and obliques.'),
  ('cd-5', 'Back/Lat Hang (On Pole)', '30 sec', 'On Pole', 'Grab the pole high with both hands, walk feet forward, and lean back, letting your back hang and stretch.'),
  ('cd-6', 'Back Lean Over', '30 sec', 'Standing', 'Gently lean back with hands on lower back for support to release the spine.'),
  ('cd-7', 'Shoulder Circles Back', '30 sec', 'Standing', 'Roll shoulders backward in large circles to release tension.'),
  ('cd-8', 'Shoulder Circles Front', '30 sec', 'Standing', 'Roll shoulders forward in large circles to release tension.'),
  ('cd-9', 'Legs (Rectus Femoris) with Glute Press', '1 min each side', 'Standing', 'Stretch the front of the thigh while engaging glutes for a deeper release.'),
  ('cd-10', 'Neck 3-Way Stretch', '1 min', 'Standing', 'Gently stretch the neck to the left, right, and forward to release tension.'),
  ('cd-11', 'Wrist Pulls', '30 sec', 'Standing', 'Gently pull back on fingers to stretch the forearm flexors from gripping.'),
  ('cd-12', 'Wrist Pushes', '30 sec', 'Standing', 'Push the back of the hand gently to stretch wrist extensors.'),
  ('cd-13', 'Wrist Circles', '30 sec', 'Standing', 'Rotate wrists in circles in both directions to release tension from gripping.'),
  ('cd-14', 'Pigeon Pose', '1 min each side', 'Floor', 'On the floor, bring one knee forward behind the wrist and straighten the back leg to release glutes and hips.'),
  ('cd-15', 'Upper Back Relief Arm Cross-Overs', '30 sec each side', 'Standing', 'Cross one arm over the chest and use the other to gently pull it closer, stretching the upper back and rear deltoid.'),
  ('cd-16', 'Shake It Out', '30 sec', 'Standing', 'Entire body shake to release all remaining tension and signal the end of class.')
ON CONFLICT (id) DO NOTHING;

-- Safety Notes
INSERT INTO safety_notes (note, sort_order) VALUES
  ('Check pole tightness before every class', 1),
  ('Ensure crash mats are positioned under all poles', 2),
  ('Verify students have removed jewelry and applied grip aid', 3),
  ('Check for skin moisture/lotions that reduce grip', 4),
  ('Review emergency procedures with new students', 5),
  ('Monitor room temperature - too cold reduces grip', 6),
  ('Ensure adequate spacing between poles (minimum 6ft)', 7),
  ('Have first aid kit accessible', 8),
  ('Check student injury/health forms before inversions', 9),
  ('Never allow unsupervised practice of advanced moves', 10);

-- Setup Checklist
INSERT INTO setup_checklist (item, sort_order) VALUES
  ('Poles cleaned and tightened', 1),
  ('Crash mats positioned', 2),
  ('Music system tested', 3),
  ('Room temperature checked (ideal: 68-72°F)', 4),
  ('Grip aids available (chalk, grip spray)', 5),
  ('First aid kit stocked', 6),
  ('Mirrors cleaned', 7),
  ('Attendance sheet ready', 8),
  ('Water station set up', 9),
  ('Lighting adjusted for class mood', 10);

-- Instructor Prep
INSERT INTO instructor_prep (item, sort_order) VALUES
  ('Review class plan and timing', 1),
  ('Warm up your own body', 2),
  ('Test all moves you plan to demonstrate', 3),
  ('Prepare modifications for different levels', 4),
  ('Set up music playlist in order', 5),
  ('Review student notes from last class', 6),
  ('Prepare verbal cues and corrections', 7),
  ('Set intention for the class', 8);
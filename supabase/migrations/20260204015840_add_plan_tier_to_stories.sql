/*
  # Add Plan Tier to Stories Table

  ## Changes
  - Add `plan` column to `stories` table to track user subscription tier
  - Plan options: 'storyteller' (free tier), 'keepsake' (tier 2), 'legacy' (tier 3)
  - Default to 'storyteller' for all users

  ## Details
  The plan field determines access to premium features:
  - storyteller: Basic features (photos, text, speech-to-text)
  - keepsake: Premium features (audio recording, video recording)
  - legacy: All premium features (audio recording, video recording)
*/

-- Add plan column to stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'plan'
  ) THEN
    ALTER TABLE stories ADD COLUMN plan text DEFAULT 'storyteller' CHECK (plan IN ('storyteller', 'keepsake', 'legacy'));
  END IF;
END $$;
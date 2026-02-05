/*
  # Update schema for image support and simplified onboarding

  ## Changes
  
  1. Responses table updates
    - Add `image_urls` column to store array of image URLs attached to responses
  
  2. Stories table updates
    - Make `recipient_role` nullable since we're removing that from onboarding

  ## Security
  - Maintain existing RLS policies
*/

-- Add image_urls column to responses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'responses' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE responses ADD COLUMN image_urls text[] DEFAULT '{}';
  END IF;
END $$;

-- Make recipient_role nullable in stories table
DO $$
BEGIN
  ALTER TABLE stories ALTER COLUMN recipient_role DROP NOT NULL;
END $$;
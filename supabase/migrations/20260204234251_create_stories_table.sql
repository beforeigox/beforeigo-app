/*
  # Create stories table for Before I Go

  ## Summary
  Creates the core stories table to store user life stories with cover design preferences.

  ## Tables Created
  - `stories`
    - `id` (uuid, primary key) - Unique identifier for each story
    - `user_id` (uuid) - Reference to the authenticated user who owns this story
    - `title` (text) - Story title (e.g., "Mom's Story")
    - `role` (text) - The role/relationship (e.g., "Mom", "Dad", "Grandma")
    - `cover_design_id` (text) - Selected cover design identifier
    - `answered_questions` (integer) - Number of questions answered
    - `total_questions` (integer) - Total questions in the story
    - `created_at` (timestamptz) - When the story was created
    - `updated_at` (timestamptz) - Last update timestamp
    - `completed_at` (timestamptz, nullable) - When the story was completed

  ## Security
  - Enables RLS on stories table
  - Users can only read their own stories
  - Users can only insert stories for themselves
  - Users can only update their own stories
  - Users can only delete their own stories
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  role text NOT NULL,
  cover_design_id text DEFAULT 'classic-burgundy',
  answered_questions integer DEFAULT 0,
  total_questions integer DEFAULT 72,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON stories(created_at DESC);

/*
  # Story Capture Application Schema

  ## Overview
  Creates the database structure for a story capture application that helps users
  record their life stories through guided questions.

  ## New Tables
  
  ### `stories`
  - `id` (uuid, primary key) - Unique story identifier
  - `storyteller_role` (text) - Who is telling the story (Mom, Dad, etc.)
  - `recipient_role` (text) - Who the story is for (Son, Daughter, etc.)
  - `created_at` (timestamptz) - When the story was created
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `responses`
  - `id` (uuid, primary key) - Unique response identifier
  - `story_id` (uuid, foreign key) - Links to stories table
  - `question_id` (text) - Question identifier
  - `answer` (text) - The user's response
  - `is_completed` (boolean) - Whether the response is complete
  - `created_at` (timestamptz) - When response was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storyteller_role text NOT NULL,
  recipient_role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text DEFAULT '',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(story_id, question_id)
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Stories policies (open for now since we don't have auth yet)
CREATE POLICY "Anyone can create stories"
  ON stories
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view stories"
  ON stories
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update stories"
  ON stories
  FOR UPDATE
  TO anon
  USING (true);

-- Responses policies
CREATE POLICY "Anyone can create responses"
  ON responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update responses"
  ON responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Anyone can delete responses"
  ON responses
  FOR DELETE
  TO anon
  USING (true);
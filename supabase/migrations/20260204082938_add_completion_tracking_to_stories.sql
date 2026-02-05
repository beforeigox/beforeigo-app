/*
  # Add Completion Tracking to Stories

  ## Changes
  - Add `status` column to track story completion status
  - Add `completion_date` column to track when story was completed
  - Add `progress` column to track completion percentage

  ## Details
  The status field can be:
  - 'in_progress': User is still answering questions
  - 'complete': User has finished all questions

  Progress is a percentage from 0-100 representing how many questions are answered.
*/

-- Add status column to stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'status'
  ) THEN
    ALTER TABLE stories ADD COLUMN status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'complete'));
  END IF;
END $$;

-- Add completion_date column to stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'completion_date'
  ) THEN
    ALTER TABLE stories ADD COLUMN completion_date timestamptz;
  END IF;
END $$;

-- Add progress column to stories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'progress'
  ) THEN
    ALTER TABLE stories ADD COLUMN progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
  END IF;
END $$;

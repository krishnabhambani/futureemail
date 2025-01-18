/*
  # Add to_email column to scheduled_emails table

  1. Changes
    - Add `to_email` column to `scheduled_emails` table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'scheduled_emails' AND column_name = 'to_email'
  ) THEN
    ALTER TABLE scheduled_emails ADD COLUMN to_email text NOT NULL;
  END IF;
END $$;
/*
  # Initial Schema Setup for Future Email Service

  1. Tables
    - users (handled by Supabase Auth)
    - scheduled_emails
      - id (uuid, primary key)
      - user_id (references auth.users)
      - subject (text)
      - content (text)
      - scheduled_for (timestamp with time zone)
      - delivered (boolean)
      - created_at (timestamp with time zone)
      - updated_at (timestamp with time zone)

  2. Security
    - Enable RLS on scheduled_emails table
    - Add policies for CRUD operations
*/

-- Create scheduled_emails table
CREATE TABLE scheduled_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  delivered boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own scheduled emails"
  ON scheduled_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own scheduled emails"
  ON scheduled_emails
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled emails"
  ON scheduled_emails
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled emails"
  ON scheduled_emails
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scheduled_emails_updated_at
  BEFORE UPDATE
  ON scheduled_emails
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
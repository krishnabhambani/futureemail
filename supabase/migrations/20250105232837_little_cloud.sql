-- Create the scheduled_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  delivered boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$
BEGIN
  -- Create email policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'scheduled_emails' 
    AND policyname = 'Users can create their own scheduled emails'
  ) THEN
    CREATE POLICY "Users can create their own scheduled emails"
      ON scheduled_emails
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'scheduled_emails' 
    AND policyname = 'Users can view their own scheduled emails'
  ) THEN
    CREATE POLICY "Users can view their own scheduled emails"
      ON scheduled_emails
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'scheduled_emails' 
    AND policyname = 'Users can update their own scheduled emails'
  ) THEN
    CREATE POLICY "Users can update their own scheduled emails"
      ON scheduled_emails
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'scheduled_emails' 
    AND policyname = 'Users can delete their own scheduled emails'
  ) THEN
    CREATE POLICY "Users can delete their own scheduled emails"
      ON scheduled_emails
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_scheduled_emails_updated_at'
  ) THEN
    CREATE TRIGGER update_scheduled_emails_updated_at
      BEFORE UPDATE
      ON scheduled_emails
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('email-attachments', 'email-attachments', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policies with safety checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload their own attachments'
  ) THEN
    CREATE POLICY "Users can upload their own attachments"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'email-attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can read their own attachments'
  ) THEN
    CREATE POLICY "Users can read their own attachments"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'email-attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own attachments'
  ) THEN
    CREATE POLICY "Users can delete their own attachments"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'email-attachments' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;
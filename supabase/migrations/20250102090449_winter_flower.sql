/*
  # Add attachment support to scheduled emails

  1. Changes
    - Add attachments column to scheduled_emails table
    - Add storage bucket for email attachments
*/

-- Add attachments column to store file metadata
ALTER TABLE scheduled_emails 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('email-attachments', 'email-attachments', false);

-- Enable RLS on the bucket
CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'email-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'email-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
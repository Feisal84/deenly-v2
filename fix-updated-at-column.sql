-- Fix missing updated_at column in lectures table
-- This resolves the RPC function fallback error

-- Add updated_at column to lectures table if it doesn't exist
ALTER TABLE lectures 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create or replace the increment_lecture_views RPC function
CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE lectures 
  SET 
    num_views = COALESCE(num_views, 0) + 1,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = lecture_id;
END;
$$;

-- Update existing lectures to have updated_at = created_at if null
UPDATE lectures 
SET updated_at = created_at 
WHERE updated_at IS NULL;

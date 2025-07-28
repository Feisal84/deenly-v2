-- Create the increment_lecture_views function
-- Run this SQL in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE lectures 
    SET num_views = COALESCE(num_views, 0) + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = lecture_id;
    
    -- Log success (optional)
    RAISE NOTICE 'Successfully incremented views for lecture %', lecture_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE LOG 'Error incrementing views for lecture %: %', lecture_id, SQLERRM;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Test the function (this should not error)
-- SELECT increment_lecture_views('00000000-0000-0000-0000-000000000000');

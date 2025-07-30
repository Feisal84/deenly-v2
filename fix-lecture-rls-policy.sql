-- Fix Lecture RLS Policy for Authenticated Users
-- This script fixes the issue where authenticated users cannot create lectures

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Mosque members can create lectures" ON lectures;

-- Create or replace policy for authenticated users to create lectures
DROP POLICY IF EXISTS "Authenticated users can create lectures" ON lectures;
CREATE POLICY "Authenticated users can create lectures" ON lectures
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- Drop existing update policies
DROP POLICY IF EXISTS "Authors can update their lectures" ON lectures;
DROP POLICY IF EXISTS "Authenticated users can update lectures" ON lectures;

-- Create simplified update policy for authenticated users
CREATE POLICY "Authenticated users can update lectures" ON lectures
FOR UPDATE USING (
  auth.role() = 'authenticated'
);

-- Drop existing delete policy
DROP POLICY IF EXISTS "Authors can delete their lectures" ON lectures;
DROP POLICY IF EXISTS "Authenticated users can delete lectures" ON lectures;

-- Create simplified delete policy for authenticated users
CREATE POLICY "Authenticated users can delete lectures" ON lectures
FOR DELETE USING (
  auth.role() = 'authenticated'
);

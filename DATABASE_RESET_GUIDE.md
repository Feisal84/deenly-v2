# 🔄 Supabase Database Reset Guide

This guide will help you reset your Supabase database to its original empty state, removing all tables and data that were created during the debugging session.

## ⚠️ IMPORTANT WARNING

**This will permanently delete ALL data in your database!**  
Only proceed if you want to completely reset your database to a clean state.

## 📋 Step-by-Step Instructions

### Step 1: Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project: `hhjfykwyzqimqcsvlady`

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** to create a new SQL script

### Step 3: Reset Database Tables

Copy and paste the following commands **one by one** into the SQL Editor and run each individually:

```sql
-- Remove lectures table
DROP TABLE IF EXISTS public.lectures CASCADE;
```

```sql
-- Remove mosques table
DROP TABLE IF EXISTS public.mosques CASCADE;
```

```sql
-- Remove any other tables that might exist
DROP TABLE IF EXISTS public.khutbas CASCADE;
DROP TABLE IF EXISTS public.imams CASCADE;
DROP TABLE IF EXISTS public.prayer_times CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
```

```sql
-- Remove custom types
DROP TYPE IF EXISTS public.lecture_status CASCADE;
DROP TYPE IF EXISTS public.mosque_service CASCADE;
```

```sql
-- Remove custom functions
DROP FUNCTION IF EXISTS public.incr_lecture_viewer(uuid) CASCADE;
```

### Step 4: Verify Database is Clean

Run this verification query to confirm all tables are removed:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

**Expected Result:** This should return no rows (empty result) or only system tables.

### Step 5: Confirm Reset Complete

Your database is now reset to its original state when you should see:

- ✅ No custom tables in the `public` schema
- ✅ No custom functions
- ✅ No custom types
- ✅ Clean slate for future development

## 🛡️ What's Preserved

- Your Supabase project remains active
- API keys and project URL stay the same
- Authentication system (if you had set it up)
- Supabase system tables and functions
- Project settings and configurations

## 🎯 Next Steps

After resetting, your database will be completely clean and ready for:

- Fresh schema design
- New table creation
- Clean development start
- Whatever direction you want to take the project

## 🔧 Alternative: Use the SQL File

Instead of copying commands manually, you can:

1. Open the `reset-database.sql` file in this project
2. Copy the entire content
3. Paste it into the Supabase SQL Editor
4. Run the entire script at once

---

**Remember:** This action cannot be undone. Make sure this is what you want before proceeding!

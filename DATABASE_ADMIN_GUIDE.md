# Database Administrator Guide for Deenly v2

## Your Role & Capabilities

You are a **Database Administrator** with access only to the Supabase database. You **cannot** modify:

- Frontend code (React/Next.js)
- Mobile app code
- Translation files
- UI components
- Authentication logic (frontend)

## What You CAN Do

### 1. Database Schema Management

- **File**: `database-schema-complete.sql`
- **Purpose**: Create/modify tables, indexes, RLS policies, triggers
- **Status**: ✅ Ready to use

### 2. Sample Data Insertion

- **File**: `INSERT_SAMPLE_KHUTBAH_CLEAN.sql`
- **Purpose**: Insert sample khutbahs for testing
- **Status**: ✅ Fixed for enum compatibility (only 'Admin', 'Imam' roles)

### 3. User Role Management

- **File**: `ASSIGN_USER_ROLES.sql`
- **Purpose**: Assign Admin/Imam roles to specific users
- **Status**: ✅ Fixed for enum compatibility

- **File**: `FIX_MISSING_USERS.sql`
- **Purpose**: Create missing user records
- **Status**: ✅ Fixed for enum compatibility

- **File**: `FIX_SINGLE_USER.sql`
- **Purpose**: Create/update individual user records
- **Status**: ✅ Fixed for enum compatibility

### 4. Mosque Data Management

- **File**: `ADD_MOSQUE_IMAGES.sql`
- **Purpose**: Update mosque records with image paths
- **Status**: ✅ Ready to use

- **File**: `FIX_MOSQUE_IMAGES_404.sql`
- **Purpose**: Fix broken image paths
- **Status**: ✅ Ready to use

### 5. Diagnostic Scripts

- **File**: `CHECK_USER_ROLES_ENUM.sql`
- **Purpose**: Verify valid enum values
- **Status**: ✅ Ready to use

## Important Database Schema Notes

### User Role Enum

The `user_role` enum only accepts these values:

- `'Admin'` - Full mosque management access
- `'Imam'` - Can create lectures/events
- `'Member'` - Regular user
- `'Visitor'` - Guest access

❌ **DO NOT USE**: `'User'` (this will cause enum errors)

### Required Fields

When creating users, these fields are required:

- `email` (unique)
- `name` (or `full_name` in some scripts)
- `role` (must be valid enum value)

### Mosque Image Paths

Images should be stored as relative paths:

- ✅ Good: `/images/mosques/bilal-moschee.jpg`
- ❌ Bad: `http://domain.com/full-url.jpg`

## Running Your Scripts

1. Log into Supabase Dashboard
2. Go to SQL Editor
3. Run scripts in this order:
   - First: `database-schema-complete.sql` (if setting up fresh)
   - Then: Data scripts (`INSERT_SAMPLE_KHUTBAH_CLEAN.sql`, etc.)
   - Finally: Fix scripts (`ASSIGN_USER_ROLES.sql`, etc.)

## Limitations

**Frontend Issues You CANNOT Fix:**

- Mobile login redirect loops
- Translation key errors (MISSING_MESSAGE)
- UI component visibility (floating buttons, etc.)
- Image 404 errors (requires frontend asset management)
- Authentication flow issues

**These require frontend developer intervention.**

## Next Steps

Focus on database-related tasks:

1. Ensure all your SQL scripts run without enum errors
2. Populate mosque and user data
3. Create sample khutbahs for testing
4. Verify data integrity with diagnostic queries

The frontend team will handle UI, authentication, and translation issues separately.

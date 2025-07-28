# Database Update Guide: 4 Mosques Only

## Current Situation

Your database currently has **8 mosques**, but you need exactly **4 mosques** with specific addresses and information.

## Required Action

You need to run one of the SQL scripts in your Supabase SQL Editor to update the database.

## Option 1: Complete Reset (Recommended)

**File:** `update-4-mosques-only.sql`

This will:

- Remove ALL existing mosques and their related data
- Insert the 4 new mosques with correct information
- Start fresh with clean data

⚠️ **Warning:** This will delete all existing mosque-related data (lectures, events, etc.)

## Option 2: Safe Update

**File:** `update-4-mosques-safe.sql`

This will:

- Keep existing lectures/events for matching mosques
- Remove only unwanted mosques
- Update existing mosques with correct information

## How to Run the Update

### Step 1: Go to Supabase Dashboard

1. Open https://app.supabase.com/
2. Select your project
3. Go to "SQL Editor"

### Step 2: Choose and Run Script

Copy the contents of either:

- `update-4-mosques-only.sql` (complete reset)
- `update-4-mosques-safe.sql` (preserves data)

### Step 3: Verify Results

Run the verification script:

```bash
node verify-4-mosques.js
```

## Expected Result After Update

You will have exactly **4 mosques**:

### 1. Bilal Moschee

- **Address:** Schildescher Str. 69, 33611 Bielefeld
- **Handle:** `bilal-moschee-bielefeld`
- **Phone:** +4952198629199
- **Email:** info@alx.de
- **Website:** https://www.aikv.de
- **Jumua Time:** 13:45

### 2. DITIB Moschee Lage

- **Address:** Detmolder Str. 48, 32791 Lage
- **Handle:** `ditib-moschee-lage`
- **Jumua Time:** 13:30

### 3. SoKuT Icmg Baesweiler

- **Address:** Breite Str. 64, 52499 Baesweiler
- **Handle:** `sokut-icmg-baesweiler`
- **Jumua Time:** 13:30

### 4. Spenge Moschee

- **Address:** Ravensberger Str. 35, 32139 Spenge
- **Handle:** `spenge-moschee`
- **Jumua Time:** 13:30

## Key Changes Made

1. **Corrected Addresses:** Updated all addresses to match your specifications
2. **Proper Handles:** Generated SEO-friendly URL handles
3. **Coordinates:** Added GPS coordinates for map functionality
4. **Contact Info:** Added phone, email, website where available
5. **Services:** Added relevant service arrays for each mosque
6. **Prayer Times:** Set appropriate Jumua prayer times

## Files Created

1. `update-4-mosques-only.sql` - Complete database reset
2. `update-4-mosques-safe.sql` - Safe update preserving data
3. `verify-4-mosques.js` - Verification script
4. `DATABASE_4_MOSQUES_GUIDE.md` - This guide

## Next Steps

1. ✅ Choose your update strategy (reset vs safe)
2. 🔄 Run the SQL script in Supabase
3. 🧪 Verify with `node verify-4-mosques.js`
4. 🚀 Test your application

The mosque data will now match exactly what you see in your screenshots and requirements!

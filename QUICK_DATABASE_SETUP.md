# 🚀 Quick Database Setup Guide

## ⚠️ REQUIRED: Your database has no tables yet!

Since you don't have a `users` table, you need to run the complete database setup.

## 📋 **Step-by-Step Instructions**

### **Step 1: Run Database Schema**

1. **Open Supabase Dashboard** → **SQL Editor**
2. **Copy ALL content** from: `database-schema-complete.sql`
3. **Paste and Execute** the entire script

This creates:

- ✅ All tables (`mosques`, `users`, `lectures`, etc.)
- ✅ Security policies (RLS)
- ✅ Database functions
- ✅ Sample mosque data

### **Step 2: Add Mosque Images**

After Step 1, run this in SQL Editor:

```sql
-- Add mosque images
UPDATE mosques
SET hero_path = '/images/mosques/bilal-moschee.jpg'
WHERE handle = 'bilal-moschee-bielefeld';

UPDATE mosques
SET hero_path = '/images/features/mosque-features.webp'
WHERE handle IN ('ditib-moschee-lage', 'sokut-icmg-baesweiler', 'spenge-moschee');
```

### **Step 3: Create Your Admin User**

1. **Authentication** → **Users** → **Add User**

   - Email: `your-email@example.com`
   - Password: `your-secure-password`
   - **Copy the User ID** from the list

2. **SQL Editor** → Run this (replace the values):

```sql
-- Replace these values with your actual data:
-- 'your-auth-user-id-here' = User ID from Step 3.1
-- 'your-email@example.com' = Your actual email

INSERT INTO users (auth_user_id, email, role, mosque_id, full_name, created_at)
VALUES (
  'your-auth-user-id-here',
  'your-email@example.com',
  'Admin',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld' LIMIT 1),
  'Admin User',
  NOW()
);
```

## ✅ **After Setup - Test Login**

1. **Start your app:** `npm run dev -- -H 0.0.0.0`
2. **Go to:** `http://localhost:3000/de/auth/login`
3. **Login with:** Email + Password from Step 3

## 🎯 **What This Fixes**

- ❌ **Before:** No `users` table → Login fails
- ✅ **After:** Complete database → Login works → Redirects to dashboard

---

**Next:** Run Step 1 first, then let me know if you need help with Steps 2-3!

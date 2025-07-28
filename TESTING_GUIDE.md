# 🧪 Testing the Imam Lecture Creation System

## 📋 Step-by-Step Testing Guide

### Phase 1: Database Setup

1. **Run the 4 Mosques SQL** (if not done already)

   ```sql
   -- In Supabase SQL Editor, run:
   c:\DEENLY PROJECT COMPLETE\deenly-v2\FINAL-UPDATE-4-MOSQUES.sql
   ```

2. **Create Auth Users in Supabase Dashboard**

   - Go to your Supabase project
   - Navigate to Authentication > Users
   - Click "Add User" and create these users:

     ```
     Email: imam.bilal@deenly.de
     Password: TestPassword123!

     Email: imam.lage@deenly.de
     Password: TestPassword123!

     Email: imam.baesweiler@deenly.de
     Password: TestPassword123!

     Email: imam.spenge@deenly.de
     Password: TestPassword123!
     ```

3. **Link Users to Mosques**
   - After creating auth users, copy their UUIDs
   - Run the SQL from `CREATE_IMAM_USERS.sql` with actual UUIDs

### Phase 2: Start Development Server

```bash
cd "c:\DEENLY PROJECT COMPLETE\deenly-v2"
npm run dev
```

### Phase 3: Test Authentication Flow

1. **Navigate to Login Page**

   ```
   http://localhost:3000/de/auth/login
   ```

2. **Test Login**

   - Email: imam.bilal@deenly.de
   - Password: TestPassword123!
   - Should redirect to dashboard

3. **Test Dashboard Access**
   - Should see: "Willkommen, Imam Ahmad Hassan • Bilal Moschee"
   - Should see "Add New Lecture" button
   - Should see "Manage Lectures" button

### Phase 4: Test Lecture Creation

1. **Create New Lecture**

   - Click "Neuen Vortrag erstellen"
   - Fill out form:

     ```
     Title: Testpredigt - Die Bedeutung des Gebets
     Type: Khutba
     Status: Public
     Content:
     بسم الله الرحمن الرحيم

     Liebe Geschwister im Islam,

     Das Gebet ist die Säule unseres Glaubens...
     ```

   - Click "Veröffentlichen"

2. **Verify Lecture Creation**

   - Should see success message
   - Should redirect to lecture management
   - Should see the new lecture in the list

3. **Test Public Access**
   - Navigate to: `http://localhost:3000/de/moscheen/bilal-moschee-bielefeld`
   - Should see the new lecture in the mosque's lecture list
   - Click on the lecture to view full content

### Phase 5: Test Content Management

1. **View Lecture Management**

   - Navigate to dashboard > "Vorträge verwalten"
   - Should see list of created lectures
   - Test Edit, Delete, View functions

2. **Test Different Statuses**
   - Create a draft lecture (Status: Draft)
   - Verify it doesn't appear on public mosque page
   - Verify it appears in management dashboard

### Phase 6: Multi-Mosque Testing

1. **Test Different Mosque Imams**

   - Logout and login as imam.lage@deenly.de
   - Create lecture for DITIB Moschee Lage
   - Verify mosque-specific content separation

2. **Verify Security**
   - Confirm each imam only sees their own mosque's content
   - Test unauthorized access attempts

## 🔍 Expected Results

### ✅ Success Indicators

- [ ] Login works for all imam accounts
- [ ] Dashboard shows correct mosque information
- [ ] Lecture creation form works
- [ ] Arabic text displays correctly (RTL)
- [ ] Public lectures appear on mosque pages
- [ ] Draft lectures remain private
- [ ] View counts increment correctly
- [ ] Edit/delete functions work
- [ ] Multi-mosque separation works

### ❌ Common Issues & Solutions

**Issue: "Benutzer nicht gefunden"**

- Solution: Ensure users table has correct auth_user_id mapping

**Issue: Cards not displaying properly**

- Solution: Check if components/ui/card.tsx exists and has correct exports

**Issue: Navigation doesn't work**

- Solution: Verify all page routes exist and are properly structured

**Issue: Arabic text alignment problems**

- Solution: Check if RTL detection works in lecture content component

## 🎯 Next Steps After Testing

1. **If tests pass**: System is ready for production
2. **If tests fail**: Debug specific issues using browser dev tools
3. **Create real imam accounts** with proper credentials
4. **Train imams** on the new interface
5. **Monitor usage** and gather feedback

## 📞 Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify environment variables are correct
4. Test individual components separately

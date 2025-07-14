# Deenly v2 Database Setup Guide

## Overview

This guide will help you set up the complete Supabase database for the Deenly v2 mosque platform. The database includes all the necessary tables to manage mosques, users, lectures (khutbas), events, prayer times, announcements, and comments.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new Supabase project
3. **Database Access**: Ensure you have access to the SQL Editor in your Supabase dashboard

## Database Schema

The database includes the following main tables:

### Core Tables

- **mosques**: Store mosque information, contact details, and configuration
- **users**: User profiles linked to Supabase Auth
- **lectures**: Khutbas and religious content with multilingual support
- **events**: Community events and programs
- **prayer_times**: Daily prayer schedules for each mosque
- **announcements**: Mosque announcements with expiry dates
- **comments**: Comments on lectures and events

### Key Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Multilingual Support**: JSONB fields for translations
- **Geolocation**: PostGIS support for location-based features
- **Flexible Prayer Time Calculation**: Multiple calculation methods
- **Comprehensive Indexing**: Optimized for performance

## Setup Instructions

### Step 1: Execute Main Schema

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy the contents of `database-schema-complete.sql`
4. Paste and execute the SQL script

This will create:

- All tables with proper relationships
- Custom types and enums
- Indexes for performance
- Row Level Security policies
- Automatic timestamp triggers

### Step 2: Insert Sample Data

1. In the SQL Editor, open a new query
2. Copy the contents of `sample-data.sql`
3. Execute the script to populate with sample mosques

This includes:

- **4 sample mosques** with real German locations
- **Imam profiles** for each mosque
- **Sample khutbas** with multilingual titles
- **Upcoming events** and announcements
- **Current week prayer times**

### Step 3: Configure Environment Variables

Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Mosques Included in Sample Data

Based on your mosque information, the following mosques are pre-configured:

### 1. Bilal Moschee

- **Address**: Schildescher Str. 69, 33611 Bielefeld
- **Phone**: +4952198629199
- **Email**: info@alx.de
- **Website**: https://www.aikv.de
- **Friday Prayer**: 13:45
- **Handle**: bilal-moschee

### 2. DITIB Moschee Lage

- **Address**: Detmolder Str. 48, 32791 Lage
- **Handle**: ditib-lage

### 3. SoKuT Icmg Baesweiler

- **Address**: Breite Str. 64, 52499 Baesweiler
- **Handle**: sokut-baesweiler

### 4. Spenge Moschee

- **Address**: Ravensberger Str. 35, 32139 Spenge
- **Handle**: spenge-moschee

## Database Features

### Prayer Time Management

- Supports multiple calculation methods
- Configurable time offsets per mosque
- Automatic daily prayer time insertion
- Geolocation-based calculations

### Content Management

- Multilingual khutba support
- Draft/Public/Archived status system
- View tracking and engagement metrics
- Audio/Video URL support

### User Management

- Role-based access (Admin, Imam, Member, Visitor)
- Mosque association
- Profile management
- Notification preferences

### Events & Announcements

- Comprehensive event scheduling
- Registration management
- Priority-based announcements
- Automatic expiry handling

## Security Configuration

The database implements comprehensive Row Level Security:

### Public Access

- Mosque information (read-only)
- Published lectures and events
- Prayer times and announcements

### Authenticated Access

- User profile management
- Comment creation
- Content interaction

### Role-Based Access

- **Imams/Admins**: Full content management for their mosque
- **Members**: Basic interaction capabilities
- **Visitors**: Read-only access

## API Integration

The database is designed to work seamlessly with:

### External APIs

- **Aladhan API**: For prayer time calculations
- **Translation Services**: For multilingual content
- **Maps APIs**: For location services

### Internal APIs

- Next.js API routes
- Real-time subscriptions
- File upload handling

## Testing the Setup

### 1. Verify Tables

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### 2. Check Sample Data

```sql
SELECT name, city, handle FROM mosques;
```

### 3. Test Policies

```sql
SELECT * FROM lectures WHERE status = 'Public';
```

## Maintenance & Updates

### Regular Tasks

1. **Prayer Time Updates**: Automated or manual insertion
2. **Content Moderation**: Review and approve comments
3. **Performance Monitoring**: Check query performance
4. **Backup Management**: Regular database backups

### Schema Updates

- Use Supabase migrations for schema changes
- Test updates in development environment
- Monitor for breaking changes

## Troubleshooting

### Common Issues

1. **RLS Policies**: If data isn't visible, check RLS policies
2. **Foreign Key Constraints**: Ensure referenced records exist
3. **UUID Generation**: Verify uuid-ossp extension is enabled
4. **PostGIS**: Ensure PostGIS extension for location features

### Performance Optimization

1. **Indexing**: Additional indexes for specific queries
2. **Query Optimization**: Use EXPLAIN ANALYZE for slow queries
3. **Connection Pooling**: Configure for high-traffic scenarios
4. **Caching**: Implement Redis for frequently accessed data

## Troubleshooting the FunctionsHttpError

If you're seeing a `FunctionsHttpError: Edge Function returned a non-2xx status code`, this is typically because:

1. **Missing Database Functions**: The `increment_lecture_views` function doesn't exist
2. **Database Not Set Up**: Tables don't exist or RLS policies are misconfigured
3. **Environment Variables**: Supabase credentials are missing or incorrect

### Quick Fix Steps

1. **Run the diagnostic script**:

   ```sql
   -- Copy and run database-diagnostic-repair.sql in your Supabase SQL Editor
   ```

2. **Verify Environment Variables**:

   ```bash
   # Check your .env.local file contains:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

### Alternative Fix

If the error persists, you can temporarily disable view counting by commenting out the increment function call in:
`app/[locale]/moscheen/[handle]/lecture/[lectureId]/page.tsx`

```typescript
// Comment out this line temporarily:
// await incrementLectureViews(lectureId);
```

### Next.js Configuration Issues

If you see warnings about deprecated image configurations:

```
⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
```

**Fix**: Update your `next.config.ts` to use the newer configuration:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-supabase-project.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
```

## Image Setup

The database is configured to use local images for mosques. Make sure to:

1. **Place mosque images** in `/public/images/mosques/` directory
2. **Follow naming convention**: Match the mosque handle (e.g., `bilal-moschee.jpg`)
3. **Optimize images**: Use WebP format when possible, keep file sizes under 500KB

For detailed image setup instructions, see: `IMAGES_SETUP_GUIDE.md`

## Next Steps

1. **Test the Application**: Run `npm run dev` and verify functionality
2. **Configure Authentication**: Set up Supabase Auth if needed
3. **Add Real Data**: Replace sample data with actual mosque information
4. **Deploy**: Deploy to Vercel or your preferred platform

## Support

For issues with this database setup:

1. Check Supabase documentation
2. Review error logs in Supabase dashboard
3. Test queries in SQL Editor
4. Contact the development team

---

**Note**: This database schema is production-ready and includes all necessary security measures, indexing, and relationships for a full-featured mosque management platform.

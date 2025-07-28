# 🖼️ Adding Mosque Images Guide

## 📁 Current Image Status

### ✅ **Available Images:**

- **Bilal Moschee**: `/images/mosques/bilal-moschee.jpg` ✅
- **General Mosque**: `/images/features/mosque-features.webp` ✅

### 🔄 **To Be Added:**

- **DITIB Moschee Lage**: Specific image needed
- **SoKuT Icmg Baesweiler**: Specific image needed
- **Spenge Moschee**: Specific image needed

## 🚀 **Quick Setup (Use What We Have Now)**

### Step 1: Update Database with Available Images

Run this SQL in your Supabase SQL Editor:

```sql
-- Use the ADD_MOSQUE_IMAGES.sql file
-- This will add the Bilal mosque image and use the generic mosque image for others
```

### Step 2: Test the Images

1. Start your dev server: `npm run dev`
2. Visit the mosque pages:
   - `http://localhost:3000/de/moscheen/bilal-moschee-bielefeld`
   - `http://localhost:3000/de/moscheen/ditib-moschee-lage`

## 📸 **Adding Specific Mosque Images (Future)**

### Image Requirements:

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x400px (2:1 ratio)
- **Quality**: High resolution, clear view of the mosque
- **File Size**: Under 500KB for fast loading

### Steps to Add New Images:

#### 1. **Prepare Images**

```bash
# Copy mosque images to the correct folder
copy "path\to\your\mosque\image.jpg" "c:\DEENLY PROJECT COMPLETE\deenly-v2\public\images\mosques\ditib-moschee-lage.jpg"
```

#### 2. **Update Database**

```sql
-- Update specific mosque with new image path
UPDATE mosques
SET hero_path = '/images/mosques/ditib-moschee-lage.jpg'
WHERE handle = 'ditib-moschee-lage';
```

#### 3. **Verify Image Loading**

Check the browser console for any 404 errors when visiting mosque pages.

## 🎨 **Image Display Behavior**

### How Images Are Shown:

- **Large Display**: 80% width on desktop, full height ~320px
- **Responsive**: Adjusts to mobile screens
- **Fallback**: Shows "No Image" placeholder if `hero_path` is null
- **Error Handling**: Browser handles missing images gracefully

### CSS Classes Used:

```css
.mosque-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Crops to maintain aspect ratio */
}
```

## 🔍 **Troubleshooting**

### **Image Not Showing?**

1. Check file path: `/images/mosques/filename.jpg`
2. Verify file exists in `public/images/mosques/`
3. Check browser Network tab for 404 errors
4. Ensure database `hero_path` is correct

### **Image Too Large/Small?**

- Images are automatically resized with CSS `object-fit: cover`
- For best results, use 2:1 aspect ratio (e.g., 800x400px)

### **Performance Issues?**

- Optimize images before uploading
- Use WebP format for smaller file sizes
- Consider using Next.js Image component for automatic optimization

## 📋 **Current Implementation**

### Database Schema:

```sql
-- mosques table includes:
hero_path VARCHAR(500) -- Path to mosque image
```

### Component Structure:

```tsx
// MosqueHeader component handles image display
{
  mosque.hero_path ? (
    <img src={mosque.hero_path} alt={mosque.name} />
  ) : (
    <div>No Image Available</div>
  );
}
```

## 🎯 **Next Steps**

1. **Run the SQL**: Execute `ADD_MOSQUE_IMAGES.sql` now
2. **Test Pages**: Visit mosque pages to see images
3. **Collect Photos**: Get specific photos for DITIB, SoKuT, and Spenge mosques
4. **Optimize Images**: Resize and compress before adding
5. **Update Database**: Add specific image paths when ready

---

**Status**: Ready to use with available images! 🚀

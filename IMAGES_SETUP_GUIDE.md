# Mosque Images Setup Guide

## Image Directory Structure

Your mosque images should be placed in the following directory structure:

```
public/
  images/
    mosques/
      bilal-moschee.jpg          # Main image for Bilal Moschee
      ditib-lage.jpg             # Main image for DITIB Moschee Lage
      sokut-baesweiler.jpg       # Main image for SoKuT Icmg Baesweiler
      spenge-moschee.jpg         # Main image for Spenge Moschee
    features/
      mosque-features.webp       # Feature showcase images
      ummah-features.webp
    hero.webp                    # Main hero image
```

## Image Recommendations

### File Formats

- **Primary**: Use `.webp` format for best compression and quality
- **Fallback**: `.jpg` for compatibility
- **Logos**: `.svg` for crisp vector graphics

### Image Sizes

- **Mosque Main Images**: 1200x800px (3:2 aspect ratio)
- **Feature Images**: 800x600px (4:3 aspect ratio)
- **Hero Images**: 1920x1080px (16:9 aspect ratio)

### File Naming Convention

- Use kebab-case (lowercase with hyphens)
- Match the mosque handle from the database
- Be descriptive but concise

## Sample Data Configuration

The database sample data is already configured to use these local image paths:

```sql
-- Bilal Moschee
image_url: '/images/mosques/bilal-moschee.jpg'

-- DITIB Moschee Lage
image_url: '/images/mosques/ditib-lage.jpg'

-- SoKuT Icmg Baesweiler
image_url: '/images/mosques/sokut-baesweiler.jpg'

-- Spenge Moschee
image_url: '/images/mosques/spenge-moschee.jpg'
```

## Next.js Image Optimization

Your `next.config.ts` is now optimized for:

✅ **Local Images**: All images in `/public/images/` are automatically optimized
✅ **Modern Formats**: WebP and AVIF for better compression
✅ **Responsive Images**: Multiple sizes generated automatically
✅ **Remote Images**: Supabase and external image sources supported

## Usage in Components

Use Next.js Image component for optimal performance:

```typescript
import Image from 'next/image';

// For local images
<Image
  src="/images/mosques/bilal-moschee.jpg"
  alt="Bilal Moschee"
  width={1200}
  height={800}
  className="rounded-lg"
  priority // for above-the-fold images
/>

// For responsive images
<Image
  src="/images/mosques/bilal-moschee.jpg"
  alt="Bilal Moschee"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Adding New Mosque Images

When adding a new mosque:

1. **Add the image** to `/public/images/mosques/[mosque-handle].jpg`
2. **Update the database** with the correct `image_url` path
3. **Follow naming convention** to match the mosque handle

Example:

```sql
INSERT INTO mosques (..., image_url, ...)
VALUES (..., '/images/mosques/my-new-mosque.jpg', ...);
```

## Performance Tips

- **Optimize file sizes** before uploading (aim for <500KB per image)
- **Use appropriate dimensions** (don't upload 4K images for 400px displays)
- **Consider lazy loading** for images below the fold
- **Use `priority` prop** for critical above-the-fold images

## Troubleshooting

### Image Not Loading

1. Check file path matches exactly (case-sensitive)
2. Ensure image exists in `/public/images/` directory
3. Verify file permissions
4. Check browser dev tools for 404 errors

### Poor Performance

1. Reduce image file sizes
2. Use modern formats (WebP/AVIF)
3. Implement proper `sizes` attribute
4. Use lazy loading for non-critical images

### Development vs Production

- Images work differently in development vs production
- Test image loading in both environments
- Consider CDN for production deployments

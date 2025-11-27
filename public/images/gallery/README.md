# Gallery Images Guide

This directory contains images for the website galleries displayed on the "Our Work" page.

## Directory Structure

```
gallery/
├── training-sessions/      # Training and educational photos
├── organic-harvest/        # Harvest and produce photos
├── community-events/       # Community gatherings and events
├── indigenous-trees/       # Tree planting and conservation
├── women-farmers/          # Women in agriculture
└── youth-training/         # Youth engagement programs
```

## How to Add Images

### Step 1: Prepare Your Images

**Recommended specifications:**
- **Format:** JPG or PNG
- **Dimensions:** 1200x900 pixels (4:3 aspect ratio) or similar
- **File size:** Under 1MB per image (compressed for web)
- **Naming:** Use descriptive names with hyphens (e.g., `farmer-training-session.jpg`)

**Image optimization tips:**
- Use tools like TinyPNG, ImageOptim, or Squoosh to compress images
- Keep file sizes reasonable for faster loading
- Ensure images are clear and well-lit

### Step 2: Add Images to the Correct Folder

Place your images in the appropriate category folder:

1. **Training Sessions** → `training-sessions/`
   - Classroom sessions
   - Field demonstrations
   - Workshops and seminars
   - Practical training activities

2. **Organic Harvest** → `organic-harvest/`
   - Fresh produce
   - Harvest activities
   - Crop varieties
   - Market-ready produce

3. **Community Events** → `community-events/`
   - Farmer meetings
   - Community celebrations
   - Group activities
   - Awards and recognition

4. **Indigenous Trees** → `indigenous-trees/`
   - Tree planting ceremonies
   - Tree nurseries
   - Mature trees on farms
   - Environmental conservation

5. **Women Farmers** → `women-farmers/`
   - Women at work in fields
   - Women-led initiatives
   - Empowerment activities
   - Success stories

6. **Youth Training** → `youth-training/`
   - Young farmers learning
   - Youth engagement programs
   - Innovation and technology
   - Next generation farmers

### Step 3: Update Gallery Configuration

After adding images, update the gallery data file:

**File:** `lib/galleryData.ts`

Find the appropriate category and add your image information:

```typescript
{
  id: 'unique-id',  // Use a unique identifier
  src: '/images/gallery/category-name/your-image.jpg',
  alt: 'Descriptive alt text for accessibility',
  title: 'Image Title',  // Optional
  description: 'Brief description of the image'  // Optional
}
```

**Example:**
```typescript
{
  slug: 'training-sessions',
  title: 'Training Sessions',
  description: 'Hands-on farmer education in the field',
  icon: FiBook,
  images: [
    {
      id: 'training-1',
      src: '/images/gallery/training-sessions/field-demonstration.jpg',
      alt: 'Farmer demonstrating organic pest control methods',
      title: 'Organic Pest Control Workshop',
      description: 'Farmers learning natural pest management techniques'
    },
    {
      id: 'training-2',
      src: '/images/gallery/training-sessions/group-session.jpg',
      alt: 'Group of farmers in training session',
      title: 'Community Training Day',
      description: 'Weekly training session with local farmers'
    },
    // Add more images here
  ]
}
```

### Step 4: Test Your Changes

1. Save your changes
2. Restart the development server if needed: `npm run dev`
3. Visit the gallery page: `http://localhost:3000/gallery/[category-slug]`
4. Check that images load correctly
5. Test the lightbox by clicking on images

## Image Guidelines

### Do's ✅
- Use high-quality, well-composed photos
- Show real farmers and genuine activities
- Include diverse representation (men, women, youth)
- Capture authentic moments
- Ensure people in photos have given consent
- Use images that tell a story

### Don'ts ❌
- Don't use stock photos (use authentic field photos)
- Avoid blurry or low-quality images
- Don't include images with visible branding (unless partner logos)
- Avoid images that misrepresent the work
- Don't use images without proper permissions

## Accessibility

Always include descriptive alt text for accessibility:

**Good alt text examples:**
- "Farmer examining organic tomato plants in greenhouse"
- "Group of women farmers harvesting vegetables"
- "Youth trainees learning about composting techniques"

**Avoid generic alt text:**
- "Image"
- "Photo"
- "Picture1"

## Image Management Tips

### Organizing Files
- Use consistent naming: `category-activity-number.jpg`
- Keep original high-res versions backed up separately
- Maintain a master list of images with credits/dates

### Regular Updates
- Add new images from recent activities
- Remove outdated or irrelevant images
- Update descriptions to reflect current programs
- Rotate featured images periodically

### Performance
- Aim for 10-20 images per gallery initially
- Can add more, but monitor page load times
- Consider lazy loading for large galleries (already implemented)

## Troubleshooting

### Images Not Showing?

1. **Check file path:** Ensure the path in `galleryData.ts` matches the actual file location
2. **Check file name:** File names are case-sensitive on some systems
3. **Check file format:** Use `.jpg`, `.jpeg`, or `.png`
4. **Clear browser cache:** Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. **Check console:** Open browser dev tools (F12) and look for errors

### Placeholder Showing Instead?

The gallery component shows a placeholder when:
- Image file doesn't exist at the specified path
- Image failed to load
- File path is incorrect

Check the image path and filename carefully.

## Questions?

If you need help adding images or updating galleries, contact the development team or refer to:
- Main documentation: `README.md`
- Client guide: `CLIENT_GUIDE.md`

---

**Last Updated:** 2025-11-07

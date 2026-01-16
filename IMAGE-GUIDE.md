# Adding Images to Your Scrollytelling Story

## Quick Start

**Add your images to:**
- Story images: `public/images/story/`
- Landing page map: `public/images/tuvalu-map.png`

The app is already configured to look for images in these locations.

## Required Images

You need **7 images** total, one for each chapter of the story:

| Filename | Chapter | Description |
|----------|---------|-------------|
| `01-paradise.jpg` | Life in Paradise | Opening scene: Sunrise over Tuvalu, peaceful atoll |
| `02-family.jpg` | The Family | Traditional Tuvaluan home or family portrait |
| `03-flooding.jpg` | The Rising Tide | High tide flooding, storm surge, water encroachment |
| `04-impact.jpg` | A Changing Home | Salt-damaged crops, eroded coastline, infrastructure damage |
| `05-treaty.jpg` | A New Hope | Community gathering or official announcement |
| `06-departure.jpg` | The Ballot | Emotional farewell scene, packed bags, looking back |
| `07-hope.jpg` | Looking Forward | New horizon, hopeful image of future |

## How to Add Images

1. **Get your images ready** (JPG, PNG, or WebP format)
2. **Rename them** according to the filenames above
3. **Copy them** into `public/images/story/`
4. **Refresh your browser** - they'll appear automatically!

## Image Specifications

- **Format**: JPG, PNG, or WebP
- **Recommended size**: 1920x1280px or larger
- **Aspect ratio**: 3:2 or 4:3 works well (landscape orientation)
- **File size**: Optimize for web (aim for under 500KB each)

## Example

```bash
public/
  images/
    story/
      01-paradise.jpg    ← Add your images here
      02-family.jpg
      03-flooding.jpg
      04-impact.jpg
      05-treaty.jpg
      06-departure.jpg
      07-hope.jpg
      README.md          ← Reference guide (already created)
```

## What Happens if Images are Missing?

If an image file doesn't exist yet, you'll see a placeholder with the filename. This helps you know which image to add.

## Customizing Image Names or Adding More Sections

If you want to use different filenames or add more story sections:

1. **Open** `src/App.jsx`
2. **Edit** the `storySections` array (starts at line 4)
3. **Change** the `visualSrc` path for any section
4. **Add** new sections by copying the existing format

Example:
```javascript
{
  id: 'new-section',
  title: 'Your Chapter Title',
  content: [
    'First paragraph of your story.',
    'Second paragraph of your story.',
  ],
  visualSrc: '/images/story/your-image-name.jpg',
  visualAlt: 'Description for accessibility',
}
```

## Editing Story Text

The story content is also in `src/App.jsx` in the `storySections` array. Each section has:
- `title` - The chapter heading
- `content` - Array of paragraphs (add as many as you need)
- `visualSrc` - Path to the image
- `visualAlt` - Image description for screen readers

## Landing Page Map

The landing page displays a map showing Tuvalu's location in the Pacific Ocean.

**Add this file:**
- **Filename**: `tuvalu-map.png`
- **Location**: `public/images/`
- **Content**: Map showing Tuvalu's location relative to Australia, Hawaii, and other Pacific landmarks
- **Recommended size**: 800x600px or larger (4:3 aspect ratio)

If the map image is missing, a placeholder will be shown.

## Need Help?

Check `public/images/story/README.md` for more details about image specifications.

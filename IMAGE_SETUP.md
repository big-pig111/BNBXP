# Image Setup Instructions

## Required Image Files

To use your custom images in the game, please prepare the following five image files:

1. **snake1.png** - Snake head image (square display)
2. **snake.png** - Snake body image (square display)
3. **snake4.png** - Snake tail image (circular display)
4. **snake2.png** - Food image (circular display)
5. **snake3.png** - Corpse food image (circular display)

## Image Requirements

- **Format**: PNG format (recommended)
- **Size**: Recommended square size between 32x32 to 64x64 pixels
- **Background**: Transparent background works best
- **Location**: Place in project root directory (same level as snake.html)

## File Structure

```
Project Root/
├── snake.html
├── admin.html
├── snake1.png    ← Snake head image (square)
├── snake.png     ← Snake body image (square)
├── snake4.png    ← Snake tail image (circular)
├── snake2.png    ← Food image (circular)
├── snake3.png    ← Corpse food image (circular)
└── ...
```

## Usage Instructions

1. Rename your five image files to:
   - `snake1.png` - For snake head (square display)
   - `snake.png` - For snake body (square display)
   - `snake4.png` - For snake tail (circular display)
   - `snake2.png` - For food (circular display)
   - `snake3.png` - For corpse food (circular display)

2. Place the files in the project root directory

3. Start the game, images will load automatically

## Image Effects

- **Snake Head Image**: Will automatically rotate based on movement direction, maintaining square display
- **Snake Body Image**: Maintains square display
- **Snake Tail Image**: Automatically cropped to circular display, will automatically rotate based on movement direction
- **Food Image**: Maintains original direction, automatically cropped to circular
- **Corpse Food Image**: Will have animation effects (rotation, scaling, swaying), automatically cropped to circular

## Display Methods

- **Snake Head**: Square display, maintains original image shape
- **Snake Body**: Square display, maintains original image shape
- **Snake Tail**: Circular crop display, will automatically rotate based on movement direction, follows body turns
- **Food and Corpse Food**: Circular crop display, maintains original glow and shadow effects

## Troubleshooting

If images don't display:

1. Check if filenames are correct (snake1.png, snake2.png, snake3.png)
2. Check if files are in the correct location (project root directory)
3. Check browser console for error messages
4. Ensure image format is PNG

## Backup Solution

If image loading fails, the game will automatically use default emoji expressions as backup display. 
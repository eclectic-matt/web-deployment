import numpy as np
from PIL import Image

# Initialize a 256x256 canvas with deep retro background
canvas_size = 256
# Color definitions (R, G, B)
BG = [29, 17, 53]       # Deep Purple
OUTLINE = [58, 34, 93]   # Dark Contour
SKIN = [239, 167, 167]   # Retro Skin Base
HL = [255, 246, 234]     # Highlight Cream
GOLD = [255, 213, 65]    # Gold Jewelry
GEM = [0, 240, 255]      # Cyan Gemstone

# Create canvas base filled with background color
data = np.full((canvas_size, canvas_size, 3), BG, dtype=np.uint8)

def draw_pixel_block(img, start_x, start_y, width, height, color):
    """Draws upscaled pixel blocks to maintain the chunky 8-bit retro style."""
    img[start_y:start_y+height, start_x:start_x+width] = color

def draw_single_hand(img, offset_x, is_left=True):
    """Draws a hand anatomy profile with rings and a wrist bracelet."""
    # 1. Wrist/Arm Base (Y: 190 to 256)
    for y in range(190, 256, 8):
        draw_pixel_block(img, offset_x + 32, y, 64, 8, SKIN)
        draw_pixel_block(img, offset_x + 24, y, 8, 8, OUTLINE)
        draw_pixel_block(img, offset_x + 96, y, 8, 8, OUTLINE)
    
    # 2. Gold Bracelet on Wrist (Y: 210 to 226)
    for y in range(210, 226, 8):
        draw_pixel_block(img, offset_x + 24, y, 80, 8, GOLD)
        # Add a cyan gem accent in the middle of the bracelet
        draw_pixel_block(img, offset_x + 60, y, 8, 8, GEM)

    # 3. Back of the Hand Main Palm (Y: 110 to 190)
    for y in range(110, 190, 8):
        draw_pixel_block(img, offset_x + 16, y, 96, 8, SKIN)
        # Delineate light shading on the left edge
        draw_pixel_block(img, offset_x + 24, y, 16, 8, HL)

    # Hand Side Contours
    for y in range(110, 190, 4):
        draw_pixel_block(img, offset_x + 12, y, 4, 4, OUTLINE)
        draw_pixel_block(img, offset_x + 112, y, 4, 4, OUTLINE)

    # 4. Four Fingers (Pinky, Ring, Middle, Index)
    # X starting offsets relative to hand base
    finger_x_positions = [20, 44, 68, 92]
    finger_heights = [50, 75, 85, 70] # Length of fingers climbing up

    for idx, fx in enumerate(finger_x_positions):
        f_top = 110 - finger_heights[idx]
        # Draw Finger Core
        for y in range(f_top, 110, 4):
            draw_pixel_block(img, offset_x + fx, y, 16, 4, SKIN)
            draw_pixel_block(img, offset_x + fx, y, 4, 4, HL) # Finger highlight
            draw_pixel_block(img, offset_x + fx - 4, y, 4, 4, OUTLINE) # Left Wall
            draw_pixel_block(img, offset_x + fx + 16, y, 4, 4, OUTLINE) # Right Wall
        # Fingertip Cap
        draw_pixel_block(img, offset_x + fx, f_top - 4, 16, 4, OUTLINE)

        # 5. Ring Placements (Put a shiny gold ring on the Ring Finger [index 1])
        if idx == 1:
            draw_pixel_block(img, offset_x + fx - 4, 80, 24, 6, GOLD)
            draw_pixel_block(img, offset_x + fx + 4, 80, 6, 6, GEM) # Ring Gemstone

    # 6. Thumb Projection
    thumb_dir = -16 if is_left else 112
    thumb_outline = -20 if is_left else 128
    for y in range(140, 175, 6):
        draw_pixel_block(img, offset_x + thumb_dir, y, 16, 6, SKIN)
        draw_pixel_block(img, offset_x + thumb_outline, y, 4, 6, OUTLINE)

# Render Left Hand and Right Hand with spacing
draw_single_hand(data, offset_x=12, is_left=True)
draw_single_hand(data, offset_x=116, is_left=False)

# Compile canvas into a final crisp image
img = Image.fromarray(data, 'RGB')
img.save('retro_pixel_hands.png')
print("Successfully generated 'retro_pixel_hands.png' in 256x256 resolution!")
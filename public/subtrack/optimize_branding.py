
from PIL import Image
import os

SOURCE_LOGO = "_static/logo/logo.png"
OUTPUT_DIR = "_static/favicons"
PUBLIC_DIR = "."

def optimize_logo():
    if not os.path.exists(SOURCE_LOGO):
        print(f"Error: {SOURCE_LOGO} not found.")
        return

    print(f"Processing {SOURCE_LOGO}...")
    img = Image.open(SOURCE_LOGO).convert("RGBA")
    
    # 1. TIGHT CROP
    # Get bounding box of non-zero alpha pixels
    bbox = img.getbbox()
    if bbox:
        print(f"  Did tight crop: {bbox}")
        img_cropped = img.crop(bbox)
    else:
        print("  Image is empty? Using original.")
        img_cropped = img

    # Verify if crop is square-ish. If not, center it in a square.
    width, height = img_cropped.size
    max_dim = max(width, height)
    
    # Create valid square canvas
    square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    offset = ((max_dim - width) // 2, (max_dim - height) // 2)
    square_img.paste(img_cropped, offset)
    
    # Add a tiny bit of padding (5%) so it doesn't touch edges in circle masks
    final_size = int(max_dim * 1.1)
    final_img = Image.new("RGBA", (final_size, final_size), (0, 0, 0, 0))
    offset = ((final_size - max_dim) // 2, (final_size - max_dim) // 2)
    final_img.paste(square_img, offset)
    
    # 2. GENERATE SIZES
    sizes = {
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
        "apple-touch-icon.png": 180,
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-48x48.png": 48
    }

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    icon_images = [] # For .ico

    for name, size in sizes.items():
        # High quality resize
        resized = final_img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save PNGs
        if "favicon" in name or "android" in name or "apple" in name:
            out_path = os.path.join(OUTPUT_DIR, name)
            resized.save(out_path)
            print(f"  Saved {name}")
            
            # Also save to public root if it's a favicon (for easy browser access)
            if "favicon" in name:
                 public_path = os.path.join(PUBLIC_DIR, name)
                 resized.save(public_path)

        if size <= 256: 
             icon_images.append(resized)

    # 3. GENERATE FAVICON.ICO
    # Combine 16, 32, 48, ... into one ico
    # Need to sort small to large or large to small? ICO usually stores multiple.
    # PIL saves all frames passed in 'append_images'.
    
    if icon_images:
        print("  Saving favicon.ico...")
        # Sort by size descending usually preferred or just passed list
        # We need the largest one as base, others appended?
        # PIL save: img.save(..., format='ICO', sizes=[(16,16), ...]) is not how it works exactly.
        # It's: img.save(fp, format='ICO', append_images=[...])
        
        # Check PIL documentation: The image object is one size, append_images has others.
        base_ico = icon_images[-1] # Largest
        others = icon_images[:-1]
        
        ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
        base_ico.save(ico_path, format="ICO", append_images=others)
        print("  Saved favicon.ico")

if __name__ == "__main__":
    optimize_logo()

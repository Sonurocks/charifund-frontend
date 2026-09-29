import os
from PIL import Image, ImageDraw

def process_gorkakhpur_logo_final(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {input_path}: {e}")
        return

    width, height = img.size
    pixels = img.load()
    
    def is_black(c):
        return c[0] < 30 and c[1] < 30 and c[2] < 30 and c[3] > 0
        
    # Find bounding box of non-black pixels
    min_x, max_x = width, 0
    min_y, max_y = height, 0
    has_non_black = False
    
    for y in range(height):
        for x in range(width):
            if not is_black(pixels[x, y]):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                has_non_black = True
                
    if not has_non_black:
        print("Image is entirely black?")
        return
        
    print(f"Bounding box: {min_x}, {min_y}, {max_x}, {max_y}")
    
    # Crop to bounding box
    img = img.crop((min_x, min_y, max_x + 1, max_y + 1))
    
    # Now flood-fill the corners of the cropped image to make the outer black transparent
    c_w, c_h = img.size
    c_pixels = img.load()
    
    stack = []
    # Seed corners
    for x in range(c_w):
        if is_black(c_pixels[x, 0]): stack.append((x, 0))
        if is_black(c_pixels[x, c_h-1]): stack.append((x, c_h-1))
    for y in range(c_h):
        if is_black(c_pixels[0, y]): stack.append((0, y))
        if is_black(c_pixels[c_w-1, y]): stack.append((c_w-1, y))
        
    visited = set(stack)
    
    while stack:
        x, y = stack.pop()
        r, g, b, a = c_pixels[x, y]
        c_pixels[x, y] = (r, g, b, 0)
        
        for nx, ny in [(x-1, y), (x+1, y), (x, y-1), (x, y+1)]:
            if 0 <= nx < c_w and 0 <= ny < c_h:
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    if is_black(c_pixels[nx, ny]):
                        stack.append((nx, ny))
                        
    # Add 5% padding
    w, h = img.size
    pad_x = int(w * 0.05)
    pad_y = int(h * 0.05)
    new_w = w + pad_x * 2
    new_h = h + pad_y * 2
    
    # Create white circular backing
    final_img = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
    # Make a white circle
    draw = ImageDraw.Draw(final_img)
    # The circle should enclose the logo tightly
    draw.ellipse((pad_x, pad_y, pad_x + w, pad_y + h), fill=(255, 255, 255, 255))
    
    # Paste the transparent logo on top of the white circle using the logo itself as a mask
    final_img.paste(img, (pad_x, pad_y), img)
    
    final_img.save(output_path, "WEBP", quality=100)
    print(f"Saved {output_path}")

def main():
    in_path = "public/assets/goldgym1.png" 
    out_path = "public/assets/goldgym3.webp"
    
    if os.path.exists(in_path):
        process_gorkakhpur_logo_final(in_path, out_path)
    else:
        print(f"File not found: {in_path}")

if __name__ == "__main__":
    main()

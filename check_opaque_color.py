from PIL import Image

def analyze_color(path):
    img = Image.open(path).convert("RGBA")
    pixels = list(img.getdata())
    # find max saturation for opaque pixels
    import colorsys
    max_s = 0
    for r, g, b, a in pixels:
        if a > 0:
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            if s > max_s:
                max_s = s
    print(f"{path} max non-transparent saturation : {max_s}")

logos = [
    "public/assets/furnishingshop.png",
    "public/assets/goldgym.png",
    "public/assets/jeewancharitable.png",
    "public/assets/skaeenglish.png",
    "public/assets/naval'sacademy.png",
    "public/assets/naval'sacademy.webp"
]
import os
for l in logos:
    if os.path.exists(l):
        analyze_color(l)
    else:
        print(f"Missing {l}")

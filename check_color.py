from PIL import Image

def analyze_color(path):
    img = Image.open(path).convert("HSV")
    pixels = list(img.getdata())
    # find max saturation
    max_s = max(p[1] for p in pixels)
    print(f"{path} max saturation (0-255): {max_s}")

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

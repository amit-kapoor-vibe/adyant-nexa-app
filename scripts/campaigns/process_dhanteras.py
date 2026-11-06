import os
from PIL import Image

raw_path = r'C:\Users\mi\.gemini\antigravity\brain\4b944d17-855a-4ba1-a3e0-183967dd2797\dhanteras_adyant_nexa_1793912833353.jpg'
logo_path = r'c:\Users\mi\AN\logo_svg_cropped.png'
out_dir = r'c:\Users\mi\AN\outputs\dhanteras'
os.makedirs(out_dir, exist_ok=True)

out_file_local = os.path.join(out_dir, 'dhanteras_white_theme_final.jpg')
out_file_brain = r'C:\Users\mi\.gemini\antigravity\brain\4b944d17-855a-4ba1-a3e0-183967dd2797\dhanteras_white_theme_final.jpg'

# Load raw image
img = Image.open(raw_path).convert('RGBA')

# Target 1080 x 1350 (ratio 4:5 = 0.8)
# Current: 896 x 1200 (ratio = 0.7466)
# To get exact 1080 x 1350 without distortion:
target_w, target_h = 1080, 1350
current_w, current_h = img.size

# Resize keeping aspect ratio, crop slightly top/bottom or fit
# 896 / 1200: width 896 * (1350/1200) = 1008 < 1080, so scale by width to 1080:
scale = target_w / current_w
new_w = target_w
new_h = int(current_h * scale)
img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Crop center or top to fit 1350
if new_h > target_h:
    top = (new_h - target_h) // 2
    img_final = img_resized.crop((0, top, target_w, top + target_h))
else:
    # If smaller, resize directly
    img_final = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Add Official Logo
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    # Resize logo appropriately (e.g. width 130px, proportional height)
    logo_target_w = 115
    logo_w, logo_h = logo.size
    logo_target_h = int(logo_h * (logo_target_w / logo_w))
    logo_resized = logo.resize((logo_target_w, logo_target_h), Image.Resampling.LANCZOS)

    # Position on top-left (e.g. x=75, y=55)
    # Check top-left background color to match or blend
    # Sample background around logo placement
    logo_x = 75
    logo_y = 55
    
    # Clean top-left logo placement
    img_final.paste(logo_resized, (logo_x, logo_y), logo_resized)
    print("Logo composited at:", logo_x, logo_y)

# Save as RGB JPEG
final_rgb = img_final.convert('RGB')
final_rgb.save(out_file_local, quality=98)
final_rgb.save(out_file_brain, quality=98)
print("Saved local:", out_file_local)
print("Saved brain:", out_file_brain)

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1350
bg_color = (11, 13, 17) # Deep Obsidian #0B0D11

# 1. Create Base Canvas
canvas = Image.new("RGBA", (W, H), bg_color)
draw = ImageDraw.Draw(canvas)

# 2. Add subtle luxury cobalt glow in the upper-center
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
# Subtle radial glow
glow_center = (W // 2, 420)
glow_draw.ellipse([glow_center[0] - 350, glow_center[1] - 300, glow_center[0] + 350, glow_center[1] + 300], fill=(0, 43, 127, 45))
glow = glow.filter(ImageFilter.GaussianBlur(120))
canvas = Image.alpha_composite(canvas, glow)
draw = ImageDraw.Draw(canvas)

# 3. Subtle grid lines / border frame (Architectural Swiss style)
frame_color = (255, 255, 255, 18)
draw.rectangle([60, 60, W - 60, H - 60], outline=frame_color, width=1)

# Subtle corner crosshairs
ch_len = 16
ch_color = (0, 110, 255, 180) # Cobalt highlight
corners = [(60, 60), (W - 60, 60), (60, H - 60), (W - 60, H - 60)]
for cx, cy in corners:
    dx = ch_len if cx == 60 else -ch_len
    dy = ch_len if cy == 60 else -ch_len
    draw.line([(cx, cy), (cx + dx, cy)], fill=ch_color, width=2)
    draw.line([(cx, cy), (cx, cy + dy)], fill=ch_color, width=2)

# 4. Fonts
font_path_title = r"C:\Windows\Fonts\bahnschrift.ttf"
font_path_mono = r"C:\Windows\Fonts\segoeui.ttf"

font_top_tag = ImageFont.truetype(font_path_mono, 20)
font_category = ImageFont.truetype(font_path_title, 24)
font_headline = ImageFont.truetype(font_path_title, 64)
font_sub = ImageFont.truetype(font_path_mono, 28)
font_footer = ImageFont.truetype(font_path_mono, 18)

# 5. Top Bar Metadata
top_tag_text = "[ ADYANT NEXA // AUTONOMOUS SALES INFRASTRUCTURE ]"
draw.text((W // 2, 105), top_tag_text, font=font_top_tag, fill=(142, 149, 165), anchor="mm")

# 6. Logo / Monogram placement
logo_path = r"c:\Users\mi\AN\Brand Identity\Cobalt Blue AN Geometric Monogram.png"
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    
    # Crop transparent / black borders if any, or resize
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
        
    target_width = 320
    ratio = target_width / float(logo.width)
    target_height = int(float(logo.height) * ratio)
    logo_resized = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Center logo
    logo_x = (W - target_width) // 2
    logo_y = 230
    canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)
    draw = ImageDraw.Draw(canvas)

# 7. Divider rule with cobalt pill
div_y = 650
draw.line([(120, div_y), (W - 120, div_y)], fill=(255, 255, 255, 22), width=1)
pill_w = 60
draw.line([(W // 2 - pill_w // 2, div_y), (W // 2 + pill_w // 2, div_y)], fill=(0, 110, 255), width=3)

# 8. Category Micro-Label
cat_text = "THE REAL ESTATE RESPONSE BOTTLENECK"
draw.text((W // 2, 710), cat_text, font=font_category, fill=(0, 150, 255), anchor="mm")

# 9. Hero Statement Headlines
line1 = "YOU DON'T HAVE A"
line2 = "LEAD PROBLEM."
line3 = "YOU HAVE A RESPONSE"
line4 = "GATE BOTTLENECK."

hl_start_y = 790
line_height = 70
draw.text((W // 2, hl_start_y), line1, font=font_headline, fill=(255, 255, 255), anchor="mm")
draw.text((W // 2, hl_start_y + line_height), line2, font=font_headline, fill=(0, 150, 255), anchor="mm")
draw.text((W // 2, hl_start_y + line_height * 2 + 15), line3, font=font_headline, fill=(255, 255, 255), anchor="mm")
draw.text((W // 2, hl_start_y + line_height * 3 + 15), line4, font=font_headline, fill=(255, 255, 255), anchor="mm")

# 10. Supporting Subtext Card
card_top = 1090
card_bottom = 1200
card_left = 120
card_right = W - 120
draw.rectangle([card_left, card_top, card_right, card_bottom], fill=(18, 22, 29), outline=(35, 42, 54), width=1)

sub_l1 = "78% of high-net-worth property inquiries go cold in 15 minutes."
sub_l2 = "Adyant Nexa qualifies investor BANT on WhatsApp in <30 seconds."
draw.text((W // 2, card_top + 33), sub_l1, font=font_sub, fill=(180, 190, 205), anchor="mm")
draw.text((W // 2, card_top + 77), sub_l2, font=font_sub, fill=(255, 255, 255), anchor="mm")

# 11. Bottom Technical Coordinates
footer_text = "SYSTEM ARCHITECTURE: ONLINE  //  BANT QUALIFICATION  //  ADYANTNEXA.COM"
draw.text((W // 2, 1260), footer_text, font=font_footer, fill=(95, 105, 120), anchor="mm")

# Save final
output_path = r"c:\Users\mi\AN\outputs\post_01\post_01_creative.png"
canvas.save(output_path, "PNG")
print("SUCCESS: Saved to", output_path)

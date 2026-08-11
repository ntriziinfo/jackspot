from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random


W, H = 1920, 1080
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "how_to_play_guide_full_16x9_v2.png"
OUT.parent.mkdir(parents=True, exist_ok=True)


FONT_BOLD = [
    r"C:\Windows\Fonts\meiryob.ttc",
    r"C:\Windows\Fonts\YuGothB.ttc",
    r"C:\Windows\Fonts\BIZ-UDGothicB.ttc",
    r"C:\Windows\Fonts\NotoSansJP-VF.ttf",
]
FONT_REGULAR = [
    r"C:\Windows\Fonts\meiryo.ttc",
    r"C:\Windows\Fonts\YuGothM.ttc",
    r"C:\Windows\Fonts\BIZ-UDGothicR.ttc",
    r"C:\Windows\Fonts\NotoSansJP-VF.ttf",
]


def font(size, bold=True):
    for path in (FONT_BOLD if bold else FONT_REGULAR):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_text(draw, xy, text, fnt, fill, stroke=0, stroke_fill=(0, 0, 0, 255), anchor=None):
    draw.text(xy, text, font=fnt, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill, anchor=anchor)


def draw_centered(draw, box, text, fnt, fill, stroke=0, stroke_fill=(0, 0, 0, 255)):
    x1, y1, x2, y2 = box
    tw, th = text_size(draw, text, fnt)
    draw_text(draw, (x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2), text, fnt, fill, stroke, stroke_fill)


def round_box(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_card(draw, box, step, title, fill=(10, 9, 18, 238)):
    x1, y1, x2, y2 = box
    round_box(draw, box, 28, fill, (255, 197, 56, 255), 4)
    round_box(draw, (x1 + 5, y1 + 5, x2 - 5, y1 + 82), 24, (104, 4, 18, 170))
    round_box(draw, (x1 + 22, y1 + 22, x1 + 104, y1 + 104), 41, (255, 211, 74, 255), (255, 255, 225, 255), 3)
    draw_centered(draw, (x1 + 22, y1 + 16, x1 + 104, y1 + 102), step, font(52), (42, 5, 10, 255))
    draw_text(draw, (x1 + 128, y1 + 24), title, font(42), (255, 255, 246, 255), 2, (62, 0, 8, 255))


def draw_key(draw, box, key, label, accent=(255, 211, 74, 255)):
    x1, y1, x2, y2 = box
    round_box(draw, box, 18, (245, 239, 221, 255), accent, 3)
    draw_centered(draw, (x1, y1 + 8, x2, y1 + 66), key, font(44), (32, 18, 25, 255))
    draw_centered(draw, (x1 + 6, y1 + 70, x2 - 6, y2 - 8), label, font(22), (52, 26, 32, 255))


def create_background():
    image = Image.new("RGB", (W, H), "#07040a")
    pixels = image.load()
    tl, tr, bl, br = rgb("#21030c"), rgb("#09040d"), rgb("#060209"), rgb("#321100")
    for y in range(H):
        ty = y / (H - 1)
        for x in range(W):
            tx = x / (W - 1)
            top = mix(tl, tr, tx)
            bottom = mix(bl, br, tx)
            base = mix(top, bottom, ty)
            dx, dy = (x - 1540) / 860, (y - 230) / 560
            glow = max(0, 1 - math.sqrt(dx * dx + dy * dy))
            pixels[x, y] = mix(base, (255, 172, 34), min(0.30, glow * 0.24))
    return image.convert("RGBA")


img = create_background()
fx = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d_fx = ImageDraw.Draw(fx)
for cx, cy, r, color in [
    (1560, 220, 430, (255, 31, 31, 70)),
    (235, 850, 360, (255, 198, 58, 46)),
    (1040, 940, 540, (0, 186, 255, 18)),
]:
    d_fx.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
img = Image.alpha_composite(img, fx.filter(ImageFilter.GaussianBlur(78)))
draw = ImageDraw.Draw(img)

random.seed(12)
for _ in range(150):
    x, y = random.randint(42, W - 42), random.randint(34, H - 34)
    a = random.randint(35, 115)
    r = random.choice([1, 1, 2, 2, 3])
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, random.randint(188, 234), random.randint(82, 158), a))

# Frame and header
round_box(draw, (42, 42, W - 42, H - 42), 34, None, (255, 198, 60, 255), 5)
round_box(draw, (56, 56, W - 56, H - 56), 26, None, (128, 23, 22, 210), 3)
round_box(draw, (94, 78, W - 94, 204), 22, (18, 8, 17, 225), (236, 34, 32, 230), 3)
draw.line((120, 204, W - 120, 204), fill=(255, 198, 60, 230), width=3)
draw_text(draw, (132, 100), "RISING! SLOT GUIDE", font(31), (255, 206, 76, 255), 1, (66, 20, 0, 255))
draw_text(draw, (132, 132), "遊び方ガイド", font(58), (255, 255, 248, 255), 3, (91, 8, 10, 255))
draw_text(draw, (1290, 123), "PLAY FLOW", font(54), (255, 209, 72, 255), 2, (55, 15, 0, 255))

# Cards
card1 = (112, 252, 912, 485)
card2 = (112, 520, 912, 916)
card3 = (980, 252, 1776, 485)
card4 = (980, 520, 1776, 916)

draw_card(draw, card1, "①", "URL・パスワード発行")
draw_card(draw, card2, "②", "着席後、プレイ")
draw_card(draw, card3, "③", "終了してデータ送信")
draw_card(draw, card4, "④", "チップ精算")

# Step 1
draw_text(draw, (168, 356), "ディーラーから", font(39), (255, 255, 250, 255), 2, (44, 0, 8, 255))
draw_text(draw, (168, 406), "スロットURLと", font(39), (255, 218, 80, 255), 2, (44, 0, 8, 255))
draw_text(draw, (168, 443), "利用パスワード発行", font(32), (255, 255, 250, 255), 2, (44, 0, 8, 255))
round_box(draw, (600, 394, 850, 446), 14, (246, 240, 218, 255), (255, 210, 70, 255), 2)
draw_text(draw, (627, 404), "URL + PASS", font(25), (41, 26, 31, 255))

# Step 2
round_box(draw, (610, 546, 760, 598), 16, (116, 9, 19, 255), (255, 211, 74, 255), 2)
draw_centered(draw, (610, 546, 760, 598), "AUTO", font(28), (255, 255, 246, 255))
draw_text(draw, (778, 554), "高速消化", font(32), (255, 255, 246, 255), 2, (52, 0, 8, 255))
draw_text(draw, (166, 632), "操作方法", font(42), (255, 224, 92, 255), 2, (50, 0, 6, 255))
draw_key(draw, (165, 700, 315, 820), "↑", "BET・START")
draw_key(draw, (330, 700, 480, 820), "←", "左停止")
draw_key(draw, (495, 700, 645, 820), "↓", "中停止")
draw_key(draw, (660, 700, 810, 820), "→", "右停止")
round_box(draw, (165, 842, 565, 898), 17, (245, 239, 221, 255), (255, 211, 74, 255), 3)
draw_centered(draw, (165, 842, 565, 898), "SPACE", font(32), (34, 20, 25, 255))
draw_text(draw, (590, 852), "BET・START・停止", font(34), (255, 255, 246, 255), 2, (52, 0, 8, 255))

# Step 3
draw_text(draw, (1036, 363), "終了時は画面右上の", font(44), (255, 255, 250, 255), 2, (44, 0, 8, 255))
round_box(draw, (1500, 354, 1662, 412), 17, (170, 13, 24, 255), (255, 211, 74, 255), 3)
draw_centered(draw, (1500, 354, 1662, 412), "終了", font(34), (255, 255, 248, 255), 1, (60, 0, 8, 255))
draw_text(draw, (1036, 426), "してデータ送信", font(48), (255, 224, 92, 255), 2, (44, 0, 8, 255))
draw.line((1670, 354, 1716, 316), fill=(255, 211, 74, 255), width=7)
draw.polygon([(1716, 316), (1682, 318), (1704, 344)], fill=(255, 211, 74, 255))

# Step 4
draw_text(draw, (1038, 644), "損益によって", font(48), (255, 255, 250, 255), 2, (44, 0, 8, 255))
draw_text(draw, (1038, 708), "カジノチップを", font(54), (255, 224, 92, 255), 2, (44, 0, 8, 255))
draw_text(draw, (1038, 778), "貰う・渡す", font(58), (255, 255, 250, 255), 2, (44, 0, 8, 255))
for i, (cx, cy, color) in enumerate(
    [
        (1540, 675, (230, 36, 38, 255)),
        (1610, 714, (255, 211, 74, 255)),
        (1505, 758, (42, 142, 255, 255)),
        (1645, 802, (34, 190, 113, 255)),
    ]
):
    draw.ellipse((cx - 42, cy - 42, cx + 42, cy + 42), fill=color, outline=(255, 255, 232, 255), width=5)
    draw.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(22, 15, 24, 255), outline=(255, 255, 232, 190), width=3)

draw_text(draw, (120, 970), "URLと利用パスワードを受け取ったら、着席してプレイ開始。終了時は必ずデータ送信まで行います。", font(34, False), (255, 239, 190, 240))

img = img.convert("RGB")
img.save(OUT, quality=95)
print(OUT)
print(f"{W}x{H}")

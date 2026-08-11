from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random


W, H = 1920, 1080
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "how_to_play_guide_full_16x9_v4.png"
CHIPS = ROOT / "outputs" / "casino_chips_cutout.png"
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


def rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def blend(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def text(draw, xy, content, size, fill, bold=True, stroke=0, stroke_fill=(0, 0, 0, 255), anchor=None):
    draw.text(xy, content, font=font(size, bold), fill=fill, stroke_width=stroke, stroke_fill=stroke_fill, anchor=anchor)


def centered(draw, box, content, size, fill, bold=True):
    x1, y1, x2, y2 = box
    draw.text(((x1 + x2) / 2, (y1 + y2) / 2), content, font=font(size, bold), fill=fill, anchor="mm")


def round_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def pill(draw, box, label, fill=(245, 239, 221, 255), outline=(255, 207, 73, 255), text_fill=(38, 25, 31, 255)):
    round_rect(draw, box, 17, fill, outline, 2)
    centered(draw, box, label, 24, text_fill, True)


def step_card(draw, box, number, title):
    global img
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 8, y1 + 10, x2 + 8, y2 + 10), radius=28, fill=(0, 0, 0, 115))
    img = Image.alpha_composite(img, shadow.filter(ImageFilter.GaussianBlur(10)))
    draw = ImageDraw.Draw(img)
    round_rect(draw, box, 26, (12, 10, 18, 238), (255, 198, 64, 255), 3)
    round_rect(draw, (x1 + 3, y1 + 3, x2 - 3, y1 + 74), 23, (104, 5, 19, 230))
    cx, cy = x1 + 64, y1 + 43
    draw.ellipse((cx - 38, cy - 38, cx + 38, cy + 38), fill=(255, 214, 78, 255), outline=(255, 255, 225, 255), width=3)
    # Anchor-based placement avoids the slight downward drift from bbox centering.
    draw.text((cx, cy - 2), number, font=font(42, True), fill=(42, 5, 10, 255), anchor="mm")
    text(draw, (x1 + 116, y1 + 20), title, 37, (255, 255, 250, 255), True, 2, (52, 0, 8, 255))
    return draw


def key_box(draw, box, key, label):
    x1, y1, x2, y2 = box
    round_rect(draw, box, 15, (245, 239, 221, 255), (255, 207, 73, 255), 3)
    centered(draw, (x1, y1 + 8, x2, y1 + 55), key, 39, (33, 22, 28, 255), True)
    centered(draw, (x1 + 3, y1 + 58, x2 - 3, y2 - 4), label, 19, (52, 28, 34, 255), True)


# Background
base = Image.new("RGB", (W, H), "#09050b")
px = base.load()
tl, tr, bl, br = rgb("#18040b"), rgb("#2b0706"), rgb("#05050a"), rgb("#271100")
for y in range(H):
    ty = y / (H - 1)
    for x in range(W):
        tx = x / (W - 1)
        c = blend(blend(tl, tr, tx), blend(bl, br, tx), ty)
        glow = max(0, 1 - math.sqrt(((x - 1550) / 920) ** 2 + ((y - 270) / 620) ** 2))
        px[x, y] = blend(c, (255, 171, 38), min(0.24, glow * 0.20))
img = base.convert("RGBA")
fx = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(fx)
for cx, cy, r, col in [(1590, 240, 410, (255, 40, 32, 52)), (245, 820, 300, (255, 205, 80, 34))]:
    fd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
img = Image.alpha_composite(img, fx.filter(ImageFilter.GaussianBlur(76)))
draw = ImageDraw.Draw(img)

random.seed(27)
for _ in range(85):
    x, y = random.randint(58, W - 58), random.randint(64, H - 58)
    r = random.choice([1, 1, 2])
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, random.randint(185, 232), random.randint(80, 152), random.randint(38, 100)))

# Frame / header
round_rect(draw, (44, 44, W - 44, H - 44), 32, None, (255, 199, 60, 255), 5)
round_rect(draw, (62, 62, W - 62, H - 62), 24, None, (125, 22, 22, 210), 3)
round_rect(draw, (102, 84, W - 102, 212), 22, (17, 8, 16, 232), (238, 35, 34, 230), 3)
draw.line((128, 212, W - 128, 212), fill=(255, 199, 60, 230), width=3)
text(draw, (138, 108), "RISING! SLOT GUIDE", 31, (255, 207, 78, 255), True, 1, (65, 18, 0, 255))
text(draw, (138, 142), "遊び方ガイド", 58, (255, 255, 248, 255), True, 3, (86, 8, 10, 255))
text(draw, (1315, 133), "PLAY FLOW", 52, (255, 209, 72, 255), True, 2, (55, 15, 0, 255))

# Japanese reading order: 1-2 on top, 3-4 below.
card1 = (112, 252, 890, 562)
card2 = (1004, 252, 1782, 562)
card3 = (112, 604, 890, 944)
card4 = (1004, 604, 1782, 944)

draw = step_card(draw, card1, "1", "ディーラーから発行")
draw = step_card(draw, card2, "2", "着席後、プレイ")
draw = step_card(draw, card3, "3", "終了してデータ送信")
draw = step_card(draw, card4, "4", "チップ精算")

# 1
text(draw, (166, 372), "スロットURLと", 39, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (166, 428), "利用パスワードを", 39, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
text(draw, (166, 480), "受け取る", 38, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
pill(draw, (600, 386, 842, 444), "URL + PASS")
text(draw, (166, 532), "ディーラーに声をかけて発行してもらいます。", 21, (255, 231, 176, 235), False)

# 2
pill(draw, (1485, 288, 1628, 338), "AUTO", (125, 9, 20, 255), (255, 207, 73, 255), (255, 255, 248, 255))
text(draw, (1648, 297), "高速消化", 29, (255, 255, 248, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 356), "操作方法", 34, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
key_box(draw, (1058, 430, 1208, 535), "↑", "BET・START")
key_box(draw, (1224, 430, 1374, 535), "←", "左停止")
key_box(draw, (1390, 430, 1540, 535), "↓", "中停止")
key_box(draw, (1556, 430, 1706, 535), "→", "右停止")
round_rect(draw, (1198, 350, 1440, 404), 16, (245, 239, 221, 255), (255, 207, 73, 255), 3)
centered(draw, (1198, 350, 1440, 404), "SPACE", 29, (34, 22, 28, 255), True)
text(draw, (1460, 360), "BET・START・停止", 25, (255, 255, 248, 255), True, 2, (48, 0, 8, 255))

# 3
text(draw, (166, 720), "画面右上の", 38, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (166, 778), "「終了」を押してデータ送信", 38, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
round_rect(draw, (650, 704, 810, 761), 18, (132, 9, 20, 255), (255, 207, 73, 255), 3)
centered(draw, (650, 704, 810, 761), "終了", 31, (255, 255, 248, 255), True)
draw.line((815, 702, 850, 670), fill=(255, 207, 73, 255), width=7)
draw.polygon([(850, 670), (818, 674), (840, 698)], fill=(255, 207, 73, 255))
text(draw, (166, 880), "終了処理が完了するまで画面を閉じないでください。", 25, (255, 231, 176, 245), False)

# 4
text(draw, (1058, 724), "損益によって", 42, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 790), "カジノチップを", 52, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 864), "貰う・渡す", 50, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
if CHIPS.exists():
    chips = Image.open(CHIPS).convert("RGBA")
    chips.thumbnail((400, 288), Image.Resampling.LANCZOS)
    chip_shadow = Image.new("RGBA", chips.size, (0, 0, 0, 0))
    alpha = chips.getchannel("A")
    chip_shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(8)))
    img.alpha_composite(chip_shadow, (1380, 688))
    img.alpha_composite(chips, (1360, 668))

text(draw, (120, 982), "URLと利用パスワードを受け取ったら、着席してプレイ開始。終了時は必ずデータ送信まで行います。", 29, (255, 239, 190, 240), False)

img.convert("RGB").save(OUT, quality=95)
print(OUT)
print(f"{W}x{H}")

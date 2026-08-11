from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random


W, H = 1920, 1080
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs" / "how_to_play_guide_full_16x9_v3.png"
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
            pass
    return ImageFont.load_default()


def rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def blend(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def text(draw, xy, content, size, fill, bold=True, stroke=0, stroke_fill=(0, 0, 0, 255)):
    draw.text(xy, content, font=font(size, bold), fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)


def centered(draw, box, content, size, fill, bold=True):
    f = font(size, bold)
    x1, y1, x2, y2 = box
    b = draw.textbbox((0, 0), content, font=f)
    tw, th = b[2] - b[0], b[3] - b[1]
    draw.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2), content, font=f, fill=fill)


def round_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_step_card(draw, box, number, title):
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1 + 8, y1 + 10, x2 + 8, y2 + 10), radius=26, fill=(0, 0, 0, 110))
    global img
    img = Image.alpha_composite(img, shadow.filter(ImageFilter.GaussianBlur(10)))
    draw = ImageDraw.Draw(img)
    round_rect(draw, box, 24, (12, 10, 18, 238), (255, 198, 64, 255), 3)
    round_rect(draw, (x1 + 3, y1 + 3, x2 - 3, y1 + 70), 22, (104, 5, 19, 230))
    draw.ellipse((x1 + 28, y1 + 22, x1 + 98, y1 + 92), fill=(255, 214, 78, 255), outline=(255, 255, 225, 255), width=3)
    centered(draw, (x1 + 28, y1 + 18, x1 + 98, y1 + 90), number, 42, (42, 5, 10, 255))
    text(draw, (x1 + 122, y1 + 22), title, 39, (255, 255, 250, 255), True, 2, (52, 0, 8, 255))
    return draw


def pill(draw, box, label, fill=(245, 239, 221, 255), outline=(255, 207, 73, 255), text_fill=(37, 25, 31, 255)):
    round_rect(draw, box, 17, fill, outline, 2)
    centered(draw, box, label, 26, text_fill, True)


def draw_key(draw, box, key, label):
    x1, y1, x2, y2 = box
    round_rect(draw, box, 16, (245, 239, 221, 255), (255, 207, 73, 255), 3)
    centered(draw, (x1, y1 + 8, x2, y1 + 58), key, 42, (33, 22, 28, 255), True)
    centered(draw, (x1 + 4, y1 + 64, x2 - 4, y2 - 8), label, 21, (52, 28, 34, 255), True)


# Background
img = Image.new("RGB", (W, H), "#09050b")
px = img.load()
tl, tr, bl, br = rgb("#19040b"), rgb("#2b0706"), rgb("#05050a"), rgb("#271100")
for y in range(H):
    ty = y / (H - 1)
    for x in range(W):
        tx = x / (W - 1)
        base = blend(blend(tl, tr, tx), blend(bl, br, tx), ty)
        glow = max(0, 1 - math.sqrt(((x - 1550) / 920) ** 2 + ((y - 270) / 620) ** 2))
        px[x, y] = blend(base, (255, 171, 38), min(0.24, glow * 0.20))
img = img.convert("RGBA")
fx = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(fx)
for cx, cy, r, col in [
    (1590, 240, 410, (255, 40, 32, 52)),
    (245, 820, 300, (255, 205, 80, 34)),
]:
    fd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
img = Image.alpha_composite(img, fx.filter(ImageFilter.GaussianBlur(76)))
draw = ImageDraw.Draw(img)

random.seed(21)
for _ in range(95):
    x, y = random.randint(58, W - 58), random.randint(64, H - 58)
    r = random.choice([1, 1, 2])
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, random.randint(185, 232), random.randint(80, 152), random.randint(42, 105)))

# Frame/header
round_rect(draw, (44, 44, W - 44, H - 44), 32, None, (255, 199, 60, 255), 5)
round_rect(draw, (62, 62, W - 62, H - 62), 24, None, (125, 22, 22, 210), 3)
round_rect(draw, (102, 84, W - 102, 212), 22, (17, 8, 16, 232), (238, 35, 34, 230), 3)
draw.line((128, 212, W - 128, 212), fill=(255, 199, 60, 230), width=3)
text(draw, (138, 108), "RISING! SLOT GUIDE", 31, (255, 207, 78, 255), True, 1, (65, 18, 0, 255))
text(draw, (138, 142), "遊び方ガイド", 58, (255, 255, 248, 255), True, 3, (86, 8, 10, 255))
text(draw, (1315, 133), "PLAY FLOW", 52, (255, 209, 72, 255), True, 2, (55, 15, 0, 255))

# Layout
card1 = (112, 258, 890, 462)
card2 = (112, 508, 890, 930)
card3 = (1004, 258, 1782, 462)
card4 = (1004, 508, 1782, 930)

draw = draw_step_card(draw, card1, "1", "ディーラーから発行")
draw = draw_step_card(draw, card2, "2", "着席後、プレイ")
draw = draw_step_card(draw, card3, "3", "終了時はデータ送信")
draw = draw_step_card(draw, card4, "4", "チップ精算")

# Step 1
text(draw, (165, 360), "スロットURLと", 35, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (165, 412), "利用パスワードを受け取る", 34, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
pill(draw, (610, 372, 838, 426), "URL + PASS")

# Step 2
text(draw, (166, 622), "操作方法", 40, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
pill(draw, (610, 548, 758, 600), "AUTO", (125, 9, 20, 255), (255, 207, 73, 255), (255, 255, 248, 255))
text(draw, (778, 558), "高速消化", 31, (255, 255, 248, 255), True, 2, (48, 0, 8, 255))
draw_key(draw, (165, 694, 315, 815), "↑", "BET・START")
draw_key(draw, (330, 694, 480, 815), "←", "左停止")
draw_key(draw, (495, 694, 645, 815), "↓", "中停止")
draw_key(draw, (660, 694, 810, 815), "→", "右停止")
round_rect(draw, (165, 842, 565, 900), 17, (245, 239, 221, 255), (255, 207, 73, 255), 3)
centered(draw, (165, 842, 565, 900), "SPACE", 32, (34, 22, 28, 255), True)
text(draw, (595, 854), "BET・START・停止", 33, (255, 255, 248, 255), True, 2, (48, 0, 8, 255))

# Step 3
text(draw, (1058, 355), "画面右上の「終了」を押して", 35, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 407), "データ送信まで行う", 38, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
# UI example separated from the sentence.
round_rect(draw, (1542, 336, 1708, 393), 18, (132, 9, 20, 255), (255, 207, 73, 255), 3)
centered(draw, (1542, 336, 1708, 393), "終了", 31, (255, 255, 248, 255), True)
draw.line((1714, 335, 1750, 302), fill=(255, 207, 73, 255), width=7)
draw.polygon([(1750, 302), (1718, 306), (1740, 330)], fill=(255, 207, 73, 255))
text(draw, (1546, 403), "右上ボタン", 24, (255, 229, 164, 255), False)

# Step 4
text(draw, (1058, 646), "損益によって", 42, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 712), "カジノチップを", 52, (255, 224, 92, 255), True, 2, (48, 0, 8, 255))
text(draw, (1058, 786), "貰う・渡す", 54, (255, 255, 250, 255), True, 2, (48, 0, 8, 255))
for cx, cy, col in [
    (1550, 680, (232, 36, 38, 255)),
    (1624, 725, (255, 211, 74, 255)),
    (1510, 762, (43, 142, 255, 255)),
    (1652, 805, (34, 190, 113, 255)),
]:
    draw.ellipse((cx - 42, cy - 42, cx + 42, cy + 42), fill=col, outline=(255, 255, 232, 255), width=5)
    draw.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(22, 15, 24, 255), outline=(255, 255, 232, 195), width=3)

text(draw, (120, 976), "URLと利用パスワードを受け取ったら、着席してプレイ開始。終了時は必ずデータ送信まで行います。", 33, (255, 239, 190, 240), False)

img.convert("RGB").save(OUT, quality=95)
print(OUT)
print(f"{W}x{H}")

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parent
BASE_IMAGE = (
    Path.home()
    / ".codex"
    / "generated_images"
    / "019f1b8e-b4bf-7772-868d-3143f83b9a44"
    / "ig_0602a161dc0e0b7f016a4aff2106d88191ade93da45f74586b.png"
)
OUT_IMAGE = ROOT / "outputs" / "rising_jackspot_reels_behind_glass.png"

SYMBOLS = {
    "seven": ROOT / "assets" / "symbols" / "sym_seven.png",
    "bar": ROOT / "assets" / "symbols" / "sym_bar.png",
    "bell": ROOT / "assets" / "symbols" / "sym_bell.png",
    "cherry": ROOT / "assets" / "symbols" / "sym_cherry.png",
    "grape": ROOT / "assets" / "symbols" / "sym_grape.png",
    "replay": ROOT / "assets" / "symbols" / "sym_replay.png",
    "piero": ROOT / "assets" / "cabinet" / "edit_parts" / "piero.png",
}


def load_symbol(name):
    symbol = Image.open(SYMBOLS[name]).convert("RGBA")
    bbox = symbol.getbbox()
    if bbox:
        symbol = symbol.crop(bbox)
    return symbol


def resize_contain(img, max_w, max_h):
    scale = min(max_w / img.width, max_h / img.height)
    size = (max(1, round(img.width * scale)), max(1, round(img.height * scale)))
    return img.resize(size, Image.Resampling.LANCZOS)


def paste_center(canvas, img, center, max_size, alpha=255):
    fitted = resize_contain(img, max_size[0], max_size[1])
    if alpha < 255:
        fitted = fitted.copy()
        fitted.putalpha(fitted.getchannel("A").point(lambda p: p * alpha // 255))
    x = round(center[0] - fitted.width / 2)
    y = round(center[1] - fitted.height / 2)
    canvas.alpha_composite(fitted, (x, y))


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(0.4))


def polygon_mask(size, points, blur=0.35):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(points, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(blur))


def reel_background(size):
    w, h = size
    bg = Image.new("RGBA", size, (226, 227, 222, 255))
    px = bg.load()
    for y in range(h):
        for x in range(w):
            side = abs((x / max(1, w - 1)) - 0.5) * 2
            vertical = abs((y / max(1, h - 1)) - 0.5) * 2
            shade = int(226 - side * 48 - vertical * 12)
            highlight = int(18 * (1 - side) + 8 * (1 - vertical))
            px[x, y] = (
                max(0, min(255, shade + highlight)),
                max(0, min(255, shade + highlight)),
                max(0, min(255, shade + highlight - 3)),
                255,
            )
    return bg


def add_column_depth(reel):
    w, h = reel.size
    overlay = Image.new("RGBA", reel.size, (0, 0, 0, 0))
    px = overlay.load()
    for y in range(h):
        for x in range(w):
            edge = abs((x / max(1, w - 1)) - 0.5) * 2
            top_bottom = abs((y / max(1, h - 1)) - 0.5) * 2
            dark = int(68 * (edge ** 1.8) + 16 * (top_bottom ** 2))
            light = int(16 * max(0, 1 - edge * 1.8) * max(0, 1 - top_bottom * 0.7))
            px[x, y] = (255, 255, 255, light) if light > dark else (0, 0, 0, dark)
    return Image.alpha_composite(reel, overlay.filter(ImageFilter.GaussianBlur(0.8)))


def make_reel_column(size, items):
    reel = reel_background(size)
    symbols = {name: load_symbol(name) for name in SYMBOLS}
    for name, y, max_w, max_h, alpha in items:
        paste_center(reel, symbols[name], (size[0] / 2, y), (max_w, max_h), alpha)
    return add_column_depth(reel)


def add_glass_overlay(img, window_box):
    x1, y1, x2, y2 = window_box
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (x1, y1, x2, y2),
        radius=18,
        outline=(255, 238, 150, 145),
        width=2,
    )
    draw.rounded_rectangle(
        (x1 + 3, y1 + 3, x2 - 3, y2 - 3),
        radius=15,
        outline=(40, 12, 4, 155),
        width=4,
    )
    draw.line((x1 + 18, y1 + 20, x2 - 70, y1 + 7), fill=(255, 255, 255, 68), width=4)
    draw.line((x1 + 42, y1 + 54, x2 - 100, y1 + 36), fill=(255, 255, 255, 34), width=2)
    draw.line((x1 + 18, y2 - 10, x2 - 32, y2 - 28), fill=(0, 0, 0, 80), width=5)
    return Image.alpha_composite(img, overlay)


def overlay_cabinet_front(base, img, visible_surfaces):
    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)

    # Put the original cabinet frame, separators, and lower lip back on top.
    draw.rounded_rectangle((268, 548, 747, 790), radius=20, fill=255)
    for surface in visible_surfaces:
        draw.polygon(surface, fill=0)
    draw.rounded_rectangle((427, 553, 440, 782), radius=5, fill=255)
    draw.rounded_rectangle((586, 553, 601, 782), radius=5, fill=255)
    draw.rounded_rectangle((270, 548, 747, 573), radius=18, fill=255)
    draw.rounded_rectangle((270, 765, 747, 790), radius=18, fill=255)
    draw.rectangle((268, 548, 291, 790), fill=255)
    draw.rectangle((727, 548, 747, 790), fill=255)

    foreground = base.copy()
    foreground.putalpha(mask.filter(ImageFilter.GaussianBlur(0.25)))
    return Image.alpha_composite(img, foreground)


def main():
    base = Image.open(BASE_IMAGE).convert("RGBA")
    if base.size != (1024, 1536):
        raise SystemExit(f"Unexpected base image size: {base.size}")

    result = base.copy()

    # Coordinates are tuned to the existing generated cabinet image.
    columns = [
        (
            ((292, 572), (423, 765)),
            [(4, 3), (128, 2), (128, 190), (2, 187)],
            [("seven", 58, 100, 50, 255), ("bar", 116, 102, 44, 255), ("cherry", 180, 94, 66, 255)],
        ),
        (
            ((444, 562), (582, 770)),
            [(3, 3), (135, 1), (134, 204), (2, 206)],
            [("bell", 8, 96, 54, 150), ("grape", 72, 104, 62, 255), ("bell", 132, 104, 66, 255), ("replay", 191, 104, 54, 255)],
        ),
        (
            ((606, 572), (728, 766)),
            [(3, 2), (119, 3), (117, 190), (2, 192)],
            [("bar", 55, 104, 44, 255), ("cherry", 119, 98, 68, 255), ("piero", 181, 84, 74, 255)],
        ),
    ]

    strip_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    visible_surfaces = []
    for box, local_surface, items in columns:
        (x1, y1), (x2, y2) = box
        w, h = x2 - x1, y2 - y1
        reel = make_reel_column((w, h), items)
        mask = polygon_mask((w, h), local_surface)
        reel.putalpha(mask)
        strip_layer.alpha_composite(reel, (x1, y1))
        visible_surfaces.append([(x1 + x, y1 + y) for x, y in local_surface])

    result = Image.alpha_composite(result, strip_layer)
    result = overlay_cabinet_front(base, result, visible_surfaces)
    result = add_glass_overlay(result, (275, 554, 742, 786))

    # Very light contrast lift keeps inserted PNGs from looking flat behind glass.
    rgb = result.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.015)

    OUT_IMAGE.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(OUT_IMAGE, quality=96)
    print(OUT_IMAGE)


if __name__ == "__main__":
    main()

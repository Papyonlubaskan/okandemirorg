#!/usr/bin/env python3
"""Görevimiz Vizyon okandemir.org — Instagram Reels video üretici."""
from __future__ import annotations

import math
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "instagram-videos"
ASSETS = ROOT / "public"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\Teknogenetik\ffmpeg\ffmpeg.exe"

W, H = 1080, 1920
FPS = 30

# Marka renkleri
BG_TOP = (15, 23, 42)       # slate-900
BG_BOT = (30, 58, 138)      # blue-800
ACCENT = (59, 130, 246)     # blue-500
GOLD = (250, 204, 21)       # vurgu
WHITE = (255, 255, 255)
MUTED = (191, 219, 254)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def gradient_bg(t: float, pulse: float = 0.0) -> Image.Image:
    """Hareketli gradient arka plan."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    shift = int(40 * math.sin(t * 2 * math.pi))
    for y in range(H):
        ratio = y / H
        r = int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * ratio + shift * 0.02)
        g = int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * ratio)
        b = int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * ratio + pulse * 20)
        draw.line([(0, y), (W, y)], fill=(max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b))))
    return img


def draw_speed_lines(draw: ImageDraw.ImageDraw, t: float, alpha: int = 80) -> None:
    """Aksiyon hareket çizgileri."""
    for i in range(12):
        x = int((i * 97 + t * 800) % (W + 200)) - 100
        y = 200 + i * 130
        draw.line([(x, y), (x + 180, y + 40)], fill=(ACCENT[0], ACCENT[1], ACCENT[2], alpha), width=3)


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = f"{current} {word}".strip()
        if font.getlength(test) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [text]


def draw_centered_text(
    img: Image.Image,
    lines: list[str],
    y_start: int,
    font: ImageFont.FreeTypeFont,
    fill: tuple,
    line_gap: int = 12,
    slide_x: int = 0,
    opacity: float = 1.0,
) -> None:
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    total_h = len(lines) * (font.size + line_gap)
    y = y_start - total_h // 2
    a = int(255 * max(0, min(1, opacity)))
    color = (*fill[:3], a) if len(fill) == 3 else fill
    for line in lines:
        tw = font.getlength(line)
        x = (W - tw) / 2 + slide_x
        # gölge
        draw.text((x + 3, y + 3), line, font=font, fill=(0, 0, 0, a // 2))
        draw.text((x, y), line, font=font, fill=color)
        y += font.size + line_gap
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def paste_profile(img: Image.Image, t: float, scale: float = 1.0) -> None:
    for name in ("okan-demir-profile.webp", "okan-about-photo.webp", "okan-demir-logo.png"):
        path = ASSETS / name
        if not path.exists():
            continue
        try:
            profile = Image.open(path).convert("RGBA")
            break
        except Exception:
            continue
    else:
        return
    size = int(420 * scale)
    profile = profile.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    profile.putalpha(mask)
    x = W // 2 - size // 2
    y = H // 2 - size // 2 - 80 + int(15 * math.sin(t * 4))
    img_rgba = img.convert("RGBA")
    img_rgba.paste(profile, (x, y), profile)
    img.paste(img_rgba.convert("RGB"))


def ease_out(t: float) -> float:
    return 1 - (1 - t) ** 3


def render_scene(frames: list[Image.Image], name: str) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{name}.mp4"
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        for i, frame in enumerate(frames):
            frame.save(tmp_path / f"frame_{i:04d}.png")
        cmd = [
            FFMPEG, "-y", "-framerate", str(FPS),
            "-i", str(tmp_path / "frame_%04d.png"),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            str(out),
        ]
        subprocess.run(cmd, check=True, capture_output=True)
    return out


def scene_hook(duration: float = 8.0) -> list[Image.Image]:
    """Sahne 1: Aşk filmi → Aksiyon twist."""
    texts = [
        (0.0, 2.5, "Bu bir aşk filmi olsaydı…", False, GOLD),
        (2.5, 5.0, "İki genç sevgili\nbir araya gelseydi.", False, WHITE),
        (5.0, 6.5, "Merak etmeyin…", True, MUTED),
        (6.5, 8.0, "BU BİR AKSİYON FİLMİ!", True, GOLD),
    ]
    n = int(duration * FPS)
    frames = []
    title_font = load_font(72, bold=True)
    sub_font = load_font(48)
    brand_font = load_font(36, bold=True)

    for i in range(n):
        t = i / n
        sec = i / FPS
        pulse = 0.5 + 0.5 * math.sin(sec * 6)
        img = gradient_bg(t, pulse).convert("RGBA")
        draw = ImageDraw.Draw(img)
        draw_speed_lines(draw, sec, 60)

        for start, end, text, bold, color in texts:
            if start <= sec < end:
                local = (sec - start) / (end - start)
                opacity = min(1.0, local * 4) if local < 0.25 else (1.0 if local < 0.75 else max(0, 1 - (local - 0.75) * 4))
                slide = int((1 - ease_out(min(1, local * 2))) * 80)
                font = title_font if bold and "AKSİYON" in text else (title_font if bold else sub_font)
                lines = text.split("\n")
                draw_centered_text(img.convert("RGB"), lines, H // 2, font, color, slide_x=-slide, opacity=opacity)
                break

        draw_brand = ImageDraw.Draw(img)
        draw_brand.text((W // 2 - 200, H - 120), "Görevimiz Vizyon", font=brand_font, fill=(*ACCENT, 200))
        draw_brand.text((W // 2 - 160, H - 75), "okandemir.org", font=brand_font, fill=WHITE)
        frames.append(img.convert("RGB"))
    return frames


def scene_okan_menu(duration: float = 10.0) -> list[Image.Image]:
    """Sahne 2: Okan usta + site menüsü."""
    menu = ["Anasayfa", "Projeler", "Hizmetler", "Blog", "Okan Demir Kimdir", "İletişim"]
    n = int(duration * FPS)
    frames = []
    title_font = load_font(56, bold=True)
    item_font = load_font(44, bold=True)
    sub_font = load_font(38)
    brand_font = load_font(34, bold=True)

    for i in range(n):
        sec = i / FPS
        t = i / n
        base = gradient_bg(t).convert("RGBA")
        draw = ImageDraw.Draw(base)
        draw_speed_lines(draw, sec * 1.5, 40)
        img = base.convert("RGB")

        if sec < 4:
            local = min(1, sec / 1.5)
            lines = wrap_text("Araya Okan usta giriyor.\nRakiplerden ayrılıyor.", sub_font, W - 120)
            draw_centered_text(img, lines, 380, title_font, WHITE, slide_x=int((1 - ease_out(local)) * -100), opacity=local)
            paste_profile(img, sec, 0.85 + 0.05 * math.sin(sec * 3))
        else:
            draw_centered_text(img, ["Nasıl mı?"], 280, title_font, GOLD, opacity=min(1, (sec - 4) * 2))
            d = ImageDraw.Draw(img)
            for j, item in enumerate(menu):
                appear = sec - 4.2 - j * 0.35
                if appear > 0:
                    op = min(1, appear * 3)
                    slide = int((1 - ease_out(min(1, appear * 2))) * 60)
                    y = 520 + j * 95
                    d.rounded_rectangle((120, y - 30, W - 120, y + 55), radius=16, fill=(ACCENT[0], ACCENT[1], ACCENT[2]))
                    d.text((140 + slide, y), item, font=item_font, fill=(255, 255, 255))

        d = ImageDraw.Draw(img)
        d.text((W // 2 - 160, H - 80), "okandemir.org", font=brand_font, fill=ACCENT)
        frames.append(img)
    return frames


def scene_motorcycle_projects(duration: float = 10.0) -> list[Image.Image]:
    """Sahne 3: Motorsiklet kovalamaca → Projeler."""
    services = [
        "Tamamlanan İşler", "Dijital Pazarlama", "WordPress Web Tasarımı",
        "Özel Web Tasarımı", "Dijital Dönüşüm", "Marka Kimliği", "SEO Optimizasyonu",
    ]
    n = int(duration * FPS)
    frames = []
    title_font = load_font(58, bold=True)
    item_font = load_font(36, bold=True)

    for i in range(n):
        sec = i / FPS
        t = i / n
        img = gradient_bg(t, 0.3 * math.sin(sec * 8)).convert("RGBA")
        draw = ImageDraw.Draw(img)
        # hız efekti — daha yoğun çizgiler
        for k in range(20):
            x = int((k * 53 + sec * 1200) % (W + 300)) - 150
            y = k * 95
            draw.line([(x, y), (x + 250, y + 60)], fill=(*ACCENT, 100), width=4)

        if sec < 3.5:
            op = min(1, sec / 1.2)
            shake = int(8 * math.sin(sec * 20)) if sec > 1 else 0
            img = img.convert("RGB")
            draw_centered_text(
                img,
                wrap_text("Motorsiklet kovalamaca!\nProjeler için…", title_font, W - 100),
                400, title_font, GOLD, slide_x=shake, opacity=op,
            )
        else:
            draw_centered_text(img.convert("RGB"), ["Niye mi?"], 220, title_font, WHITE, opacity=min(1, (sec - 3.5)))
            img = img.convert("RGB")
            for j, svc in enumerate(services):
                appear = sec - 4 - j * 0.3
                if appear > 0:
                    op = min(1, appear * 2.5)
                    x_off = int((1 - ease_out(min(1, appear * 1.5))) * (120 if j % 2 else -120))
                    y = 380 + j * 72
                    d = ImageDraw.Draw(img)
                    d.text((W // 2 - item_font.getlength(svc) / 2 + x_off, y), svc, font=item_font, fill=(int(255 * op), int(255 * op), int(255 * op)))

        frames.append(img.convert("RGB") if img.mode != "RGB" else img)
    return frames


def scene_blog_rooftop(duration: float = 7.0) -> list[Image.Image]:
    """Sahne 4: Çatı dövüşü → Blog."""
    n = int(duration * FPS)
    frames = []
    title_font = load_font(64, bold=True)
    sub_font = load_font(42)

    for i in range(n):
        sec = i / FPS
        t = i / n
        img = gradient_bg(t, 0.4)
        # çatı silüeti
        draw = ImageDraw.Draw(img)
        pts = [(0, 1400), (200, 900), (540, 1100), (880, 750), (1080, 950), (1080, 1920), (0, 1920)]
        draw.polygon(pts, fill=(10, 15, 30))
        draw_speed_lines(draw, sec * 2, 70)

        zoom = 1 + 0.08 * math.sin(sec * 3)
        if sec < 4:
            op = min(1, sec / 1.5)
            lines = wrap_text("Yüksek bir çatıda dövüş sahnesi…", title_font, W - 80)
            draw_centered_text(img, lines, 500, title_font, WHITE, opacity=op)
        else:
            op = min(1, (sec - 4) * 2)
            scale_text = int(72 * zoom)
            f = load_font(scale_text, bold=True)
            draw_centered_text(img, ["BLOG"], 600, f, GOLD, opacity=op)
            draw_centered_text(img, wrap_text("Dijital pazarlama rehberleri", sub_font, W - 100), 780, sub_font, MUTED, opacity=op)

        draw.text((W // 2 - 130, H - 90), "okandemir.org/blog", font=load_font(34, bold=True), fill=ACCENT)
        frames.append(img)
    return frames


def scene_superhero_hakkimda(duration: float = 7.0) -> list[Image.Image]:
    """Sahne 5: Süper kahraman → Hakkımda."""
    n = int(duration * FPS)
    frames = []
    title_font = load_font(56, bold=True)

    for i in range(n):
        sec = i / FPS
        t = i / n
        img = gradient_bg(t).convert("RGBA")
        # ışık huzmesi efekti
        draw = ImageDraw.Draw(img)
        cx = W // 2 + int(30 * math.sin(sec * 2))
        for r in range(0, 500, 20):
            alpha = max(0, 80 - r // 8)
            draw.ellipse((cx - r, 200 - r // 2, cx + r, 200 + r // 2), outline=(*GOLD, alpha))

        paste_profile(img.convert("RGB"), sec, 1.0 + 0.06 * math.sin(sec * 4))
        op = min(1, sec / 1.5)
        draw_centered_text(
            img.convert("RGB"),
            wrap_text("Süper kahraman sizi kurtarıyor!", title_font, W - 80),
            1050, title_font, GOLD, opacity=op,
        )
        if sec > 3:
            draw_centered_text(
                img.convert("RGB"),
                ["OKAN DEMİR KİMDİR?"],
                1280, load_font(48, bold=True), WHITE,
                opacity=min(1, (sec - 3) * 2),
            )
        frames.append(img.convert("RGB"))
    return frames


def scene_contact_cta(duration: float = 9.0) -> list[Image.Image]:
    """Sahne 6-7: İletişim + CTA."""
    n = int(duration * FPS)
    frames = []
    title_font = load_font(54, bold=True)
    cta_font = load_font(62, bold=True)

    for i in range(n):
        sec = i / FPS
        t = i / n
        pulse = 0.5 + 0.5 * math.sin(sec * 5)
        img = gradient_bg(t, pulse)
        draw = ImageDraw.Draw(img)

        if sec < 4:
            op = min(1, sec / 1.2)
            draw_centered_text(
                img,
                wrap_text("İletişim için iki grup karşı karşıya…", title_font, W - 80),
                450, title_font, WHITE, opacity=op,
            )
            draw_centered_text(
                img,
                ["Olacak da!"],
                650, load_font(72, bold=True), GOLD,
                opacity=min(1, max(0, (sec - 2) * 2)),
            )
        else:
            op = min(1, (sec - 4) / 1.5)
            draw_centered_text(
                img,
                wrap_text("Her günümüz bir aksiyon filmi.", title_font, W - 80),
                400, title_font, MUTED, opacity=op,
            )
            # nabız atan CTA kutusu
            box_w, box_h = 700, 120
            bx, by = (W - box_w) // 2, 700
            scale = 1 + 0.04 * math.sin(sec * 6)
            bw, bh = int(box_w * scale), int(box_h * scale)
            bxx = (W - bw) // 2
            draw.rounded_rectangle((bxx, by, bxx + bw, by + bh), radius=24, fill=ACCENT)
            draw_centered_text(img, ["BİZE ULAŞIN"], by + bh // 2, cta_font, WHITE, opacity=op)
            draw_centered_text(
                img,
                ["Harika Organizasyon", "Görevimiz Vizyon okandemir.org"],
                1000, load_font(40, bold=True), GOLD, opacity=op,
            )

        draw.text((W // 2 - 200, H - 130), "+90 555 267 77 39", font=load_font(36), fill=WHITE)
        draw.text((W // 2 - 180, H - 85), "info@okandemir.org", font=load_font(32), fill=MUTED)
        frames.append(img)
    return frames


def compile_trailer(scene_files: list[Path], out_name: str = "00-tanitim-filmi-tam") -> Path:
    """Tüm sahneleri tek videoda birleştir."""
    out = OUT_DIR / f"{out_name}.mp4"
    list_file = OUT_DIR / "concat_list.txt"
    with open(list_file, "w", encoding="utf-8") as f:
        for p in scene_files:
            f.write(f"file '{p.name}'\n")
    cmd = [
        FFMPEG, "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True, cwd=OUT_DIR)
    list_file.unlink(missing_ok=True)
    return out


def main() -> None:
    scenes = [
        ("01-hook-ask-aksiyon", scene_hook),
        ("02-okan-usta-menu", scene_okan_menu),
        ("03-motorsiklet-projeler", scene_motorcycle_projects),
        ("04-cati-blog", scene_blog_rooftop),
        ("05-super-kahraman-hakkimda", scene_superhero_hakkimda),
        ("06-iletisim-cta", scene_contact_cta),
    ]
    print("Instagram Reels videolari uretiliyor...")
    rendered: list[Path] = []
    for name, fn in scenes:
        print(f"  -> {name}")
        path = render_scene(fn(), name)
        rendered.append(path)
        print(f"     OK: {path}")

    full = compile_trailer(rendered)
    print(f"\nTam tanitim filmi: {full}")
    print(f"\nToplam {len(rendered) + 1} video: {OUT_DIR}")


if __name__ == "__main__":
    main()

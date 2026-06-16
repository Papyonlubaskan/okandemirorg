#!/usr/bin/env python3
"""
Görevimiz Vizyon okandemir.org — Sinematik kısa tanıtım filmi
Seslendirme (edge-tts) + animasyon + müzik + altyazı
"""
from __future__ import annotations

import asyncio
import math
import os
import shutil
import subprocess
import tempfile
import wave
from dataclasses import dataclass
from pathlib import Path

import edge_tts
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from moviepy import AudioFileClip, CompositeAudioClip, VideoFileClip

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "instagram-videos"
ASSETS = ROOT / "public"
TMP = OUT_DIR / "_render_tmp"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\Teknogenetik\ffmpeg\ffmpeg.exe"

W, H = 1080, 1920
FPS = 24
VOICE = "tr-TR-AhmetNeural"
VOICE_RATE = "-12%"
VOICE_PITCH = "-1Hz"

# Sinematik palet
BLACK = (0, 0, 0)
DEEP = (8, 12, 28)
NAVY = (12, 24, 58)
BLUE = (37, 99, 235)
GOLD = (251, 191, 36)
CREAM = (254, 243, 199)
WHITE = (255, 255, 255)
RED = (220, 38, 38)
PINK = (244, 114, 182)


@dataclass
class Scene:
    scene_id: str
    narration: str
    mood: str  # romantic | action | hero | chase | rooftop | power | finale
    punch_text: str | None = None


SCENES: list[Scene] = [
    Scene(
        "01",
        "Bu bir aşk filmi olsaydı. İki genç sevgili bir araya gelseydi. "
        "Romantik, bir o kadar heyecan verici olsaydı.",
        "romantic",
    ),
    Scene(
        "02",
        "Nasıl olurdu? Merak etmeyin… bu bir aksiyon filmi. "
        "Görevimiz Vizyon okandemir.org.",
        "action",
        "AKSİYON FİLMİ",
    ),
    Scene(
        "03",
        "Aksiyon sahnesi. İki husumetli kıyasıya dövüşüyor. "
        "Araya Okan usta giriyor, ayırıyor ve rakiplerinden ayrılıyor. "
        "Anasayfa, Projeler, Hizmetler, Blog, Okan Demir kimdir, İletişim.",
        "hero",
        "OKAN USTA",
    ),
    Scene(
        "04",
        "Motorsiklet kovalamacası. İki motor trafikte birbirini kovalıyor. "
        "Niye mi? Projeler için. Dijital pazarlama, web tasarım, dijital dönüşüm, "
        "marka kimliği ve SEO optimizasyonu.",
        "chase",
        "PROJELER",
    ),
    Scene(
        "05",
        "Yüksek bir çatıda dövüş sahnesi. Bir blog için. "
        "Okan Demir kimdir? Süper kahraman sizi kurtarıyor.",
        "rooftop",
        "BLOG",
    ),
    Scene(
        "06",
        "İletişim için iki grup karşı karşıya. Kıyasıya mücadele. "
        "Bu reklam filminden sonra her günümüz bir aksiyon filmi olacak.",
        "power",
        "İLETİŞİM",
    ),
    Scene(
        "07",
        "Bu tanıtım filmini izledikten sonra bize işler için ulaşın. "
        "Harika organizasyon. Görevimiz Vizyon okandemir.org.",
        "finale",
        "ULAŞIN",
    ),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    opts = [
        (r"C:\Windows\Fonts\segoeuib.ttf", bold),
        (r"C:\Windows\Fonts\segoeuib.ttf", True),
        (r"C:\Windows\Fonts\arialbd.ttf", bold),
        (r"C:\Windows\Fonts\arial.ttf", False),
    ]
    for path, is_bold in opts:
        if os.path.exists(path) and (bold == is_bold or bold):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                pass
    for path in [r"C:\Windows\Fonts\segoeuib.ttf", r"C:\Windows\Fonts\arialbd.ttf"]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def audio_duration(path: Path) -> float:
    with AudioFileClip(str(path)) as clip:
        return float(clip.duration)


async def synthesize_speech(text: str, out: Path) -> None:
    comm = edge_tts.Communicate(text, VOICE, rate=VOICE_RATE, pitch=VOICE_PITCH)
    await comm.save(str(out))


def apply_vignette(img: Image.Image, strength: float = 0.55) -> Image.Image:
    if not hasattr(apply_vignette, "_mask"):
        y, x = np.ogrid[:H, :W]
        dist = np.sqrt((x - W / 2) ** 2 + (y - H / 2) ** 2)
        apply_vignette._mask = (1 - strength * (dist / dist.max()) ** 1.4).astype(np.float32)
    arr = np.array(img, dtype=np.float32) * apply_vignette._mask[:, :, np.newaxis]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def apply_grain(img: Image.Image, seed: int, amount: float = 12) -> Image.Image:
    if seed % 2 == 1:
        return img
    rng = np.random.default_rng(seed)
    arr = np.array(img, dtype=np.float32)
    arr += rng.normal(0, amount, arr.shape)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def letterbox_bars(img: Image.Image, bar: int = 72) -> Image.Image:
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, bar), fill=BLACK)
    draw.rectangle((0, H - bar, W, H), fill=BLACK)
    return img


def load_portrait() -> Image.Image | None:
    for name in ("okan-demir-profile.webp", "okan-about-photo.webp", "okan-demir-logo.png"):
        p = ASSETS / name
        if p.exists():
            try:
                return Image.open(p).convert("RGBA")
            except Exception:
                continue
    return None


PORTRAIT = None


def get_portrait() -> Image.Image | None:
    global PORTRAIT
    if PORTRAIT is None:
        PORTRAIT = load_portrait()
    return PORTRAIT


def mood_gradient(mood: str, t: float, sec: float) -> Image.Image:
    pulse = 0.5 + 0.5 * math.sin(sec * 3)
    palettes = {
        "romantic": ((40, 10, 35), (90, 30, 70)),
        "action": ((20, 5, 5), (60, 10, 15)),
        "hero": (DEEP, NAVY),
        "chase": ((10, 15, 30), (20, 40, 80)),
        "rooftop": ((5, 8, 18), (15, 25, 45)),
        "power": ((25, 8, 8), (45, 15, 15)),
        "finale": (DEEP, (20, 45, 100)),
    }
    top, bot = palettes.get(mood, palettes["hero"])
    ys = np.arange(H, dtype=np.float32) / H
    r = top[0] + (bot[0] - top[0]) * ys + 20 * np.sin(t * 6 + ys * 3)
    g = top[1] + (bot[1] - top[1]) * ys
    b = top[2] + (bot[2] - top[2]) * ys + 15 * pulse
    col = np.stack([r, g, b], axis=1).clip(0, 255).astype(np.uint8)
    rgb = np.tile(col[:, np.newaxis, :], (1, W, 1))
    return Image.fromarray(rgb)


def draw_subtitle(img: Image.Image, text: str, alpha: float) -> None:
    if alpha <= 0.02 or not text:
        return
    font = load_font(34)
    lines = []
    words, line = text.split(), ""
    for w in words:
        test = f"{line} {w}".strip()
        if font.getlength(test) < W - 120:
            line = test
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    lines = lines[-2:]  # son 2 satır

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    bar_h = 36 + len(lines) * 42
    d.rectangle((40, H - 200 - bar_h, W - 40, H - 160), fill=(0, 0, 0, int(170 * alpha)))
    y = H - 195 - bar_h + 16
    for ln in lines:
        tw = font.getlength(ln)
        d.text(((W - tw) / 2, y), ln, font=font, fill=(255, 255, 255, int(255 * alpha)))
        y += 42
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_punch(img: Image.Image, text: str, scale: float, alpha: float, color=GOLD) -> None:
    if not text or alpha <= 0:
        return
    size = int(88 * scale)
    font = load_font(size, bold=True)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    tw = font.getlength(text)
    x, y = (W - tw) / 2, H * 0.38
    for dx, dy in [(3, 3), (-2, 2)]:
        d.text((x + dx, y + dy), text, font=font, fill=(0, 0, 0, int(120 * alpha)))
    d.text((x, y), text, font=font, fill=(*color, int(255 * alpha)))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_brand(img: Image.Image, alpha: float = 1.0) -> None:
    f = load_font(30, bold=True)
    d = ImageDraw.Draw(img)
    t = "GÖREVİMİZ VİZYON"
    tw = f.getlength(t)
    d.text(((W - tw) / 2, 110), t, font=f, fill=GOLD)
    f2 = load_font(26, bold=True)
    t2 = "okandemir.org"
    d.text(((W - f2.getlength(t2)) / 2, 150), t2, font=f2, fill=BLUE)


def paste_hero(img: Image.Image, sec: float, scale: float, glow: bool = True) -> None:
    portrait = get_portrait()
    if not portrait:
        return
    size = int(480 * scale)
    p = portrait.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    p.putalpha(mask)

    rgba = img.convert("RGBA")
    x = W // 2 - size // 2
    y = int(H * 0.42 - size // 2 + 12 * math.sin(sec * 2.5))

    if glow:
        glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_layer)
        gs = int(size * 1.15)
        gx, gy = W // 2 - gs // 2, y - 20
        gd.ellipse((gx, gy, gx + gs, gy + gs), fill=(59, 130, 246, 60))
        rgba = Image.alpha_composite(rgba, glow_layer)

    rgba.paste(p, (x, y), p)
    img.paste(rgba.convert("RGB"))


def motion_lines(img: Image.Image, sec: float, intensity: int = 16) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(intensity):
        spd = sec * (900 + i * 40)
        x = int((i * 71 + spd) % (W + 400)) - 200
        y = 180 + i * 95
        d.line([(x, y), (x + 280, y + 55)], fill=(255, 255, 255, 35), width=2)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def shake(offset: float) -> tuple[int, int]:
    if offset <= 0:
        return 0, 0
    return int(14 * offset * math.sin(offset * 40)), int(10 * offset * math.cos(offset * 33))


def render_frame(mood: str, sec: float, dur: float, scene: Scene, progress: float) -> Image.Image:
    t = sec / max(dur, 0.1)
    img = mood_gradient(mood, t, sec)

    # mood özel katmanlar
    if mood == "romantic":
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(ov)
        for i in range(8):
            px = int(W * (0.2 + 0.6 * math.sin(sec * 0.7 + i)))
            py = int(H * (0.3 + 0.4 * math.cos(sec * 0.5 + i * 2)))
            d.ellipse((px, py, px + 8, py + 8), fill=(255, 182, 193, 90))
        img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"))

    if mood in ("action", "chase", "power"):
        motion_lines(img, sec, 22 if mood == "chase" else 14)

    if mood == "rooftop":
        d = ImageDraw.Draw(img)
        pts = [(0, 1350), (180, 950), (500, 1150), (820, 800), (1080, 1000), (1080, H), (0, H)]
        d.polygon(pts, fill=(0, 0, 0))

    if mood in ("hero", "rooftop", "finale"):
        paste_hero(img, sec, 0.92 + 0.06 * math.sin(sec * 2))

    # punch text timing
    if scene.punch_text:
        punch_t = min(1.0, max(0, (sec - dur * 0.15) / 0.35))
        punch_alpha = min(1.0, punch_t * 2) * (1 - max(0, (sec - dur * 0.75) / 0.25))
        scale = 0.7 + 0.35 * min(1, punch_t * 1.5)
        if mood == "action":
            sx, sy = shake(punch_alpha)
            img = img.transform((W, H), Image.Transform.AFFINE, (1, 0, sx, 0, 1, sy))
        draw_punch(img, scene.punch_text, scale, punch_alpha)

    if mood == "finale" and sec > dur * 0.45:
        cta_a = min(1, (sec - dur * 0.45) / 0.4)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        bw, bh = 620, 100
        bx = (W - bw) // 2
        by = int(H * 0.72)
        pulse = 1 + 0.03 * math.sin(sec * 8)
        bbw, bbh = int(bw * pulse), int(bh * pulse)
        bxx = (W - bbw) // 2
        d.rounded_rectangle((bxx, by, bxx + bbw, by + bbh), radius=20, fill=(37, 99, 235, int(255 * cta_a)))
        img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))
        f = load_font(44, bold=True)
        d2 = ImageDraw.Draw(img)
        txt = "BİZE ULAŞIN"
        d2.text(((W - f.getlength(txt)) / 2, by + 24), txt, font=f, fill=WHITE)
        f3 = load_font(30)
        d2.text(((W - f3.getlength("+90 555 267 77 39")) / 2, H - 280), "+90 555 267 77 39", font=f3, fill=CREAM)

    sub_alpha = min(1.0, sec / 0.4) * (1 - max(0, (sec - dur + 0.3) / 0.3))
    draw_subtitle(img, scene.narration, sub_alpha * 0.92)
    draw_brand(img)

    # açılış flash
    if sec < 0.12 and mood == "action":
        flash = Image.new("RGB", (W, H), WHITE)
        img = Image.blend(img, flash, 1 - sec / 0.12)

    img = apply_vignette(img, 0.5)
    img = apply_grain(img, int(sec * 1000), 14)
    img = letterbox_bars(img)
    return img


def render_scene_video(scene: Scene, audio_path: Path, out_path: Path) -> float:
    dur = audio_duration(audio_path) + 0.2
    n = max(1, int(dur * FPS))
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for i in range(n):
            sec = i / FPS
            frame = render_frame(scene.mood, sec, dur, scene, i / n)
            frame.save(td_path / f"f_{i:05d}.png")
        subprocess.run(
            [
                FFMPEG, "-y", "-framerate", str(FPS),
                "-i", str(td_path / "f_%05d.png"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                str(out_path),
            ],
            check=True, capture_output=True,
        )
    return dur


def concat_scenes(parts: list[Path], out: Path) -> None:
    lst = out.parent / "concat.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.resolve().as_posix()}'\n")
    subprocess.run(
        [
            FFMPEG, "-y", "-f", "concat", "-safe", "0",
            "-i", str(lst),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-preset", "fast", "-crf", "20",
            "-movflags", "+faststart",
            str(out),
        ],
        check=True, capture_output=True,
    )
    lst.unlink(missing_ok=True)


def make_score(duration: float, out: Path) -> None:
    """Sinematik ambient + hafif gerilim."""
    subprocess.run(
        [
            FFMPEG, "-y",
            "-f", "lavfi", "-i", f"anoisesrc=d={duration}:c=pink:a=0.015",
            "-f", "lavfi", "-i", f"sine=f=55:d={duration}",
            "-f", "lavfi", "-i", f"sine=f=110:d={duration}",
            "-f", "lavfi", "-i", f"sine=f=164:d={duration}",
            "-filter_complex",
            "[1][2][3]amix=inputs=3:duration=first,volume=0.07[tones];"
            "[0][tones]amix=inputs=2:duration=first,"
            "lowpass=f=400,highpass=f=30,volume=0.35",
            "-c:a", "aac", "-b:a", "128k", str(out),
        ],
        check=True, capture_output=True,
    )


def merge_final(video: Path, narration: Path, score: Path, out: Path) -> None:
    mixed_path = out.parent / "_render_tmp" / "mixed_audio.m4a"
    with AudioFileClip(str(narration)) as narr:
        with AudioFileClip(str(score)) as bg:
            bg = bg.with_volume_scaled(0.45).subclipped(0, narr.duration)
            mixed = CompositeAudioClip([bg, narr])
            mixed.write_audiofile(str(mixed_path), codec="aac", bitrate="192k", logger=None)

    subprocess.run(
        [
            FFMPEG, "-y", "-i", str(video), "-i", str(mixed_path),
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-c:a", "aac", "-b:a", "192k",
            "-map", "0:v:0", "-map", "1:a:0", "-shortest",
            "-movflags", "+faststart", str(out),
        ],
        check=True, capture_output=True,
    )


async def generate_narration_tracks() -> list[Path]:
    TMP.mkdir(parents=True, exist_ok=True)
    paths = []
    for i, scene in enumerate(SCENES):
        p = TMP / f"voice_{i:02d}_{scene.scene_id}.mp3"
        print(f"  Seslendirme: {scene.scene_id}...")
        await synthesize_speech(scene.narration, p)
        paths.append(p)
    return paths


def combine_narration(parts: list[Path], out: Path) -> float:
    lst = TMP / "audio_concat.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.name}'\n")
    subprocess.run(
        [
            FFMPEG, "-y", "-f", "concat", "-safe", "0",
            "-i", str(lst), "-c:a", "aac", "-b:a", "192k", str(out),
        ],
        check=True, capture_output=True, cwd=TMP,
    )
    return audio_duration(out)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    print("=== Gorevimiz Vizyon — Sinematik Kisa Film ===\n", flush=True)

    voice_parts = sorted(TMP.glob("voice_*.mp3"))
    scene_videos = sorted(TMP.glob("scene_*.mp4"))

    if len(voice_parts) < len(SCENES):
        print("[1/4] Turkce seslendirme (AI)...", flush=True)
        voice_parts = asyncio.run(generate_narration_tracks())
    else:
        print("[1/4] Seslendirme mevcut, atlaniyor.", flush=True)

    if len(scene_videos) < len(SCENES):
        print("[2/4] Sahne videolari (animasyon)...", flush=True)
        scene_videos = []
        for scene, audio in zip(SCENES, voice_parts):
            out = TMP / f"scene_{scene.scene_id}.mp4"
            print(f"  Gorsel: {scene.scene_id} ({scene.mood})", flush=True)
            render_scene_video(scene, audio, out)
            scene_videos.append(out)
    else:
        print("[2/4] Sahne videolari mevcut, atlaniyor.", flush=True)
        scene_videos = sorted(TMP.glob("scene_*.mp4"))

    print("[3/4] Birlestirme + muzik...")
    raw = OUT_DIR / "_film_raw.mp4"
    concat_scenes(scene_videos, raw)

    full_narr = TMP / "narration_full.m4a"
    dur = combine_narration(voice_parts, full_narr)
    score = TMP / "score.m4a"
    make_score(dur + 1, score)

    final = OUT_DIR / "gorevimiz-vizyon-film.mp4"
    merge_final(raw, full_narr, score, final)

    # kopya: Downloads
    export = Path(r"C:\Users\Teknogenetik\Downloads\gorevimiz-vizyon-film.mp4")
    shutil.copy(final, export)

    print(f"\n[4/4] TAMAMLANDI")
    print(f"  Film: {final}")
    print(f"  Kopya: {export}")
    print(f"  Sure: ~{dur:.0f} saniye | 1080x1920 | Seslendirmeli")


if __name__ == "__main__":
    main()

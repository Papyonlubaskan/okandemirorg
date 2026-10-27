#!/usr/bin/env python3
"""
PHP güvenlik krizi — okandemir.org kurumsal Instagram Reels
Stil: generate-instagram-film.py (Görevimiz Vizyon)
"""
from __future__ import annotations

import math
import os
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from gtts import gTTS
from PIL import Image, ImageDraw, ImageFont
from moviepy import AudioFileClip, CompositeAudioClip

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "instagram-videos"
ASSETS = ROOT / "public"
WORK = OUT_DIR / "_php_crisis"
TMP = WORK / "_render_tmp"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\Teknogenetik\ffmpeg\ffmpeg.exe"

W, H = 1080, 1920
FPS = 24

BLACK = (0, 0, 0)
DEEP = (8, 12, 28)
NAVY = (12, 24, 58)
BLUE = (37, 99, 235)
GOLD = (251, 191, 36)
CREAM = (254, 243, 199)
WHITE = (255, 255, 255)
RED = (220, 38, 38)
MUTED = (191, 219, 254)

YT = "youtube.com/@PapyonluBaskan"
IG = "instagram.com/okandemirorg"
WEB = "okandemir.org"


@dataclass
class Scene:
    scene_id: str
    narration: str
    mood: str
    punch_text: str | None = None
    news_key: str | None = None  # aa | bbc | hurriyet


SCENES: list[Scene] = [
    Scene(
        "01",
        "Sekiz ay önce bir beyefendi PHP altyapılı bir web sitesi istedi. "
        "Verdiğim fiyatı beğenmedi.",
        "hook",
        "8 AY ÖNCE",
    ),
    Scene(
        "02",
        "Söylediğim söz şuydu: PHP altyapısında güvenlik açıklıkları her daim olur ve şu an var. "
        "Bu açıklıkların sürekli kapatılması gerekir. Zaman ve enerji harcanır. "
        "Site açıldığında her şey bitmiş değildir. Sürekli kontrol ve düzenleme gerekir.",
        "quote",
        "UYARI",
    ),
    Scene(
        "03",
        "Anlaşma olmadı.",
        "break",
        "ANLAŞMA YOK",
    ),
    Scene(
        "04",
        "Bugün ise tüm dünyada PHP üzerinden küresel bir kriz yaşanıyor. "
        "Devlet sitelerimiz dahil, bize ait her şey tehlike altında.",
        "crisis",
        "KÜRESEL KRİZ",
        "bbc",
    ),
    Scene(
        "05",
        "Siber Güvenlik Başkanlığı ulusal ölçekte tarama başlattı. "
        "Dünya genelinde birçok kurum sitesini geçici kapattı. "
        "PHP açıklarına karşı acil güncelleme çağrısı yapıldı.",
        "news",
        "SON DAKİKA",
        "aa",
    ),
    Scene(
        "06",
        "Doğru altyapı, doğru güvenlik. "
        "Takipte kalın. Görevimiz Vizyon okandemir.org.",
        "finale",
        "TAKİPTE KAL",
    ),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for path in (
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                pass
    return ImageFont.load_default()


def audio_duration(path: Path) -> float:
    with AudioFileClip(str(path)) as clip:
        return float(clip.duration)


def synthesize_speech(text: str, out: Path) -> None:
    gTTS(text, lang="tr", slow=False).save(str(out))


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
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, bar), fill=BLACK)
    d.rectangle((0, H - bar, W, H), fill=BLACK)
    return img


PORTRAIT = None


def get_portrait() -> Image.Image | None:
    global PORTRAIT
    if PORTRAIT is None:
        for name in ("okan-demir-profile.webp", "okan-about-photo.webp", "okan-demir-logo.png"):
            p = ASSETS / name
            if p.exists():
                try:
                    PORTRAIT = Image.open(p).convert("RGBA")
                    break
                except Exception:
                    continue
    return PORTRAIT


NEWS_CACHE: dict[str, Image.Image] = {}


def get_news(key: str) -> Image.Image | None:
    if key in NEWS_CACHE:
        return NEWS_CACHE[key]
    path = WORK / f"news_{key}.jpg"
    if path.exists():
        NEWS_CACHE[key] = Image.open(path).convert("RGB")
        return NEWS_CACHE[key]
    return None


def mood_gradient(mood: str, t: float, sec: float) -> Image.Image:
    pulse = 0.5 + 0.5 * math.sin(sec * 3)
    palettes = {
        "hook": (DEEP, NAVY),
        "quote": ((18, 10, 28), (40, 20, 55)),
        "break": ((30, 8, 8), (55, 12, 12)),
        "crisis": ((20, 5, 5), (70, 10, 15)),
        "news": ((8, 12, 28), (20, 35, 70)),
        "finale": (DEEP, (20, 45, 100)),
    }
    top, bot = palettes.get(mood, palettes["hook"])
    ys = np.arange(H, dtype=np.float32) / H
    r = top[0] + (bot[0] - top[0]) * ys + 15 * np.sin(t * 6 + ys * 3)
    g = top[1] + (bot[1] - top[1]) * ys
    b = top[2] + (bot[2] - top[2]) * ys + 12 * pulse
    col = np.stack([r, g, b], axis=1).clip(0, 255).astype(np.uint8)
    return Image.fromarray(np.tile(col[:, np.newaxis, :], (1, W, 1)))


def draw_subtitle(img: Image.Image, text: str, alpha: float) -> None:
    if alpha <= 0.02 or not text:
        return
    font = load_font(32)
    lines, line = [], ""
    for w in text.split():
        test = f"{line} {w}".strip()
        if font.getlength(test) < W - 120:
            line = test
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    lines = lines[-3:]

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    bar_h = 36 + len(lines) * 40
    d.rectangle((40, H - 210 - bar_h, W - 40, H - 160), fill=(0, 0, 0, int(175 * alpha)))
    y = H - 205 - bar_h + 14
    for ln in lines:
        tw = font.getlength(ln)
        d.text(((W - tw) / 2, y), ln, font=font, fill=(255, 255, 255, int(255 * alpha)))
        y += 40
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_punch(img: Image.Image, text: str, scale: float, alpha: float, color=GOLD) -> None:
    if not text or alpha <= 0:
        return
    size = int(78 * scale)
    font = load_font(size, bold=True)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    tw = font.getlength(text)
    x, y = (W - tw) / 2, H * 0.28
    for dx, dy in [(3, 3), (-2, 2)]:
        d.text((x + dx, y + dy), text, font=font, fill=(0, 0, 0, int(120 * alpha)))
    d.text((x, y), text, font=font, fill=(*color, int(255 * alpha)))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_brand(img: Image.Image) -> None:
    f = load_font(28, bold=True)
    d = ImageDraw.Draw(img)
    t = "GÖREVİMİZ VİZYON"
    d.text(((W - f.getlength(t)) / 2, 110), t, font=f, fill=GOLD)
    f2 = load_font(24, bold=True)
    t2 = WEB
    d.text(((W - f2.getlength(t2)) / 2, 148), t2, font=f2, fill=BLUE)


def paste_hero(img: Image.Image, sec: float, scale: float = 0.85) -> None:
    portrait = get_portrait()
    if not portrait:
        return
    size = int(420 * scale)
    p = portrait.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    p.putalpha(mask)
    rgba = img.convert("RGBA")
    x = W // 2 - size // 2
    y = int(H * 0.48 - size // 2 + 10 * math.sin(sec * 2.5))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gs = int(size * 1.12)
    gx, gy = W // 2 - gs // 2, y - 16
    gd.ellipse((gx, gy, gx + gs, gy + gs), fill=(37, 99, 235, 55))
    rgba = Image.alpha_composite(rgba, glow)
    rgba.paste(p, (x, y), p)
    img.paste(rgba.convert("RGB"))


def paste_news_card(img: Image.Image, key: str, sec: float, headline: str, source: str) -> None:
    news = get_news(key)
    if not news:
        return
    card_w, card_h = 920, 560
    # kenar kırp + cover
    nw, nh = news.size
    scale = max(card_w / nw, card_h / nh)
    resized = news.resize((int(nw * scale), int(nh * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - card_w) // 2
    top = (resized.height - card_h) // 2
    crop = resized.crop((left, top, left + card_w, top + card_h))

    # hafif zoom
    z = 1.0 + 0.04 * math.sin(sec * 1.2)
    zw, zh = int(card_w * z), int(card_h * z)
    zoomed = crop.resize((zw, zh), Image.Resampling.LANCZOS)
    zx, zy = (zw - card_w) // 2, (zh - card_h) // 2
    crop = zoomed.crop((zx, zy, zx + card_w, zy + card_h))

    rgba = img.convert("RGBA")
    card = Image.new("RGBA", (card_w + 16, card_h + 140), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, card_w + 15, card_h + 139), radius=22, fill=(0, 0, 0, 210))
    card.paste(crop.convert("RGBA"), (8, 8))

    # kırmızı şerit
    cd.rectangle((8, 8, 200, 52), fill=(*RED, 240))
    bf = load_font(22, bold=True)
    cd.text((22, 16), "SON DAKİKA", font=bf, fill=WHITE)

    # kaynak
    sf = load_font(22, bold=True)
    cd.text((220, 18), source, font=sf, fill=GOLD)

    # manşet
    hf = load_font(30, bold=True)
    words, lines, cur = headline.split(), [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if hf.getlength(test) < card_w - 40:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    y = card_h + 20
    for ln in lines[:3]:
        cd.text((24, y), ln, font=hf, fill=WHITE)
        y += 36

    cx = (W - card_w - 16) // 2
    cy = int(H * 0.32)
    rgba.paste(card, (cx, cy), card)
    img.paste(rgba.convert("RGB"))


def motion_lines(img: Image.Image, sec: float, intensity: int = 14) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(intensity):
        spd = sec * (900 + i * 40)
        x = int((i * 71 + spd) % (W + 400)) - 200
        y = 180 + i * 95
        d.line([(x, y), (x + 280, y + 55)], fill=(255, 255, 255, 35), width=2)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_social_finale(img: Image.Image, alpha: float) -> None:
    if alpha <= 0:
        return
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    rows = [
        ("YouTube", YT, (255, 0, 0)),
        ("Instagram", IG, (228, 64, 95)),
        ("Web", WEB, BLUE),
    ]
    # logo
    logo_path = WORK / "okandemir.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        lw = 160
        logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.Resampling.LANCZOS)
        lx = (W - lw) // 2
        ly = int(H * 0.38)
        # alpha on logo
        la = logo.copy()
        la.putalpha(la.getchannel("A").point(lambda v: int(v * alpha)))
        overlay.alpha_composite(la, (lx, ly))

    title_f = load_font(52, bold=True)
    title = "TAKİPTE KAL!"
    d.text(
        ((W - title_f.getlength(title)) / 2, int(H * 0.48)),
        title,
        font=title_f,
        fill=(*GOLD, int(255 * alpha)),
    )

    card_f = load_font(28, bold=True)
    handle_f = load_font(26)
    y0 = int(H * 0.56)
    for i, (label, handle, color) in enumerate(rows):
        y = y0 + i * 130
        d.rounded_rectangle((90, y, W - 90, y + 108), radius=20, fill=(15, 23, 42, int(220 * alpha)))
        d.ellipse((120, y + 24, 180, y + 84), fill=(*color, int(255 * alpha)))
        d.text((210, y + 22), label, font=card_f, fill=(*WHITE, int(255 * alpha)))
        d.text((210, y + 58), handle, font=handle_f, fill=(*MUTED, int(255 * alpha)))

    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def render_frame(mood: str, sec: float, dur: float, scene: Scene) -> Image.Image:
    t = sec / max(dur, 0.1)
    img = mood_gradient(mood, t, sec)

    if mood in ("crisis", "break"):
        motion_lines(img, sec, 18 if mood == "crisis" else 10)

    if mood == "hook":
        paste_hero(img, sec, 0.88)

    if mood == "quote":
        # alıntı kutusu
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        d.rounded_rectangle((70, 420, W - 70, 980), radius=24, fill=(0, 0, 0, 160))
        d.rectangle((70, 420, 86, 980), fill=(*GOLD, 230))
        qf = load_font(120, bold=True)
        d.text((100, 430), "“", font=qf, fill=(*GOLD, 200))
        img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))

    if mood == "crisis" and scene.news_key:
        paste_news_card(
            img,
            scene.news_key,
            sec,
            "PHP yazılımında kritik güvenlik açığı: devlet siteleri risk altında",
            "BBC News Türkçe",
        )

    if mood == "news" and scene.news_key:
        paste_news_card(
            img,
            scene.news_key,
            sec,
            "Siber Güvenlik Başkanlığı ulusal ölçekte tarama başlattı",
            "Anadolu Ajansı",
        )
        # ikinci haber küçük
        hur = get_news("hurriyet")
        if hur and sec > 1.0:
            tw, th = 420, 240
            nw, nh = hur.size
            sc = max(tw / nw, th / nh)
            r = hur.resize((int(nw * sc), int(nh * sc)), Image.Resampling.LANCZOS)
            r = r.crop(((r.width - tw) // 2, (r.height - th) // 2, (r.width - tw) // 2 + tw, (r.height - th) // 2 + th))
            rgba = img.convert("RGBA")
            frame = Image.new("RGBA", (tw + 12, th + 12), (0, 0, 0, 0))
            ImageDraw.Draw(frame).rounded_rectangle((0, 0, tw + 11, th + 11), radius=14, fill=(0, 0, 0, 200))
            frame.paste(r.convert("RGBA"), (6, 6))
            rgba.paste(frame, (W - tw - 70, int(H * 0.68)), frame)
            img.paste(rgba.convert("RGB"))

    if mood == "finale":
        paste_hero(img, sec, 0.55)
        a = min(1.0, max(0, (sec - dur * 0.25) / 0.5))
        draw_social_finale(img, a)

    if scene.punch_text and mood != "finale":
        punch_t = min(1.0, max(0, (sec - dur * 0.08) / 0.3))
        punch_alpha = min(1.0, punch_t * 2) * (1 - max(0, (sec - dur * 0.72) / 0.28))
        scale = 0.75 + 0.3 * min(1, punch_t * 1.5)
        color = RED if mood in ("crisis", "break", "news") else GOLD
        draw_punch(img, scene.punch_text, scale, punch_alpha, color)

    if mood == "finale" and scene.punch_text and sec < dur * 0.35:
        punch_t = min(1.0, sec / 0.25)
        draw_punch(img, scene.punch_text, 0.9 + 0.2 * punch_t, punch_t)

    sub_alpha = min(1.0, sec / 0.35) * (1 - max(0, (sec - dur + 0.35) / 0.35))
    draw_subtitle(img, scene.narration, sub_alpha * 0.95)
    draw_brand(img)

    if sec < 0.1 and mood in ("crisis", "break"):
        flash = Image.new("RGB", (W, H), WHITE if mood == "break" else RED)
        img = Image.blend(img, flash, 1 - sec / 0.1)

    img = apply_vignette(img, 0.52)
    img = apply_grain(img, int(sec * 1000), 13)
    img = letterbox_bars(img)
    return img


def render_scene_video(scene: Scene, audio_path: Path, out_path: Path) -> float:
    dur = audio_duration(audio_path) + 0.25
    n = max(1, int(dur * FPS))
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for i in range(n):
            frame = render_frame(scene.mood, i / FPS, dur, scene)
            frame.save(td_path / f"f_{i:05d}.png")
        subprocess.run(
            [
                FFMPEG, "-y", "-framerate", str(FPS),
                "-i", str(td_path / "f_%05d.png"),
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-movflags", "+faststart", str(out_path),
            ],
            check=True, capture_output=True,
        )
    return dur


def concat_scenes(parts: list[Path], out: Path) -> None:
    lst = out.parent / "concat_php.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.resolve().as_posix()}'\n")
    subprocess.run(
        [
            FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "fast", "-crf", "20",
            "-movflags", "+faststart", str(out),
        ],
        check=True, capture_output=True,
    )
    lst.unlink(missing_ok=True)


def make_score(duration: float, out: Path) -> None:
    subprocess.run(
        [
            FFMPEG, "-y",
            "-f", "lavfi", "-i", f"anoisesrc=d={duration}:c=pink:a=0.018",
            "-f", "lavfi", "-i", f"sine=f=48:d={duration}",
            "-f", "lavfi", "-i", f"sine=f=96:d={duration}",
            "-f", "lavfi", "-i", f"sine=f=147:d={duration}",
            "-filter_complex",
            "[1][2][3]amix=inputs=3:duration=first,volume=0.08[tones];"
            "[0][tones]amix=inputs=2:duration=first,"
            "lowpass=f=380,highpass=f=28,volume=0.38",
            "-c:a", "aac", "-b:a", "128k", str(out),
        ],
        check=True, capture_output=True,
    )


def merge_final(video: Path, narration: Path, score: Path, out: Path) -> None:
    mixed_path = TMP / "mixed_audio.m4a"
    with AudioFileClip(str(narration)) as narr:
        with AudioFileClip(str(score)) as bg:
            bg = bg.with_volume_scaled(0.4).subclipped(0, narr.duration)
            CompositeAudioClip([bg, narr]).write_audiofile(
                str(mixed_path), codec="aac", bitrate="192k", logger=None
            )
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


def generate_narration_tracks() -> list[Path]:
    TMP.mkdir(parents=True, exist_ok=True)
    paths = []
    for i, scene in enumerate(SCENES):
        p = TMP / f"voice_{i:02d}_{scene.scene_id}.mp3"
        print(f"  Seslendirme: {scene.scene_id}...", flush=True)
        synthesize_speech(scene.narration, p)
        paths.append(p)
    return paths


def combine_narration(parts: list[Path], out: Path) -> float:
    lst = TMP / "audio_concat.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.name}'\n")
    subprocess.run(
        [FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c:a", "aac", "-b:a", "192k", str(out)],
        check=True, capture_output=True, cwd=TMP,
    )
    return audio_duration(out)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    # önceki render cache temiz (bu proje için yeniden üret)
    for p in TMP.glob("voice_*.mp3"):
        p.unlink()
    for p in TMP.glob("scene_*.mp4"):
        p.unlink()

    print("=== PHP Krizi — okandemir.org Kurumsal Reels ===\n", flush=True)

    print("[1/4] Turkce seslendirme...", flush=True)
    voice_parts = generate_narration_tracks()

    print("[2/4] Sahne animasyonlari...", flush=True)
    scene_videos = []
    for scene, audio in zip(SCENES, voice_parts):
        out = TMP / f"scene_{scene.scene_id}.mp4"
        print(f"  Gorsel: {scene.scene_id} ({scene.mood})", flush=True)
        render_scene_video(scene, audio, out)
        scene_videos.append(out)

    print("[3/4] Birlestirme + muzik...", flush=True)
    raw = WORK / "_film_raw.mp4"
    concat_scenes(scene_videos, raw)

    full_narr = TMP / "narration_full.m4a"
    dur = combine_narration(voice_parts, full_narr)
    score = TMP / "score.m4a"
    make_score(dur + 1, score)

    final = OUT_DIR / "php-guvenlik-krizi-reels.mp4"
    merge_final(raw, full_narr, score, final)

    export = Path(r"C:\Users\Teknogenetik\Downloads\php-guvenlik-krizi-reels.mp4")
    shutil.copy(final, export)

    print(f"\n[4/4] TAMAMLANDI", flush=True)
    print(f"  Film: {final}", flush=True)
    print(f"  Kopya: {export}", flush=True)
    print(f"  Sure: ~{dur:.0f} sn | 1080x1920 | Seslendirmeli", flush=True)


if __name__ == "__main__":
    main()

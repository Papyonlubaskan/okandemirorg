#!/usr/bin/env python3
"""
PHP güvenlik — podcast / kurumsal reklam (TTS YOK)
Stil: soft audiogram + haber kartları + mevcut videodaki Takipte Kal outro
"""
from __future__ import annotations

import math
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "public" / "instagram-videos" / "_php_podcast"
ASSETS = ROOT / "public"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\Teknogenetik\ffmpeg\ffmpeg.exe"
BROLL = Path(
    r"C:\Users\Teknogenetik\.cursor\projects\c-Users-Teknogenetik-Downloads-zmiri-ilanlar-35\assets\podcast-studio-broll.mp4"
)
OUTRO = WORK / "outro.mp4"
EXPORT = Path(r"C:\Users\Teknogenetik\Downloads\php-guvenlik-podcast.mp4")
EXPORT_IG = Path(r"C:\Users\Teknogenetik\Downloads\php-guvenlik-podcast-IG.mp4")

W, H, FPS = 1920, 1080, 30

# segmentler: (başlık, gövde, süre, mood, news?)
SEGMENTS = [
    (
        "8 ay önce",
        "Bir beyefendi PHP altyapılı web sitesi istedi.\nVerdiğim fiyatı beğenmedi.",
        7.0,
        "open",
        None,
    ),
    (
        "Söylediğim söz",
        "PHP altyapısında güvenlik açıklıkları her daim olur — ve şu an var.\n"
        "Bu açıklar sürekli kapatılmalı; zaman ve enerji ister.\n"
        "Site açılınca her şey bitmez. Sürekli kontrol gerekir.",
        14.0,
        "quote",
        None,
    ),
    (
        "Sonuç",
        "Anlaşma olmadı.",
        4.0,
        "break",
        None,
    ),
    (
        "Bugün",
        "Tüm dünyada PHP üzerinden küresel bir kriz yaşanıyor.\n"
        "Devlet sitelerimiz dahil — bize ait her şey tehlike altında.",
        10.0,
        "crisis",
        "bbc",
    ),
    (
        "Türkiye",
        "Siber Güvenlik Başkanlığı ulusal ölçekte tarama başlattı.\n"
        "Kurumlara acil güvenlik duyurusu yapıldı.",
        9.0,
        "news",
        "aa",
    ),
    (
        "Doğru altyapı",
        "Güvenlik sonradan eklenmez — baştan tasarlanır.",
        5.5,
        "close",
        None,
    ),
]


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    paths = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def run(cmd: list) -> None:
    print(">", " ".join(str(c) for c in cmd)[:160], flush=True)
    subprocess.run(cmd, check=True, capture_output=True)


def soft_bg(t: float) -> Image.Image:
    """Koyu podcast stüdyo gradient."""
    ys = np.arange(H, dtype=np.float32) / H
    xs = np.arange(W, dtype=np.float32) / W
    grid_y, grid_x = np.meshgrid(ys, xs, indexing="ij")
    pulse = 0.5 + 0.5 * math.sin(t * 1.4)
    r = 10 + 8 * grid_y + 4 * pulse
    g = 12 + 10 * grid_y
    b = 22 + 28 * grid_y + 10 * (1 - grid_x) * pulse
    rgb = np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8)
    return Image.fromarray(rgb)


def vignette(img: Image.Image, strength: float = 0.45) -> Image.Image:
    if not hasattr(vignette, "mask"):
        y, x = np.ogrid[:H, :W]
        d = np.sqrt((x - W / 2) ** 2 + (y - H / 2) ** 2)
        vignette.mask = (1 - strength * (d / d.max()) ** 1.5).astype(np.float32)
    arr = np.array(img, dtype=np.float32) * vignette.mask[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def draw_waveform(draw: ImageDraw.ImageDraw, sec: float, cx: int, cy: int, bars: int = 48) -> None:
    for i in range(bars):
        h = int(18 + 55 * abs(math.sin(sec * 5.2 + i * 0.45)) * (0.55 + 0.45 * math.sin(sec * 2 + i)))
        x = cx - bars * 5 + i * 10
        draw.rounded_rectangle((x, cy - h, x + 6, cy + h), radius=3, fill=(96, 165, 250, 200))


PORTRAIT = None


def get_portrait() -> Image.Image:
    global PORTRAIT
    if PORTRAIT is None:
        for name in ("okan-demir-profile.webp", "okan-about-photo.webp"):
            p = ASSETS / name
            if p.exists():
                PORTRAIT = Image.open(p).convert("RGBA")
                break
    return PORTRAIT


def circle_portrait(size: int) -> Image.Image:
    p = get_portrait().resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(p, (0, 0))
    out.putalpha(mask)
    # ring
    ring = Image.new("RGBA", (size + 16, size + 16), (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((0, 0, size + 15, size + 15), outline=(251, 191, 36, 220), width=4)
    ring.paste(out, (8, 8), out)
    return ring


def news_panel(key: str, w: int, h: int) -> Image.Image | None:
    path = WORK / f"news_{key}.jpg"
    if not path.exists():
        path = ROOT / "public" / "instagram-videos" / "_php_crisis" / f"news_{key}.jpg"
    if not path.exists():
        return None
    img = Image.open(path).convert("RGB")
    nw, nh = img.size
    sc = max(w / nw, h / nh)
    r = img.resize((int(nw * sc), int(nh * sc)), Image.Resampling.LANCZOS)
    left, top = (r.width - w) // 2, (r.height - h) // 2
    crop = r.crop((left, top, left + w, top + h))
    panel = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
    ImageDraw.Draw(panel).rounded_rectangle((0, 0, w + 7, h + 7), radius=18, fill=(0, 0, 0, 180))
    panel.paste(crop.convert("RGBA"), (4, 4))
    return panel


def render_frame(title: str, body: str, sec: float, dur: float, mood: str, news: str | None) -> Image.Image:
    t = sec / max(dur, 0.01)
    img = soft_bg(sec).convert("RGBA")

    # sol portre + dalga
    por = circle_portrait(280)
    img.alpha_composite(por, (120, H // 2 - por.height // 2 - 40))
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    draw_waveform(d, sec, 260, H // 2 + 200)
    # podcast etiketi
    d.rounded_rectangle((140, 120, 420, 168), radius=20, fill=(37, 99, 235, 210))
    d.text((168, 128), "PODCAST · OKAN DEMİR", font=load_font(22, True), fill=(255, 255, 255, 255))
    img = Image.alpha_composite(img, ov)

    # sağ içerik kartı
    card = Image.new("RGBA", (1180, 720), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, 1179, 719), radius=28, fill=(8, 12, 24, 200))

    # eyebrow
    tf = load_font(28, True)
    cd.text((56, 48), title.upper(), font=tf, fill=(251, 191, 36, 255))

    # gövde
    bf = load_font(44, True)
    y = 120
    for line in body.split("\n"):
        # wrap
        words, cur = line.split(), ""
        wrapped = []
        for w_ in words:
            test = f"{cur} {w_}".strip()
            if bf.getlength(test) <= 1060:
                cur = test
            else:
                wrapped.append(cur)
                cur = w_
        if cur:
            wrapped.append(cur)
        for ln in wrapped:
            cd.text((56, y), ln, font=bf, fill=(248, 250, 252, 255))
            y += 62
        y += 18

    if mood == "quote":
        qf = load_font(90, True)
        cd.text((40, 20), "“", font=qf, fill=(251, 191, 36, 90))

    img.alpha_composite(card, (620, 160))

    if news:
        panel = news_panel(news, 520, 300)
        if panel:
            # fade in
            a = min(1.0, max(0, (sec - 0.6) / 0.8))
            if a > 0:
                p = panel.copy()
                p.putalpha(p.getchannel("A").point(lambda v: int(v * a)))
                img.alpha_composite(p, (W - panel.width - 80, H - panel.height - 70))

    # alt marka
    d2 = ImageDraw.Draw(img)
    mf = load_font(26, True)
    d2.text((80, H - 70), "okandemir.org", font=mf, fill=(148, 163, 184, 230))

    # fade in/out
    rgb = img.convert("RGB")
    rgb = vignette(rgb, 0.4)
    fade = min(1.0, sec / 0.5) * min(1.0, (dur - sec) / 0.45)
    if fade < 0.999:
        black = Image.new("RGB", (W, H), (0, 0, 0))
        rgb = Image.blend(black, rgb, fade)
    return rgb


def render_main(out: Path) -> float:
    total = sum(s[2] for s in SEGMENTS)
    n = int(total * FPS)
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        # segment sınırları
        edges = []
        acc = 0.0
        for seg in SEGMENTS:
            edges.append((acc, acc + seg[2], seg))
            acc += seg[2]

        for i in range(n):
            sec_abs = i / FPS
            for start, end, seg in edges:
                if start <= sec_abs < end - 1e-6 or (seg is SEGMENTS[-1] and sec_abs <= end):
                    title, body, dur, mood, news = seg
                    local = sec_abs - start
                    frame = render_frame(title, body, local, dur, mood, news)
                    frame.save(td_path / f"f_{i:05d}.png")
                    break
            if i % 60 == 0:
                print(f"  frame {i}/{n}", flush=True)

        run([
            FFMPEG, "-y", "-framerate", str(FPS),
            "-i", str(td_path / "f_%05d.png"),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
            "-movflags", "+faststart", str(out),
        ])
    return total


def make_score(duration: float, out: Path) -> None:
    # yumuşak podcast bed — düşük, robot ses yok
    run([
        FFMPEG, "-y",
        "-f", "lavfi", "-i", f"anoisesrc=d={duration}:c=brown:a=0.012",
        "-f", "lavfi", "-i", f"sine=f=65:d={duration}",
        "-f", "lavfi", "-i", f"sine=f=98:d={duration}",
        "-f", "lavfi", "-i", f"sine=f=130:d={duration}",
        "-filter_complex",
        "[1][2][3]amix=inputs=3:duration=first,volume=0.045[tones];"
        "[0]lowpass=f=280,volume=0.5[n];"
        "[n][tones]amix=inputs=2:duration=first,volume=0.55,"
        "afade=t=in:st=0:d=1.2,afade=t=out:st={0}:d=1.5".format(max(0.1, duration - 1.5)),
        "-c:a", "aac", "-b:a", "160k", str(out),
    ])


def mix_video_audio(video: Path, audio: Path, out: Path) -> None:
    run([
        FFMPEG, "-y", "-i", str(video), "-i", str(audio),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0", "-map", "1:a:0", "-shortest",
        "-movflags", "+faststart", str(out),
    ])


def prep_broll_loop(duration: float, out: Path) -> None:
    if not BROLL.exists():
        # düz siyah placeholder
        run([
            FFMPEG, "-y", "-f", "lavfi", "-i", f"color=c=0x0b1220:s={W}x{H}:d={duration}",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", str(out),
        ])
        return
    # b-roll'u arka plana soft overlay için scale et — ayrı katmanda kullanılacak
    run([
        FFMPEG, "-y", "-stream_loop", "-1", "-i", str(BROLL),
        "-t", f"{duration:.3f}",
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},eq=brightness=-0.08:saturation=0.85",
        "-an", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", str(out),
    ])


def overlay_broll(main: Path, broll: Path, out: Path) -> None:
    # b-roll %28 opacity arka plan
    run([
        FFMPEG, "-y", "-i", str(main), "-i", str(broll),
        "-filter_complex",
        "[1:v]format=rgba,colorchannelmixer=aa=0.28[bg];"
        "[0:v]format=rgba[fg];"
        "[bg][fg]overlay=0:0:format=auto,format=yuv420p",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-an", "-movflags", "+faststart", str(out),
    ])


def concat(parts: list[Path], out: Path) -> None:
    lst = WORK / "concat.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.resolve().as_posix()}'\n")
    run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out),
    ])


def normalize_outro(out: Path) -> None:
    run([
        FFMPEG, "-y", "-i", str(OUTRO),
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
               f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=0x0b0a14,fps={FPS},setsar=1",
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", str(out),
    ])


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    print("=== PHP Podcast kurumsal (TTS yok) ===", flush=True)

    main_silent = WORK / "main_silent.mp4"
    print("[1/5] Podcast sahneleri...", flush=True)
    dur = render_main(main_silent)

    broll = WORK / "broll_loop.mp4"
    print("[2/5] Stüdyo B-roll...", flush=True)
    prep_broll_loop(dur, broll)

    main_bg = WORK / "main_with_broll.mp4"
    print("[3/5] B-roll katmanı...", flush=True)
    overlay_broll(main_silent, broll, main_bg)

    score = WORK / "score.m4a"
    print("[4/5] Soft müzik (seslendirme yok)...", flush=True)
    make_score(dur + 0.3, score)
    main_audio = WORK / "main_audio.mp4"
    mix_video_audio(main_bg, score, main_audio)

    outro_n = WORK / "outro_norm.mp4"
    normalize_outro(outro_n)

    final = WORK / "php-guvenlik-podcast.mp4"
    print("[5/5] Outro birleştirme...", flush=True)
    concat([main_audio, outro_n], final)

    shutil.copy(final, EXPORT)
    # IG/Shorts dikey opsiyonel değil — kullanıcı podcast istedi, 16:9 master
    run([
        FFMPEG, "-y", "-i", str(final),
        "-c:v", "libx264", "-crf", "22", "-preset", "medium",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(EXPORT_IG),
    ])
    shutil.copy(EXPORT_IG, EXPORT)

    print("TAMAMLANDI", flush=True)
    print(f"  {EXPORT}", flush=True)
    print(f"  Sure ana + outro | TTS yok | outro = senin videondaki Takipte Kal karti", flush=True)


if __name__ == "__main__":
    main()

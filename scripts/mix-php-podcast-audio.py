#!/usr/bin/env python3
"""
Podcast ses: Piper (tr_TR-dfki-medium) + 888Hz techno
Müzik konuşmayı bastırmaz (sidechain ducking).
"""
from __future__ import annotations

import math
import os
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from piper import PiperVoice

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "public" / "instagram-videos" / "_php_podcast"
ASSETS = ROOT / "public"
FFMPEG = shutil.which("ffmpeg") or r"C:\Users\Teknogenetik\ffmpeg\ffmpeg.exe"
PIPER_MODEL = Path(r"C:\Users\Teknogenetik\Downloads\SesliKitaplar\piper_models\tr_TR-dfki-medium.onnx")
BROLL = Path(
    r"C:\Users\Teknogenetik\.cursor\projects\c-Users-Teknogenetik-Downloads-zmiri-ilanlar-35\assets\podcast-studio-broll.mp4"
)
OUTRO = WORK / "outro.mp4"
EXPORT = Path(r"C:\Users\Teknogenetik\Downloads\php-guvenlik-podcast.mp4")

W, H, FPS = 1920, 1080, 30

# Ekran başlığı + seslendirme metni (doğal konuşma)
SEGMENTS = [
    (
        "8 ay önce",
        "Sekiz ay önce bir beyefendi, PHP altyapılı bir web sitesi istedi. Verdiğim fiyatı beğenmedi.",
        "open",
        None,
    ),
    (
        "Söylediğim söz",
        "Söylediğim söz şuydu: PHP altyapısında güvenlik açıklıkları her daim olur, ve şu an var. "
        "Bu açıklıkların sürekli olarak kapatılması gerektiği için zaman ve enerji harcayacağım. "
        "Site açıldığı zaman her şey bitmiş değil, sürekli kontrol ve düzenleme gerekecektir.",
        "quote",
        None,
    ),
    (
        "Sonuç",
        "Anlaşma olmadı.",
        "break",
        None,
    ),
    (
        "Bugün",
        "Bugün ise tüm dünyada PHP üzerinden küresel bir kriz yaşanıyor. "
        "Devlet sitelerimiz dahil, bize ait her şey tehlike altında.",
        "crisis",
        "bbc",
    ),
    (
        "Türkiye",
        "Siber Güvenlik Başkanlığı ulusal ölçekte tarama başlattı. "
        "Kurumlara acil güvenlik duyurusu yapıldı. Birçok yerde siteler geçici kapatıldı.",
        "news",
        "aa",
    ),
    (
        "Doğru altyapı",
        "Doğru altyapı, doğru güvenlik. Güvenlik sonradan eklenmez, baştan tasarlanır.",
        "close",
        None,
    ),
]


def run(cmd: list) -> None:
    print(">", " ".join(str(c) for c in cmd)[:170], flush=True)
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    if r.returncode != 0:
        print(r.stderr[-800:], flush=True)
        raise RuntimeError(f"cmd failed: {cmd[0]}")


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for p in (
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


def synthesize_segments(voice: PiperVoice) -> list[tuple[str, str, str, str | None, Path, float]]:
    out_dir = WORK / "voice"
    out_dir.mkdir(parents=True, exist_ok=True)
    result = []
    for i, (title, text, mood, news) in enumerate(SEGMENTS):
        wav = out_dir / f"seg_{i:02d}.wav"
        print(f"  Ses: {i+1}/{len(SEGMENTS)} — {title}", flush=True)
        with wave.open(str(wav), "wb") as w:
            voice.synthesize_wav(text, w)
        # hafif podcast işleme: normalize + soft highpass
        clean = out_dir / f"seg_{i:02d}_clean.wav"
        run([
            FFMPEG, "-y", "-i", str(wav),
            "-af",
            "highpass=f=80,lowpass=f=9000,"
            "acompressor=threshold=-18dB:ratio=2.5:attack=8:release=120:makeup=2,"
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar", "48000", "-ac", "2", str(clean),
        ])
        dur = wav_duration(clean) + 0.55  # nefes payı
        result.append((title, text, mood, news, clean, dur))
    return result


def soft_bg(sec: float) -> Image.Image:
    ys = np.arange(H, dtype=np.float32) / H
    xs = np.arange(W, dtype=np.float32) / W
    grid_y, grid_x = np.meshgrid(ys, xs, indexing="ij")
    pulse = 0.5 + 0.5 * math.sin(sec * 1.4)
    r = 10 + 8 * grid_y + 4 * pulse
    g = 12 + 10 * grid_y
    b = 22 + 28 * grid_y + 10 * (1 - grid_x) * pulse
    return Image.fromarray(np.stack([r, g, b], axis=2).clip(0, 255).astype(np.uint8))


def vignette(img: Image.Image, strength: float = 0.4) -> Image.Image:
    if not hasattr(vignette, "mask"):
        y, x = np.ogrid[:H, :W]
        d = np.sqrt((x - W / 2) ** 2 + (y - H / 2) ** 2)
        vignette.mask = (1 - strength * (d / d.max()) ** 1.5).astype(np.float32)
    arr = np.array(img, dtype=np.float32) * vignette.mask[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


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
    ring = Image.new("RGBA", (size + 16, size + 16), (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((0, 0, size + 15, size + 15), outline=(251, 191, 36, 220), width=4)
    ring.paste(out, (8, 8), out)
    return ring


def draw_waveform(draw: ImageDraw.ImageDraw, sec: float, cx: int, cy: int, bars: int = 48) -> None:
    for i in range(bars):
        h = int(18 + 55 * abs(math.sin(sec * 5.2 + i * 0.45)) * (0.55 + 0.45 * math.sin(sec * 2 + i)))
        x = cx - bars * 5 + i * 10
        draw.rounded_rectangle((x, cy - h, x + 6, cy + h), radius=3, fill=(96, 165, 250, 200))


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


def body_lines(text: str, max_chars: int = 52) -> list[str]:
    """Ekranda okunabilir kısa satırlar."""
    words = text.replace("—", "-").split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        if len(test) <= max_chars:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render_frame(title: str, text: str, sec: float, dur: float, mood: str, news: str | None) -> Image.Image:
    img = soft_bg(sec).convert("RGBA")
    por = circle_portrait(280)
    img.alpha_composite(por, (120, H // 2 - por.height // 2 - 40))
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    draw_waveform(d, sec, 260, H // 2 + 200)
    d.rounded_rectangle((140, 120, 420, 168), radius=20, fill=(37, 99, 235, 210))
    d.text((168, 128), "PODCAST · OKAN DEMİR", font=load_font(22, True), fill=(255, 255, 255, 255))
    img = Image.alpha_composite(img, ov)

    card = Image.new("RGBA", (1180, 720), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, 1179, 719), radius=28, fill=(8, 12, 24, 200))
    cd.text((56, 48), title.upper(), font=load_font(28, True), fill=(251, 191, 36, 255))
    if mood == "quote":
        cd.text((40, 20), "“", font=load_font(90, True), fill=(251, 191, 36, 90))

    bf = load_font(38, True)
    y = 120
    for ln in body_lines(text, 48)[:10]:
        cd.text((56, y), ln, font=bf, fill=(248, 250, 252, 255))
        y += 52

    img.alpha_composite(card, (620, 160))

    if news:
        panel = news_panel(news, 520, 300)
        if panel:
            a = min(1.0, max(0, (sec - 0.5) / 0.7))
            if a > 0:
                p = panel.copy()
                p.putalpha(p.getchannel("A").point(lambda v: int(v * a)))
                img.alpha_composite(p, (W - panel.width - 80, H - panel.height - 70))

    ImageDraw.Draw(img).text((80, H - 70), "okandemir.org", font=load_font(26, True), fill=(148, 163, 184, 230))
    rgb = vignette(img.convert("RGB"), 0.4)
    fade = min(1.0, sec / 0.35) * min(1.0, (dur - sec) / 0.35)
    if fade < 0.999:
        rgb = Image.blend(Image.new("RGB", (W, H), (0, 0, 0)), rgb, fade)
    return rgb


def render_video(segs, out: Path) -> float:
    total = sum(s[5] for s in segs)
    n = int(total * FPS)
    edges = []
    acc = 0.0
    for seg in segs:
        edges.append((acc, acc + seg[5], seg))
        acc += seg[5]

    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for i in range(n):
            sec_abs = i / FPS
            for start, end, seg in edges:
                if start <= sec_abs < end - 1e-9 or (seg is segs[-1] and abs(sec_abs - end) < 1 / FPS):
                    title, text, mood, news, _, dur = seg
                    local = min(dur - 0.001, max(0, sec_abs - start))
                    render_frame(title, text, local, dur, mood, news).save(td_path / f"f_{i:05d}.png")
                    break
            if i % 90 == 0:
                print(f"  frame {i}/{n}", flush=True)
        run([
            FFMPEG, "-y", "-framerate", str(FPS), "-i", str(td_path / "f_%05d.png"),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
            "-movflags", "+faststart", str(out),
        ])
    return total


def concat_voice(segs, out: Path) -> None:
    lst = WORK / "voice_concat.txt"
    with open(lst, "w", encoding="utf-8") as f:
        for *_, wav, dur in segs:
            f.write(f"file '{wav.resolve().as_posix()}'\n")
            # pad silence to match visual gap
            # her seg wav'dan kısa olabilir — pad ile eşitle
    # pad her parçayı hedef süreye
    padded = []
    for i, (*rest, wav, dur) in enumerate(segs):
        p = WORK / "voice" / f"pad_{i:02d}.wav"
        run([
            FFMPEG, "-y", "-i", str(wav),
            "-af", f"apad=whole_dur={dur:.4f}",
            "-ar", "48000", "-ac", "2", str(p),
        ])
        padded.append(p)
    with open(lst, "w", encoding="utf-8") as f:
        for p in padded:
            f.write(f"file '{p.resolve().as_posix()}'\n")
    run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
        "-c:a", "pcm_s16le", str(out),
    ])


def make_888_techno(duration: float, out: Path) -> None:
    """888 Hz vurgulu techno bed — konuşmanın altında kalacak."""
    # kick benzeri pulse + 888 carrier + dark bass
    expr = (
        "0.22*sin(2*PI*55*t)*(0.55+0.45*(0.5+0.5*cos(2*PI*(128/60)*t)))"
        "+0.16*sin(2*PI*110*t)*(0.5+0.5*sin(2*PI*0.25*t))"
        "+0.10*sin(2*PI*165*t)"
        "+0.055*sin(2*PI*888*t)*(0.45+0.55*(0.5+0.5*cos(2*PI*(128/60)*t)))"
        "+0.03*sin(2*PI*1776*t)*(0.3+0.7*sin(2*PI*0.5*t))"
        "+0.04*sin(2*PI*(40+20*(0.5+0.5*sin(2*PI*0.08*t)))*t)"
    )
    run([
        FFMPEG, "-y",
        "-f", "lavfi", "-i", f"aevalsrc='{expr}|{expr}':s=48000:d={duration:.3f}",
        "-af",
        "aecho=0.7:0.55:45|90:0.18|0.12,"
        "lowpass=f=3200,highpass=f=35,"
        "acompressor=threshold=-20dB:ratio=3:attack=10:release=180,"
        "loudnorm=I=-24:TP=-3:LRA=8,"
        f"afade=t=in:d=1.2,afade=t=out:st={max(0.2, duration - 1.8):.3f}:d=1.6",
        "-ar", "48000", "-ac", "2", str(out),
    ])


def mix_ducked(voice: Path, music: Path, out: Path) -> None:
    """Konuşma önde; müzik sidechain ile bastırılır."""
    run([
        FFMPEG, "-y", "-i", str(voice), "-i", str(music),
        "-filter_complex",
        "[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=1.15[voice];"
        "[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=0.22[bg];"
        "[bg][voice]sidechaincompress=threshold=0.02:ratio=7:attack=8:release=280:makeup=1.1:mix=0.85[ducked];"
        "[voice][ducked]amix=inputs=2:duration=first:dropout_transition=0,"
        "alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5:LRA=11[a]",
        "-map", "[a]", "-c:a", "aac", "-b:a", "192k", str(out),
    ])


def overlay_broll(main: Path, out: Path, duration: float) -> None:
    if not BROLL.exists():
        shutil.copy(main, out)
        return
    broll = WORK / "broll_loop.mp4"
    run([
        FFMPEG, "-y", "-stream_loop", "-1", "-i", str(BROLL), "-t", f"{duration:.3f}",
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},eq=brightness=-0.08:saturation=0.85",
        "-an", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", str(broll),
    ])
    run([
        FFMPEG, "-y", "-i", str(main), "-i", str(broll),
        "-filter_complex",
        "[1:v]format=rgba,colorchannelmixer=aa=0.25[bg];"
        "[0:v]format=rgba[fg];"
        "[bg][fg]overlay=0:0:format=auto,format=yuv420p",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-an", str(out),
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
    print("=== Piper ses + 888Hz techno (ducking) ===", flush=True)

    print("[1/6] Piper neural seslendirme...", flush=True)
    voice = PiperVoice.load(str(PIPER_MODEL))
    segs = synthesize_segments(voice)

    print("[2/6] Video (süre = ses)...", flush=True)
    main_silent = WORK / "main_v2_silent.mp4"
    dur = render_video(segs, main_silent)

    print("[3/6] B-roll...", flush=True)
    main_bg = WORK / "main_v2_bg.mp4"
    overlay_broll(main_silent, main_bg, dur)

    print("[4/6] Ses birleştir + 888 techno...", flush=True)
    voice_full = WORK / "voice_full.wav"
    concat_voice(segs, voice_full)
    techno = WORK / "techno_888.wav"
    make_888_techno(dur + 0.5, techno)
    mixed = WORK / "mixed_audio.m4a"
    mix_ducked(voice_full, techno, mixed)

    print("[5/6] Video+ses...", flush=True)
    main_av = WORK / "main_v2_av.mp4"
    run([
        FFMPEG, "-y", "-i", str(main_bg), "-i", str(mixed),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0", "-map", "1:a:0", "-shortest",
        "-movflags", "+faststart", str(main_av),
    ])

    outro_n = WORK / "outro_norm.mp4"
    normalize_outro(outro_n)

    print("[6/6] Outro birleştir...", flush=True)
    final = WORK / "php-guvenlik-podcast.mp4"
    run([
        FFMPEG, "-y", "-i", str(main_av), "-i", str(outro_n),
        "-filter_complex", "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-crf", "20", "-preset", "fast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(final),
    ])
    shutil.copy(final, EXPORT)
    print("TAMAMLANDI", flush=True)
    print(f"  {EXPORT}", flush=True)
    print(f"  Ses: Piper tr_TR-dfki-medium | Muzik: 888Hz techno (ducked)", flush=True)


if __name__ == "__main__":
    main()

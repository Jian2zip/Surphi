"""YouTube collector – search YouTube for philosophy videos without an API key."""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

OUTPUT_DIR = Path("output/videos")


def sanitize_filename(name: str) -> str:
    """Return a filesystem-safe version of *name*.

    Args:
        name: Raw user-provided string.

    Returns:
        A safe filename string (without extension).
    """
    safe = "".join(c if c.isalnum() or c in " -_." else "_" for c in name)
    return safe.strip().replace(" ", "_")[:100]


def search_videos(query: str, limit: int = 10) -> list[dict]:
    """Search YouTube and return a list of video metadata dicts.

    Uses yt-dlp's flat extraction which does NOT download any media.

    Args:
        query: Search query string.
        limit: Maximum number of results to return.

    Returns:
        List of dicts with keys: id, title, channel, url, duration.
    """
    try:
        from yt_dlp import YoutubeDL  # local import to keep startup fast
    except ImportError:
        print(
            "yt-dlp is not installed. Run: pip install yt-dlp>=2026.02.21",
            file=sys.stderr,
        )
        sys.exit(1)

    ydl_opts: dict = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "skip_download": True,
        "ignoreerrors": True,
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
        },
    }

    search_url = f"ytsearch{limit}:{query}"
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(search_url, download=False)
    except Exception as exc:  # noqa: BLE001
        print(f"Error searching YouTube: {exc}", file=sys.stderr)
        sys.exit(1)

    if info is None:
        return []

    entries = info.get("entries") or []
    videos: list[dict] = []
    for entry in entries:
        if entry is None:
            continue
        videos.append(
            {
                "id": entry.get("id", ""),
                "title": entry.get("title", "Unknown"),
                "channel": entry.get("uploader") or entry.get("channel") or "Unknown",
                "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id', '')}",
                "duration": _fmt_duration(entry.get("duration")),
            }
        )
    return videos


def _fmt_duration(seconds: int | float | None) -> str:
    """Format a duration in seconds as MM:SS or HH:MM:SS.

    Args:
        seconds: Duration in seconds or None.

    Returns:
        Formatted string, or empty string if unknown.
    """
    if seconds is None:
        return ""
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    if h:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def save_results(query: str, videos: list[dict]) -> Path:
    """Save YouTube search results to a UTF-8 .txt file.

    Args:
        query: Original search query.
        videos: List of video metadata dicts.

    Returns:
        Path to the saved file.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = sanitize_filename(query) + ".txt"
    output_file = OUTPUT_DIR / filename
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    with output_file.open("w", encoding="utf-8") as fh:
        fh.write(f"YouTube Search Results: {query}\n")
        fh.write(f"Collected: {timestamp}\n")
        fh.write("=" * 60 + "\n\n")
        for i, video in enumerate(videos, 1):
            fh.write(f"{i}. {video['title']}\n")
            fh.write(f"   Channel: {video['channel']}\n")
            if video["duration"]:
                fh.write(f"   Duration: {video['duration']}\n")
            fh.write(f"   URL: {video['url']}\n\n")

    return output_file


def run(query: str, limit: int = 10) -> None:
    """Search YouTube for *query* and save the results to disk.

    Args:
        query: Search query string.
        limit: Maximum number of videos to collect.
    """
    print(f"Searching YouTube for '{query}' (limit={limit})...")
    videos = search_videos(query, limit)
    if not videos:
        print("No videos found.", file=sys.stderr)
        sys.exit(1)
    output_file = save_results(query, videos)
    print(f"Saved {len(videos)} video(s) to {output_file}")

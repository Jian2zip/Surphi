"""Discussion logger – append-only logs for discussions and research notes."""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

DISCUSSIONS_DIR = Path("output/discussions")
RESEARCH_LOGS_DIR = Path("output/research_logs")


def sanitize_filename(name: str) -> str:
    """Return a filesystem-safe version of *name*.

    Args:
        name: Raw user-provided string.

    Returns:
        A safe filename string (without extension).
    """
    safe = "".join(c if c.isalnum() or c in " -_." else "_" for c in name)
    return safe.strip().replace(" ", "_")[:100]


def log_discussion(topic: str, note: str) -> Path:
    """Append *note* to the discussion log for *topic*.

    A new file is created when the topic is encountered for the first time;
    subsequent calls append to the same file.

    Args:
        topic: Discussion topic (used for the filename).
        note: Discussion note text.

    Returns:
        Path to the log file.
    """
    DISCUSSIONS_DIR.mkdir(parents=True, exist_ok=True)
    filename = sanitize_filename(topic) + ".txt"
    output_file = DISCUSSIONS_DIR / filename
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    mode = "a" if output_file.exists() else "w"
    with output_file.open(mode, encoding="utf-8") as fh:
        if mode == "w":
            fh.write(f"Discussion Log: {topic}\n")
            fh.write("=" * 60 + "\n\n")
        fh.write(f"[{timestamp}]\n")
        fh.write(note.strip() + "\n\n")

    return output_file


def log_research(title: str, note: str) -> Path:
    """Append a research note to today's research log.

    Each calendar day gets its own file (``research_YYYY-MM-DD.txt``).
    Multiple calls on the same day append to the existing file.

    Args:
        title: Short title for the research note.
        note: Research note text.

    Returns:
        Path to the log file.
    """
    RESEARCH_LOGS_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    output_file = RESEARCH_LOGS_DIR / f"research_{date_str}.txt"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    mode = "a" if output_file.exists() else "w"
    with output_file.open(mode, encoding="utf-8") as fh:
        if mode == "w":
            fh.write(f"Research Log: {date_str}\n")
            fh.write("=" * 60 + "\n\n")
        fh.write(f"[{timestamp}] {title}\n")
        fh.write(note.strip() + "\n\n")

    return output_file


def run_discussion(topic: str, note: str) -> None:
    """CLI entry point: log a discussion note.

    Args:
        topic: Discussion topic.
        note: Note text.
    """
    if not topic.strip():
        print("Topic must not be empty.", file=sys.stderr)
        sys.exit(1)
    if not note.strip():
        print("Note must not be empty.", file=sys.stderr)
        sys.exit(1)
    output_file = log_discussion(topic, note)
    print(f"Discussion note logged to {output_file}")


def run_research(title: str, note: str) -> None:
    """CLI entry point: log a research note.

    Args:
        title: Note title.
        note: Note text.
    """
    if not title.strip():
        print("Title must not be empty.", file=sys.stderr)
        sys.exit(1)
    if not note.strip():
        print("Note must not be empty.", file=sys.stderr)
        sys.exit(1)
    output_file = log_research(title, note)
    print(f"Research note logged to {output_file}")

"""
Discussion logger — appends timestamped entries to per-topic discussion files.
"""

from __future__ import annotations

import pathlib
import sys
from datetime import datetime, timezone


# Base output directory; overridden in tests.
_OUTPUT_BASE: pathlib.Path = pathlib.Path("output") / "discussions"


def _sanitize_filename(name: str) -> str:
    """Replace characters unsafe for cross-platform filenames with underscores.

    Args:
        name: Raw filename candidate.

    Returns:
        Sanitized string safe for use in a filename on Windows/macOS/Linux.
    """
    import re
    safe = re.sub(r'[<>:"/\\|?*\x00-\x1f\s]', "_", name)
    safe = safe.strip("._")
    return safe or "untitled"


def log_discussion(topic: str, text: str) -> pathlib.Path:
    """Append a timestamped discussion entry to the topic's file.

    The file is created if it does not already exist.

    Args:
        topic: Discussion topic; used as the filename stem.
        text: Discussion content to record verbatim.

    Returns:
        The :class:`pathlib.Path` of the file that was written.
    """
    output_dir = _OUTPUT_BASE
    output_dir.mkdir(parents=True, exist_ok=True)

    safe_topic = _sanitize_filename(topic)
    filepath = output_dir / f"{safe_topic}.txt"

    timestamp = datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    entry = (
        f"\nTimestamp: {timestamp}\n"
        f"{'=' * 60}\n"
        f"{text}\n"
    )

    try:
        with filepath.open("a", encoding="utf-8") as fh:
            fh.write(entry)
    except OSError as exc:
        print(f"Error writing discussion log '{filepath}': {exc}", file=sys.stderr)
        raise

    return filepath


def append_research_log(
    text: str,
    date: "datetime.date | None" = None,  # noqa: F821  # forward ref kept for docs
) -> pathlib.Path:
    """Append a timestamped entry to the daily research log.

    Args:
        text: Research note to record.
        date: Date to use for the filename. Defaults to today (UTC).

    Returns:
        The :class:`pathlib.Path` of the log file that was written.
    """
    import datetime as _dt

    if date is None:
        date = _dt.date.today()

    log_dir = pathlib.Path("output") / "research_logs"
    log_dir.mkdir(parents=True, exist_ok=True)

    filename = f"research_log_{date.strftime('%Y_%m_%d')}.txt"
    filepath = log_dir / filename

    timestamp = datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    entry = (
        f"\nTimestamp: {timestamp}\n"
        f"{'=' * 60}\n"
        f"{text}\n"
    )

    try:
        with filepath.open("a", encoding="utf-8") as fh:
            fh.write(entry)
    except OSError as exc:
        print(f"Error writing research log '{filepath}': {exc}", file=sys.stderr)
        raise

    return filepath

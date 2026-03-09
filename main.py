#!/usr/bin/env python3
"""
philosophy-research-agent — CLI entrypoint.

Usage
-----
python main.py collect-papers [--limit N]
python main.py collect-wiki "<topic>"
python main.py collect-videos [--query "<query>"] [--limit N]
python main.py log-discussion "<topic>" "<text>"
python main.py research-log "<text>"
python main.py summarize "<text>" [--max-sentences N]
"""

from __future__ import annotations

import argparse
import pathlib
import re
import sys
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

OUTPUT_BASE: pathlib.Path = pathlib.Path("output")

# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------


def ensure_dir(path: pathlib.Path) -> None:
    """Create *path* (and parents) if it does not already exist.

    Args:
        path: Directory path to create.
    """
    path.mkdir(parents=True, exist_ok=True)


def sanitize_filename(name: str) -> str:
    """Replace characters unsafe for cross-platform filenames.

    Handles reserved characters on Windows (``<>:"/\\|?*``) as well as
    control characters and leading/trailing dots or spaces.

    Args:
        name: Raw string to sanitize.

    Returns:
        A filename-safe string. Falls back to ``"untitled"`` if the result
        would otherwise be empty.
    """
    safe = re.sub(r'[<>:"/\\|?*\x00-\x1f\s]', "_", name)
    safe = safe.strip("._")
    return safe or "untitled"


def write_utf8(path: pathlib.Path, content: str) -> None:
    """Write *content* to *path* with UTF-8 encoding.

    Args:
        path: Destination file path.
        content: Text content to write.
    """
    path.write_text(content, encoding="utf-8")


def _timestamp() -> str:
    """Return the current UTC timestamp as an ISO 8601 string."""
    return datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")


# ---------------------------------------------------------------------------
# Subcommand handlers
# ---------------------------------------------------------------------------


def cmd_collect_papers(args: argparse.Namespace) -> int:
    """Handle the ``collect-papers`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from collector.philpapers_collector import PHILPAPERS_URL, collect

    print(f"Fetching up to {args.limit} latest papers from PhilPapers…")
    entries = collect(limit=args.limit)

    if not entries:
        print(
            "No entries retrieved. The page may be unavailable or its "
            "structure has changed.",
            file=sys.stderr,
        )
        return 1

    out_dir = OUTPUT_BASE / "papers"
    ensure_dir(out_dir)
    out_path = out_dir / "latest_papers.txt"

    lines = [
        f"Timestamp: {_timestamp()}",
        f"Source: {PHILPAPERS_URL}",
        "---",
    ]
    for i, entry in enumerate(entries, start=1):
        lines.append(f"\n{i}) {entry['title']}")
        lines.append(f"   Author: {entry['author']}")
        lines.append(f"   Link:   {entry['link']}")

    write_utf8(out_path, "\n".join(lines) + "\n")
    print(f"Saved {len(entries)} paper(s) to {out_path}")
    return 0


def cmd_collect_wiki(args: argparse.Namespace) -> int:
    """Handle the ``collect-wiki`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from collector.wikipedia_collector import collect

    topic: str = args.topic
    print(f"Fetching Wikipedia summary for '{topic}'…")
    results = collect(topic)

    if not results:
        return 1

    entry = results[0]
    out_dir = OUTPUT_BASE / "wiki"
    ensure_dir(out_dir)
    safe_name = sanitize_filename(topic)
    out_path = out_dir / f"{safe_name}.txt"

    content = (
        f"Topic Query:     {entry['topic_query']}\n"
        f"Resolved Title:  {entry['resolved_title']}\n"
        f"Timestamp:       {_timestamp()}\n"
        f"---\n\n"
        f"{entry['summary']}\n"
    )
    write_utf8(out_path, content)
    print(f"Saved Wikipedia summary to {out_path}")
    return 0


def cmd_collect_videos(args: argparse.Namespace) -> int:
    """Handle the ``collect-videos`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from collector.youtube_collector import collect

    print(f"Searching YouTube for '{args.query}' (limit={args.limit})…")
    results = collect(query=args.query, limit=args.limit)

    if not results:
        print("No video results retrieved.", file=sys.stderr)
        return 1

    out_dir = OUTPUT_BASE / "videos"
    ensure_dir(out_dir)
    out_path = out_dir / "philosophy_videos.txt"

    lines = [
        f"Timestamp: {_timestamp()}",
        f"Query:     {args.query}",
        "---",
    ]
    for i, video in enumerate(results, start=1):
        lines.append(f"\n{i}) {video['title']}")
        lines.append(f"   Channel: {video['channel']}")
        lines.append(f"   URL:     {video['url']}")

    write_utf8(out_path, "\n".join(lines) + "\n")
    print(f"Saved {len(results)} video(s) to {out_path}")
    return 0


def cmd_log_discussion(args: argparse.Namespace) -> int:
    """Handle the ``log-discussion`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from dialogue.discussion_logger import log_discussion

    try:
        filepath = log_discussion(topic=args.topic, text=args.text)
    except OSError:
        return 1

    print(f"Discussion logged to {filepath}")
    return 0


def cmd_research_log(args: argparse.Namespace) -> int:
    """Handle the ``research-log`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from dialogue.discussion_logger import append_research_log

    try:
        filepath = append_research_log(text=args.text)
    except OSError:
        return 1

    print(f"Research log entry appended to {filepath}")
    return 0


def cmd_summarize(args: argparse.Namespace) -> int:
    """Handle the ``summarize`` subcommand.

    Args:
        args: Parsed CLI arguments.

    Returns:
        Exit code (0 = success, 1 = failure).
    """
    from processor.summarizer import summarize_text

    summary = summarize_text(args.text, max_sentences=args.max_sentences)
    print(summary)
    return 0


# ---------------------------------------------------------------------------
# Argument parser
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    """Construct and return the CLI argument parser."""
    parser = argparse.ArgumentParser(
        prog="philosophy-research-agent",
        description="CLI tool for philosophy research: collect papers, "
        "Wikipedia summaries, YouTube lectures, log discussions, "
        "and summarize text locally.",
    )
    sub = parser.add_subparsers(dest="command", metavar="<command>")
    sub.required = True

    # --- collect-papers ---
    p_papers = sub.add_parser(
        "collect-papers",
        help="Fetch latest papers from PhilPapers.",
    )
    p_papers.add_argument(
        "--limit",
        type=int,
        default=30,
        metavar="N",
        help="Maximum number of papers to collect (default: 30).",
    )
    p_papers.set_defaults(func=cmd_collect_papers)

    # --- collect-wiki ---
    p_wiki = sub.add_parser(
        "collect-wiki",
        help="Fetch a Wikipedia summary for a philosophy topic.",
    )
    p_wiki.add_argument("topic", help="Topic to look up on Wikipedia.")
    p_wiki.set_defaults(func=cmd_collect_wiki)

    # --- collect-videos ---
    p_videos = sub.add_parser(
        "collect-videos",
        help="Search YouTube for philosophy lecture videos.",
    )
    p_videos.add_argument(
        "--query",
        default="philosophy lecture",
        metavar="QUERY",
        help='YouTube search query (default: "philosophy lecture").',
    )
    p_videos.add_argument(
        "--limit",
        type=int,
        default=10,
        metavar="N",
        help="Maximum number of videos to return (default: 10).",
    )
    p_videos.set_defaults(func=cmd_collect_videos)

    # --- log-discussion ---
    p_disc = sub.add_parser(
        "log-discussion",
        help="Append a discussion entry to a topic log.",
    )
    p_disc.add_argument("topic", help="Discussion topic (used as filename).")
    p_disc.add_argument("text", help="Discussion text to record.")
    p_disc.set_defaults(func=cmd_log_discussion)

    # --- research-log ---
    p_rlog = sub.add_parser(
        "research-log",
        help="Append an entry to today's research log.",
    )
    p_rlog.add_argument("text", help="Research note to record.")
    p_rlog.set_defaults(func=cmd_research_log)

    # --- summarize ---
    p_sum = sub.add_parser(
        "summarize",
        help="Summarize text locally (extractive, no LLM).",
    )
    p_sum.add_argument("text", help="Text to summarize.")
    p_sum.add_argument(
        "--max-sentences",
        type=int,
        default=4,
        dest="max_sentences",
        metavar="N",
        help="Number of sentences in the summary (default: 4).",
    )
    p_sum.set_defaults(func=cmd_summarize)

    return parser


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    """Parse CLI arguments and dispatch to the appropriate handler."""
    parser = build_parser()
    args = parser.parse_args()
    exit_code: int = args.func(args)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()

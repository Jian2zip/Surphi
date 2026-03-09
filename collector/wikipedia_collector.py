"""Wikipedia collector – fetch philosophy articles via the wikipedia package."""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

import wikipedia

OUTPUT_DIR = Path("output/wiki")


def sanitize_filename(name: str) -> str:
    """Return a filesystem-safe version of *name*.

    Replaces every character that is not alphanumeric, space, hyphen,
    underscore, or period with an underscore, then trims whitespace and
    replaces spaces with underscores.  The result is capped at 100 chars.

    Args:
        name: Raw user-provided string.

    Returns:
        A safe filename string (without extension).
    """
    safe = "".join(c if c.isalnum() or c in " -_." else "_" for c in name)
    return safe.strip().replace(" ", "_")[:100]


def fetch_article(topic: str) -> tuple[str, str]:
    """Search Wikipedia and return (title, full_content) for *topic*.

    Args:
        topic: Philosophy topic to search for.

    Returns:
        A (title, content) tuple.
    """
    try:
        results = wikipedia.search(topic)
        if not results:
            print(f"No Wikipedia results found for '{topic}'.", file=sys.stderr)
            sys.exit(1)
        page = wikipedia.page(results[0], auto_suggest=False)
        return page.title, page.content
    except wikipedia.DisambiguationError as exc:
        # Try the first suggested alternative
        try:
            page = wikipedia.page(exc.options[0], auto_suggest=False)
            return page.title, page.content
        except (wikipedia.PageError, IndexError):
            print(
                f"Could not resolve disambiguation for '{topic}'.",
                file=sys.stderr,
            )
            sys.exit(1)
    except wikipedia.PageError:
        print(f"Wikipedia page not found for '{topic}'.", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Error fetching Wikipedia article: {exc}", file=sys.stderr)
        sys.exit(1)


def save_article(topic: str, title: str, content: str) -> Path:
    """Save a Wikipedia article to a UTF-8 .txt file.

    Args:
        topic: Original search term (used for the filename).
        title: Resolved Wikipedia page title.
        content: Full article text.

    Returns:
        Path to the saved file.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = sanitize_filename(topic) + ".txt"
    output_file = OUTPUT_DIR / filename
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    with output_file.open("w", encoding="utf-8") as fh:
        fh.write(f"Wikipedia Article: {title}\n")
        fh.write(f"Collected: {timestamp}\n")
        fh.write(f"Search term: {topic}\n")
        fh.write("=" * 60 + "\n\n")
        fh.write(content)

    return output_file


def run(topic: str) -> None:
    """Collect a Wikipedia article for *topic* and save it to disk.

    Args:
        topic: Philosophy topic to look up.
    """
    print(f"Fetching Wikipedia article for '{topic}'...")
    title, content = fetch_article(topic)
    output_file = save_article(topic, title, content)
    print(f"Saved article '{title}' to {output_file}")

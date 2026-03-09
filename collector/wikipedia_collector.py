"""
Collector for Wikipedia philosophy topic summaries.

Uses the ``wikipedia`` package to fetch article summaries.
"""

from __future__ import annotations

import sys

import wikipedia

# Maximum number of characters to retain from a Wikipedia summary.
SUMMARY_MAX_CHARS: int = 2000


def collect(topic: str) -> list[dict[str, str]]:
    """Fetch a Wikipedia summary for *topic*.

    Args:
        topic: Search query / article title.

    Returns:
        A one-element list containing a dict with keys
        ``topic_query``, ``resolved_title``, and ``summary``.
        Returns an empty list on error.
    """
    try:
        page = wikipedia.page(topic, auto_suggest=True)
    except wikipedia.DisambiguationError as exc:
        # Pick the first suggested option and retry.
        options: list[str] = exc.options
        print(
            f"Disambiguation for '{topic}'. Trying first option: '{options[0]}'",
            file=sys.stderr,
        )
        try:
            page = wikipedia.page(options[0], auto_suggest=False)
        except Exception as inner_exc:  # noqa: BLE001
            print(
                f"Error fetching Wikipedia page '{options[0]}': {inner_exc}",
                file=sys.stderr,
            )
            return []
    except wikipedia.PageError:
        print(
            f"Wikipedia page not found for topic: '{topic}'",
            file=sys.stderr,
        )
        return []
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected Wikipedia error for '{topic}': {exc}", file=sys.stderr)
        return []

    summary: str = page.summary[:SUMMARY_MAX_CHARS]
    return [
        {
            "topic_query": topic,
            "resolved_title": page.title,
            "summary": summary,
        }
    ]

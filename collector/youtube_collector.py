"""
Collector for YouTube philosophy lecture videos.

Uses ``youtubesearchpython`` (youtube-search-python) — no API key required.
"""

from __future__ import annotations

import sys

DEFAULT_QUERY: str = "philosophy lecture"


def collect(query: str = DEFAULT_QUERY, limit: int = 10) -> list[dict[str, str]]:
    """Search YouTube for philosophy videos.

    Args:
        query: Search query string.
        limit: Maximum number of results to return.

    Returns:
        A list of dicts with keys ``title``, ``channel``, and ``url``.
        Returns an empty list on error.
    """
    try:
        # Import lazily so import errors surface with a clear message.
        from youtubesearchpython import VideosSearch  # type: ignore[import-untyped]
    except ImportError as exc:
        print(
            f"youtube-search-python is not installed: {exc}",
            file=sys.stderr,
        )
        return []

    try:
        search = VideosSearch(query, limit=limit)
        raw_results = search.result()
    except Exception as exc:  # noqa: BLE001
        print(f"Error searching YouTube for '{query}': {exc}", file=sys.stderr)
        return []

    results: list[dict[str, str]] = []
    for item in raw_results.get("result", [])[:limit]:
        title: str = item.get("title", "Unknown Title")
        channel: str = (item.get("channel") or {}).get("name", "Unknown Channel")
        link: str = item.get("link", "")
        results.append({"title": title, "channel": channel, "url": link})

    return results

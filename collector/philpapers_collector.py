"""
Collector for latest PhilPapers entries.

Scrapes https://philpapers.org/latest using requests + BeautifulSoup.
"""

from __future__ import annotations

import sys
from typing import Any

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PHILPAPERS_URL: str = "https://philpapers.org/latest"
HTTP_TIMEOUT: int = 15
USER_AGENT: str = (
    "Mozilla/5.0 (compatible; PhilosophyResearchAgent/1.0; "
    "+https://github.com/philosophy-research-agent)"
)


def collect(limit: int = 30) -> list[dict[str, str]]:
    """Fetch the latest PhilPapers entries.

    Args:
        limit: Maximum number of entries to return.

    Returns:
        A list of dicts with keys ``title``, ``author``, and ``link``.
        Returns an empty list on error (error message printed to stderr).
    """
    try:
        response = requests.get(
            PHILPAPERS_URL,
            headers={"User-Agent": USER_AGENT},
            timeout=HTTP_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"Error fetching PhilPapers: {exc}", file=sys.stderr)
        return []

    try:
        return _parse_entries(response.text, limit)
    except Exception as exc:  # noqa: BLE001
        print(
            f"Error parsing PhilPapers HTML (page structure may have changed): {exc}",
            file=sys.stderr,
        )
        return []


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _parse_entries(html: str, limit: int) -> list[dict[str, str]]:
    """Parse PhilPapers HTML and extract paper entries.

    Args:
        html: Raw HTML string.
        limit: Maximum number of entries to extract.

    Returns:
        Parsed entry dicts.
    """
    soup = BeautifulSoup(html, "html.parser")
    entries: list[dict[str, str]] = []

    # PhilPapers marks each entry with class "entry" inside a listing container.
    # We try multiple selector strategies for resilience against HTML changes.
    items = soup.select(".entry")
    if not items:
        # Fallback: any <div> with an id starting with "entry"
        items = [tag for tag in soup.find_all("div") if _has_entry_id(tag)]

    for item in items[:limit]:
        title, link = _extract_title_link(item)
        author = _extract_author(item)
        if title:
            entries.append({"title": title, "author": author, "link": link})

    return entries


def _has_entry_id(tag: Any) -> bool:
    """Return True if *tag* has an id attribute starting with 'entry'."""
    tag_id: str = tag.get("id", "")
    return isinstance(tag_id, str) and tag_id.startswith("entry")


def _extract_title_link(item: Any) -> tuple[str, str]:
    """Extract title text and absolute link from an entry tag.

    Args:
        item: BeautifulSoup tag for a single paper entry.

    Returns:
        A ``(title, link)`` tuple; link may be an empty string if not found.
    """
    # Try dedicated title anchor
    anchor = item.select_one(".title a") or item.select_one("a.eTitle")
    if anchor is None:
        anchor = item.find("a")

    if anchor is None:
        return "", ""

    title: str = anchor.get_text(strip=True)
    href: str = anchor.get("href", "")
    if href and not href.startswith("http"):
        href = "https://philpapers.org" + href
    return title, href


def _extract_author(item: Any) -> str:
    """Extract author text from an entry tag, returning 'Unknown' if absent.

    Args:
        item: BeautifulSoup tag for a single paper entry.

    Returns:
        Author name string.
    """
    for selector in (".authors", ".author", ".pAuthors"):
        tag = item.select_one(selector)
        if tag:
            text = tag.get_text(strip=True)
            if text:
                return text
    return "Unknown"

"""PhilPapers collector – scrapes latest papers from philpapers.org."""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import TypedDict

import requests
from bs4 import BeautifulSoup

PHILPAPERS_URL = "https://philpapers.org/latest"
OUTPUT_DIR = Path("output/papers")
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
TIMEOUT = 15


class PaperEntry(TypedDict):
    """A single paper entry from PhilPapers."""

    title: str
    author: str
    link: str


def fetch_latest_papers(limit: int = 30) -> list[PaperEntry]:
    """Fetch the latest papers from PhilPapers.

    Args:
        limit: Maximum number of papers to return.

    Returns:
        A list of PaperEntry dicts.
    """
    try:
        resp = requests.get(
            PHILPAPERS_URL,
            headers={"User-Agent": USER_AGENT},
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"Error fetching PhilPapers: {exc}", file=sys.stderr)
        sys.exit(1)

    soup = BeautifulSoup(resp.text, "html.parser")
    papers: list[PaperEntry] = []

    for entry in soup.select(".entry"):
        if len(papers) >= limit:
            break

        # Title
        title_el = entry.select_one(".paperTitle")
        if title_el is None:
            title_el = entry.select_one("a.title, .entryTitle")
        title = title_el.get_text(strip=True) if title_el else "Untitled"

        # Link – prefer a link whose text is the title
        href = ""
        for anchor in entry.select("a"):
            raw = anchor.get("href", "")
            if raw:
                href = str(raw)
                if href.startswith("/"):
                    href = "https://philpapers.org" + href
                break

        # Author(s)
        author_els = entry.select(".authors a") or entry.select(".author")
        if author_els:
            author = ", ".join(a.get_text(strip=True) for a in author_els)
        else:
            author = "Unknown"

        papers.append(PaperEntry(title=title, author=author, link=href))

    return papers


def save_papers(papers: list[PaperEntry]) -> Path:
    """Save paper entries to a UTF-8 .txt file.

    Args:
        papers: List of paper entries.

    Returns:
        Path to the saved file.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / "latest_papers.txt"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    with output_file.open("w", encoding="utf-8") as fh:
        fh.write("PhilPapers Latest Papers\n")
        fh.write(f"Collected: {timestamp}\n")
        fh.write(f"Source: {PHILPAPERS_URL}\n")
        fh.write("=" * 60 + "\n\n")
        for i, paper in enumerate(papers, 1):
            fh.write(f"{i}. {paper['title']}\n")
            fh.write(f"   Author(s): {paper['author']}\n")
            fh.write(f"   Link: {paper['link']}\n\n")

    return output_file


def run(limit: int = 30) -> None:
    """Collect latest PhilPapers entries and save them to disk.

    Args:
        limit: Maximum number of papers to collect.
    """
    print(f"Fetching up to {limit} papers from PhilPapers...")
    papers = fetch_latest_papers(limit)
    if not papers:
        print(
            "No papers found. The page structure may have changed.",
            file=sys.stderr,
        )
        sys.exit(1)
    output_file = save_papers(papers)
    print(f"Saved {len(papers)} paper(s) to {output_file}")

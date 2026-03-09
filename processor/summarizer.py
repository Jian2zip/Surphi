"""Simple extractive text summarizer – no LLM or external model required."""

from __future__ import annotations

import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

STOPWORDS: frozenset[str] = frozenset(
    {
        "the", "and", "for", "are", "but", "not", "you", "all", "any",
        "can", "had", "her", "was", "one", "our", "out", "has", "have",
        "his", "been", "with", "that", "this", "from", "they", "which",
        "were", "into", "more", "also", "its", "than", "such", "when",
        "what", "who", "how", "each", "many", "some", "their", "there",
        "these", "those", "will", "would", "could", "should", "said",
        "may", "might", "shall", "about", "other", "over", "then",
        "both", "very", "just", "even", "only", "while", "after",
        "before", "between", "through", "being", "because",
    }
)


def _split_sentences(text: str) -> list[str]:
    """Split *text* into a list of non-empty sentences.

    Args:
        text: Input text.

    Returns:
        List of sentence strings.
    """
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in parts if s.strip()]


def _word_frequencies(text: str) -> Counter[str]:
    """Build a word-frequency Counter for content words in *text*.

    Args:
        text: Input text.

    Returns:
        Counter mapping lowercase words to their frequency.
    """
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    return Counter(w for w in words if w not in STOPWORDS)


def summarize(text: str, num_sentences: int = 5) -> str:
    """Return an extractive summary of *text*.

    Sentences are ranked by the sum of normalised content-word frequencies.
    The top *num_sentences* sentences are returned in their original order.

    Args:
        text: Input text to summarise.
        num_sentences: Number of sentences to include in the summary.

    Returns:
        Summary string.
    """
    sentences = _split_sentences(text)
    if len(sentences) <= num_sentences:
        return text

    freq = _word_frequencies(text)
    max_freq = max(freq.values()) if freq else 1

    scored: list[tuple[int, float, str]] = []
    for idx, sent in enumerate(sentences):
        words = re.findall(r"\b[a-zA-Z]{3,}\b", sent.lower())
        score = sum(freq.get(w, 0) / max_freq for w in words)
        scored.append((idx, score, sent))

    top = sorted(scored, key=lambda x: x[1], reverse=True)[:num_sentences]
    # Restore original sentence order
    top_ordered = sorted(top, key=lambda x: x[0])
    return " ".join(s for _, _, s in top_ordered)


def summarize_file(input_path: Path, num_sentences: int = 5) -> str:
    """Read *input_path* and return an extractive summary of its body text.

    The first lines up to and including the first "====…" separator are
    treated as header/metadata and are excluded from summarisation.

    Args:
        input_path: Path to the UTF-8 .txt file.
        num_sentences: Number of sentences to include.

    Returns:
        Summary string.
    """
    if not input_path.exists():
        print(f"File not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    text = input_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    # Find end of header block
    body_start = next(
        (i for i, line in enumerate(lines) if line.startswith("=" * 10)),
        None,
    )
    body = "\n".join(lines[body_start + 1 :]).strip() if body_start is not None else text

    if not body:
        body = text

    return summarize(body, num_sentences)


def save_summary(summary: str, source_path: Path) -> Path:
    """Write *summary* to a new file next to *source_path*.

    The output filename is ``<stem>_summary.txt``.

    Args:
        summary: Summary text.
        source_path: Path to the original file (used for placement & naming).

    Returns:
        Path to the saved summary file.
    """
    output_file = source_path.parent / f"{source_path.stem}_summary.txt"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    with output_file.open("w", encoding="utf-8") as fh:
        fh.write(f"Summary of: {source_path.name}\n")
        fh.write(f"Generated: {timestamp}\n")
        fh.write("=" * 60 + "\n\n")
        fh.write(summary + "\n")

    return output_file


def run(input_file: str, num_sentences: int = 5) -> None:
    """Summarise *input_file* and save the result to disk.

    Args:
        input_file: Path string of the UTF-8 .txt file to summarise.
        num_sentences: Number of sentences in the output summary.
    """
    path = Path(input_file)
    print(f"Summarising {path}...")
    summary = summarize_file(path, num_sentences)
    output_file = save_summary(summary, path)
    print(f"Saved summary to {output_file}")

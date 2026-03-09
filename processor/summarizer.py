"""
Local extractive text summarizer.

Works without any NLTK corpus downloads. Splits text into sentences with
a regex, scores them by normalised word frequency, and returns the top
``max_sentences`` in original document order.
"""

from __future__ import annotations

import re
from collections import Counter

# ---------------------------------------------------------------------------
# Built-in English stopword list (no external corpora needed)
# ---------------------------------------------------------------------------

_STOPWORDS: frozenset[str] = frozenset(
    {
        "a", "about", "above", "after", "again", "against", "all", "am", "an",
        "and", "any", "are", "aren't", "as", "at", "be", "because", "been",
        "before", "being", "below", "between", "both", "but", "by", "can't",
        "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
        "doing", "don't", "down", "during", "each", "few", "for", "from",
        "further", "get", "got", "had", "hadn't", "has", "hasn't", "have",
        "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
        "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
        "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
        "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
        "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only",
        "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
        "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should",
        "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
        "their", "theirs", "them", "themselves", "then", "there", "there's",
        "these", "they", "they'd", "they'll", "they're", "they've", "this",
        "those", "through", "to", "too", "under", "until", "up", "very", "was",
        "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
        "what", "what's", "when", "when's", "where", "where's", "which",
        "while", "who", "who's", "whom", "why", "why's", "will", "with",
        "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
        "you've", "your", "yours", "yourself", "yourselves",
    }
)

# Sentence boundary pattern: split on '. ', '! ', '? ' or end-of-string
_SENTENCE_RE: re.Pattern[str] = re.compile(r"(?<=[.!?])\s+")


def summarize_text(text: str, max_sentences: int = 4) -> str:
    """Return an extractive summary of *text*.

    Splits *text* into sentences, ranks them by normalised word frequency
    (excluding stopwords), and returns the top *max_sentences* in original
    order.

    Args:
        text: Input text to summarise.
        max_sentences: Number of sentences to include in the summary.

    Returns:
        Summary string. If *text* is blank or shorter than *max_sentences*
        sentences the original text is returned unchanged.
    """
    if not text or not text.strip():
        return text

    sentences = [s.strip() for s in _SENTENCE_RE.split(text) if s.strip()]
    if len(sentences) <= max_sentences:
        return text.strip()

    # Build word-frequency map
    all_words = re.findall(r"\b[a-zA-Z]+\b", text.lower())
    content_words = [w for w in all_words if w not in _STOPWORDS]
    freq: Counter[str] = Counter(content_words)
    max_freq: int = max(freq.values(), default=1)

    # Normalise frequencies
    norm_freq: dict[str, float] = {
        word: count / max_freq for word, count in freq.items()
    }

    # Score each sentence
    def _score(sentence: str) -> float:
        words = re.findall(r"\b[a-zA-Z]+\b", sentence.lower())
        return sum(norm_freq.get(w, 0.0) for w in words if w not in _STOPWORDS)

    scored = sorted(
        enumerate(sentences),
        key=lambda idx_sent: _score(idx_sent[1]),
        reverse=True,
    )
    top_indices = sorted(idx for idx, _ in scored[:max_sentences])
    return " ".join(sentences[i] for i in top_indices)

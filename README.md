# Surphi — Philosophy Research Agent

A simple, modular, local-first CLI tool to help philosophy students:

- collect philosophical resources (PhilPapers latest, Wikipedia topic summaries, YouTube lecture search)
- record discussions and daily research logs
- summarize text locally (no LLM required)
- store everything as UTF-8 `.txt` files under an `output/` folder

---

## Requirements

- **Python 3.11** (required — the project targets exactly Python 3.11)
- Internet connection for collection commands (PhilPapers, Wikipedia, YouTube)
- No API keys needed

---

## Installation

```bash
# 1. Create and activate a virtual environment
python3.11 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# 2. Install dependencies
pip install -r requirements.txt
```

---

## Project Structure

```
output/
├── papers/           # PhilPapers results
├── wiki/             # Wikipedia summaries
├── videos/           # YouTube search results
├── discussions/      # Per-topic discussion logs
└── research_logs/    # Daily research logs
collector/
├── philpapers_collector.py
├── wikipedia_collector.py
└── youtube_collector.py
processor/
└── summarizer.py
dialogue/
└── discussion_logger.py
main.py
requirements.txt
```

---

## CLI Commands

All commands are run from the project root with `python main.py`.

### 1. Collect latest PhilPapers entries

```bash
python main.py collect-papers
python main.py collect-papers --limit 10
```

Saves to: `output/papers/latest_papers.txt`

### 2. Collect a Wikipedia philosophy topic summary

```bash
python main.py collect-wiki "Phenomenology"
python main.py collect-wiki "Immanuel Kant"
```

Saves to: `output/wiki/<sanitized_topic>.txt`

### 3. Search YouTube for philosophy lectures

```bash
python main.py collect-videos
python main.py collect-videos --query "Hegel dialectics" --limit 5
```

Saves to: `output/videos/philosophy_videos.txt`

### 4. Log a discussion

```bash
python main.py log-discussion "ritual theory" "Durkheim sees ritual as social cohesion"
```

Appends to: `output/discussions/<sanitized_topic>.txt`

### 5. Append a daily research log entry

```bash
python main.py research-log "Studied Kant and moral philosophy today"
```

Appends to: `output/research_logs/research_log_YYYY_MM_DD.txt`

### 6. Summarize text locally (no LLM)

```bash
python main.py summarize "Long philosophical text here..."
python main.py summarize "Long text..." --max-sentences 3
```

Prints summary to stdout.

---

## Output File Locations

| Command          | Output path                                          |
|------------------|------------------------------------------------------|
| `collect-papers` | `output/papers/latest_papers.txt`                    |
| `collect-wiki`   | `output/wiki/<topic>.txt`                            |
| `collect-videos` | `output/videos/philosophy_videos.txt`                |
| `log-discussion` | `output/discussions/<topic>.txt`                     |
| `research-log`   | `output/research_logs/research_log_YYYY_MM_DD.txt`   |

---

## Notes

- **Network dependency**: `collect-papers`, `collect-wiki`, and `collect-videos`
  all require an internet connection. Network errors are handled gracefully and
  printed to stderr.
- **Best-effort scraping**: The PhilPapers scraper depends on the current HTML
  structure of `https://philpapers.org/latest`. If the site redesigns its markup,
  the parser may return fewer or no results. A warning will be printed to stderr.
- **No LLM**: The summarizer uses a simple extractive algorithm (word-frequency
  scoring) and requires no model downloads or API keys.
- **Output directories** are created automatically if they don't exist.
- **Cross-platform filenames**: Topic strings are sanitized to be safe on
  Windows, macOS, and Linux.


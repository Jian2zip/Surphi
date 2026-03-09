# Philosophy Research Agent

A local CLI tool for collecting, logging, and summarising philosophy resources –
no API keys, no LLM, just Python 3.11.

---

## Requirements

* Python 3.11+
* Internet access (for scraping / Wikipedia / YouTube search)

---

## Installation

```bash
pip install -r requirements.txt
```

---

## Repository layout

```
collector/
  philpapers_collector.py   # Scrape PhilPapers latest papers
  wikipedia_collector.py    # Fetch Wikipedia articles
  youtube_collector.py      # Search YouTube without an API key
processor/
  summarizer.py             # Extractive text summariser (no LLM)
dialogue/
  discussion_logger.py      # Append-only discussion & research logs
output/
  papers/                   # PhilPapers results
  wiki/                     # Wikipedia articles
  videos/                   # YouTube search results
  discussions/              # Discussion logs
  research_logs/            # Daily research notes
main.py                     # CLI entry point (argparse)
requirements.txt
README.md
.gitignore
```

All output files are UTF-8 `.txt`.  Output directories are created
automatically on first run.

---

## Usage

```
python main.py <command> [options]
```

Run `python main.py --help` or `python main.py <command> --help` for full
option details.

### Collect latest PhilPapers entries

```bash
python main.py collect-papers           # default 30 papers
python main.py collect-papers --limit 10
```

Output → `output/papers/latest_papers.txt`

### Fetch a Wikipedia article

```bash
python main.py collect-wiki "Stoicism"
python main.py collect-wiki "Philosophy of mind"
```

Output → `output/wiki/<sanitised_topic>.txt`

### Search YouTube for philosophy videos

```bash
python main.py collect-youtube "Plato Republic lecture"
python main.py collect-youtube "existentialism explained" --limit 5
```

Output → `output/videos/<sanitised_query>.txt`

### Summarise a collected file

```bash
python main.py summarize output/wiki/Stoicism.txt
python main.py summarize output/papers/latest_papers.txt --sentences 8
```

Output → `output/<subdir>/<stem>_summary.txt`

### Log a discussion note

```bash
python main.py log-discussion "Free Will" "Today I read about compatibilism."
```

Output (append) → `output/discussions/<sanitised_topic>.txt`

### Log a daily research note

```bash
python main.py log-research "Reading session" "Finished chapter 3 of the Critique."
```

Output (append) → `output/research_logs/research_YYYY-MM-DD.txt`

---

## Error handling

On expected failures (network error, page not found, empty results) the tool
prints a friendly message to **stderr** and exits with code **1**.

---

## Development notes

* HTTP requests use a 15-second timeout and a realistic `User-Agent` header.
* PhilPapers scraping is best-effort; if the page layout changes the tool
  exits with a clear error message.
* The summariser uses frequency-based extractive ranking – no external model
  required.

"""Philosophy Research Agent – CLI entry point."""

from __future__ import annotations

import argparse


def _build_parser() -> argparse.ArgumentParser:
    """Construct and return the top-level argument parser."""
    parser = argparse.ArgumentParser(
        prog="python main.py",
        description=(
            "Philosophy Research Agent: collect philosophy resources, "
            "log discussions, and summarise text – all locally, no API keys."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True, metavar="<command>")

    # ── collect-papers ──────────────────────────────────────────────────────
    pp = sub.add_parser(
        "collect-papers",
        help="Scrape latest papers from PhilPapers.org",
        description="Scrape https://philpapers.org/latest and save results to output/papers/.",
    )
    pp.add_argument(
        "--limit",
        type=int,
        default=30,
        metavar="N",
        help="Maximum number of papers to collect (default: 30)",
    )

    # ── collect-wiki ─────────────────────────────────────────────────────────
    wp = sub.add_parser(
        "collect-wiki",
        help="Fetch a Wikipedia article on a philosophy topic",
        description="Search Wikipedia for TOPIC and save the full article to output/wiki/.",
    )
    wp.add_argument("topic", help="Philosophy topic to search for")

    # ── collect-youtube ──────────────────────────────────────────────────────
    yp = sub.add_parser(
        "collect-youtube",
        help="Search YouTube for philosophy videos (no API key required)",
        description="Search YouTube for QUERY and save results to output/videos/.",
    )
    yp.add_argument("query", help="YouTube search query")
    yp.add_argument(
        "--limit",
        type=int,
        default=10,
        metavar="N",
        help="Maximum number of videos to collect (default: 10)",
    )

    # ── summarize ─────────────────────────────────────────────────────────────
    sp = sub.add_parser(
        "summarize",
        help="Produce an extractive summary of a collected .txt file",
        description=(
            "Read FILE and write an extractive summary alongside it as "
            "<stem>_summary.txt."
        ),
    )
    sp.add_argument("file", help="Path to the .txt file to summarise")
    sp.add_argument(
        "--sentences",
        type=int,
        default=5,
        metavar="N",
        help="Number of sentences in the summary (default: 5)",
    )

    # ── log-discussion ────────────────────────────────────────────────────────
    dp = sub.add_parser(
        "log-discussion",
        help="Append a discussion note to output/discussions/<topic>.txt",
        description="Append NOTE to the discussion log for TOPIC.",
    )
    dp.add_argument("topic", help="Discussion topic")
    dp.add_argument("note", help="Discussion note text")

    # ── log-research ──────────────────────────────────────────────────────────
    rp = sub.add_parser(
        "log-research",
        help="Append a research note to today's log in output/research_logs/",
        description="Append NOTE under TITLE to today's research log.",
    )
    rp.add_argument("title", help="Short title for the research note")
    rp.add_argument("note", help="Research note text")

    return parser


def main() -> None:
    """Parse arguments and dispatch to the appropriate sub-module."""
    parser = _build_parser()
    args = parser.parse_args()

    if args.command == "collect-papers":
        from collector.philpapers_collector import run
        run(limit=args.limit)

    elif args.command == "collect-wiki":
        from collector.wikipedia_collector import run
        run(topic=args.topic)

    elif args.command == "collect-youtube":
        from collector.youtube_collector import run
        run(query=args.query, limit=args.limit)

    elif args.command == "summarize":
        from processor.summarizer import run
        run(input_file=args.file, num_sentences=args.sentences)

    elif args.command == "log-discussion":
        from dialogue.discussion_logger import run_discussion
        run_discussion(topic=args.topic, note=args.note)

    elif args.command == "log-research":
        from dialogue.discussion_logger import run_research
        run_research(title=args.title, note=args.note)


if __name__ == "__main__":
    main()

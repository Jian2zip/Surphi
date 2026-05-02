#!/usr/bin/env python3
"""Philosophy Research Agent - CLI tool for exploring Western philosophers."""

import json
import os
import sys
from collections import defaultdict


DATA_FILE = os.path.join(os.path.dirname(__file__), "philosophers.json")


def load_philosophers():
    """Load philosophers from the JSON database."""
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Database file not found at '{DATA_FILE}'.", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"Error: Could not parse '{DATA_FILE}': {exc}", file=sys.stderr)
        sys.exit(1)
    return data["western_philosophers"]


def list_eras(philosophers):
    """Return all distinct eras, preserving insertion order."""
    seen_set = set()
    seen = []
    for p in philosophers:
        era = p["era"]
        if era not in seen_set:
            seen_set.add(era)
            seen.append(era)
    return seen


def display_philosopher(p, verbose=True):
    """Print a philosopher's details."""
    print(f"\n{'=' * 60}")
    print(f"  {p['name']}  ({p['born']} – {p['died']})")
    print(f"  Era: {p['era']}  |  Nationality: {p['nationality']}")
    if verbose:
        print(f"  Key Ideas:")
        for idea in p["key_ideas"]:
            print(f"    • {idea}")
        if p["major_works"]:
            print(f"  Major Works:")
            for work in p["major_works"]:
                print(f"    – {work}")
        if p.get("influence"):
            print(f"  Influence: {p['influence']}")
    print(f"{'=' * 60}")


def cmd_list(philosophers, args):
    """List all philosophers, optionally filtered by era."""
    era_filter = " ".join(args).strip().lower() if args else None
    by_era = defaultdict(list)
    for p in philosophers:
        by_era[p["era"]].append(p)

    for era, members in by_era.items():
        if era_filter and era_filter not in era.lower():
            continue
        print(f"\n{'─' * 60}")
        print(f"  {era.upper()}")
        print(f"{'─' * 60}")
        for p in members:
            print(f"  {p['name']:40s} ({p['born']} – {p['died']})")


def cmd_search(philosophers, args):
    """Search philosophers by name or key idea."""
    if not args:
        print("Usage: search <query>")
        return
    query = " ".join(args).lower()
    results = [
        p for p in philosophers
        if query in p["name"].lower()
        or any(query in idea.lower() for idea in p["key_ideas"])
        or query in p.get("influence", "").lower()
        or query in p["era"].lower()
        or query in p["nationality"].lower()
    ]
    if not results:
        print(f"No philosophers found matching '{query}'.")
        return
    print(f"\nFound {len(results)} result(s) for '{query}':")
    for p in results:
        display_philosopher(p)


def cmd_era(philosophers, args):
    """List all philosophers from a specific era."""
    if not args:
        eras = list_eras(philosophers)
        print("\nAvailable eras:")
        for i, era in enumerate(eras, 1):
            count = sum(1 for p in philosophers if p["era"] == era)
            print(f"  {i:2}. {era} ({count} philosophers)")
        return
    query = " ".join(args).lower()
    results = [p for p in philosophers if query in p["era"].lower()]
    if not results:
        print(f"No philosophers found for era matching '{query}'.")
        return
    print(f"\nPhilosophers in era matching '{query}':")
    for p in results:
        display_philosopher(p)


def cmd_info(philosophers, args):
    """Show detailed info about a specific philosopher."""
    if not args:
        print("Usage: info <philosopher name>")
        return
    query = " ".join(args).lower()
    results = [p for p in philosophers if query in p["name"].lower()]
    if not results:
        print(f"No philosopher found matching '{query}'.")
        return
    for p in results:
        display_philosopher(p, verbose=True)


def cmd_count(philosophers, _args):
    """Show a count of philosophers per era."""
    by_era = defaultdict(int)
    for p in philosophers:
        by_era[p["era"]] += 1
    print(f"\n{'Era':<30} {'Count':>5}")
    print("─" * 40)
    for era, count in by_era.items():
        print(f"{era:<30} {count:>5}")
    print("─" * 40)
    print(f"{'Total':<30} {len(philosophers):>5}")


def print_help():
    """Print help message."""
    print("""
Philosophy Research Agent – Western Philosophy Edition
======================================================
Commands:
  list [era]          List all philosophers (optionally filter by era name)
  era [era name]      Show all eras, or list philosophers for a given era
  search <query>      Search philosophers by name, idea, nationality, or era
  info <name>         Show detailed info for a philosopher
  count               Show philosopher count per era
  help                Show this help message
  quit / exit         Exit the program

Examples:
  list
  list Medieval
  era Enlightenment
  search utilitarianism
  search German
  info Kant
  info Simone de Beauvoir
""")


def interactive_mode(philosophers):
    """Run the CLI in interactive mode."""
    print("\nWelcome to the Philosophy Research Agent!")
    print(f"Database: {len(philosophers)} Western philosophers loaded.")
    print("Type 'help' for available commands or 'quit' to exit.\n")

    commands = {
        "list": cmd_list,
        "era": cmd_era,
        "search": cmd_search,
        "info": cmd_info,
        "count": cmd_count,
        "help": lambda _p, _a: print_help(),
    }

    while True:
        try:
            raw = input(">> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not raw:
            continue

        parts = raw.split()
        cmd, args = parts[0].lower(), parts[1:]

        if cmd in ("quit", "exit"):
            print("Goodbye!")
            break
        elif cmd in commands:
            commands[cmd](philosophers, args)
        else:
            print(f"Unknown command: '{cmd}'. Type 'help' for available commands.")


def main():
    philosophers = load_philosophers()

    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        args = sys.argv[2:]
        dispatch = {
            "list": cmd_list,
            "era": cmd_era,
            "search": cmd_search,
            "info": cmd_info,
            "count": cmd_count,
        }
        if cmd == "help":
            print_help()
        elif cmd in dispatch:
            dispatch[cmd](philosophers, args)
        else:
            print(f"Unknown command: '{cmd}'")
            print_help()
            sys.exit(1)
    else:
        interactive_mode(philosophers)


if __name__ == "__main__":
    main()

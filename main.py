"""Philosophy Research Agent — Eastern Philosophy CLI Tool."""

import json
import os
import textwrap

DATA_FILE = os.path.join(os.path.dirname(__file__), "philosophers.json")


def load_philosophers() -> list[dict]:
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)["eastern_philosophers"]


def list_philosophers(philosophers: list[dict]) -> None:
    print("\n╔══════════════════════════════════════════════════════╗")
    print("║   東方哲學史 — Key Philosophers in Eastern Philosophy  ║")
    print("╚══════════════════════════════════════════════════════╝\n")
    for i, p in enumerate(philosophers, 1):
        print(f"  {i:>2}. {p['name']:<40}  [{p['tradition']}]  {p['origin']}")
    print()


def show_philosopher(p: dict) -> None:
    width = 70
    sep = "─" * width
    print(f"\n{'═' * width}")
    print(f"  {p['name']}")
    print(f"{'═' * width}")
    print(f"  Born      : {p['born']}")
    print(f"  Died      : {p['died']}")
    print(f"  Origin    : {p['origin']}")
    print(f"  Tradition : {p['tradition']}")
    print(sep)

    print("  Key Works:")
    for w in p["key_works"]:
        print(f"    • {w}")

    print(sep)
    print("  Core Ideas:")
    for idea in p["core_ideas"]:
        lines = textwrap.wrap(idea, width=width - 6)
        for i, line in enumerate(lines):
            prefix = "    • " if i == 0 else "      "
            print(f"{prefix}{line}")

    print(sep)
    print("  Influence:")
    for line in textwrap.wrap(p["influence"], width=width - 4):
        print(f"    {line}")
    print(f"{'═' * width}\n")


def search_philosophers(philosophers: list[dict], query: str) -> list[dict]:
    query_lower = query.lower()
    results = []
    for p in philosophers:
        searchable = " ".join([
            p["name"],
            p["origin"],
            p["tradition"],
            p["influence"],
            " ".join(p["core_ideas"]),
        ]).lower()
        if query_lower in searchable:
            results.append(p)
    return results


def filter_by_tradition(philosophers: list[dict]) -> list[dict]:
    traditions = sorted({p["tradition"] for p in philosophers})
    print("\n  Available traditions:")
    for i, t in enumerate(traditions, 1):
        print(f"    {i}. {t}")
    choice = input("\n  Enter number (or press Enter to cancel): ").strip()
    if not choice:
        return []
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(traditions):
            selected = traditions[idx]
            return [p for p in philosophers if p["tradition"] == selected]
    except ValueError:
        pass
    print("  Invalid selection.")
    return []


def main() -> None:
    philosophers = load_philosophers()

    print("\n╔════════════════════════════════════════╗")
    print("║    Philosophy Research Agent v1.0      ║")
    print("║    Eastern Philosophy Edition          ║")
    print("╚════════════════════════════════════════╝")

    while True:
        print("\n  [1] List all philosophers")
        print("  [2] View philosopher details")
        print("  [3] Search philosophers")
        print("  [4] Filter by tradition")
        print("  [5] Exit")

        choice = input("\n  Choose an option: ").strip()

        if choice == "1":
            list_philosophers(philosophers)

        elif choice == "2":
            list_philosophers(philosophers)
            selection = input("  Enter number: ").strip()
            try:
                idx = int(selection) - 1
                if 0 <= idx < len(philosophers):
                    show_philosopher(philosophers[idx])
                else:
                    print("  Invalid number.")
            except ValueError:
                print("  Please enter a valid number.")

        elif choice == "3":
            query = input("  Enter search term: ").strip()
            if query:
                results = search_philosophers(philosophers, query)
                if results:
                    print(f"\n  Found {len(results)} result(s):\n")
                    for p in results:
                        print(f"    • {p['name']}  [{p['tradition']}]  {p['origin']}")
                    detail = input("\n  Enter name or number to view details (or Enter to skip): ").strip()
                    if detail:
                        try:
                            idx = int(detail) - 1
                            if 0 <= idx < len(results):
                                show_philosopher(results[idx])
                        except ValueError:
                            for p in results:
                                if detail.lower() in p["name"].lower():
                                    show_philosopher(p)
                                    break
                else:
                    print("  No results found.")

        elif choice == "4":
            results = filter_by_tradition(philosophers)
            if results:
                for p in results:
                    print(f"    • {p['name']}  [{p['origin']}]")

        elif choice == "5":
            print("\n  再見！Goodbye!\n")
            break

        else:
            print("  Invalid option. Please choose 1–5.")


if __name__ == "__main__":
    main()

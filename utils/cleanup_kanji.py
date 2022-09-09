import json
import os
import pathlib
import sys


def main(__argv: list, /) -> int:
    if len(__argv) != 2:
        print('Usage: cleanup_kanji.py <output.json>')
        return 1

    # `cwd` is the directory of this script.
    cwd: str = str(pathlib.Path(__file__).parents[0]).replace("\\", "/")
    kanji_jouyou_json: str = (cwd + "/kanji-jouyou.json")
    # Download 'kanji-jouyou.json' (if it does not already exist) from:
    # https://github.com/davidluzgouveia/kanji-data
    error: str = f"Missing file: '{kanji_jouyou_json}'"
    assert(os.path.exists(kanji_jouyou_json)), error

    with open(kanji_jouyou_json, "r", encoding="utf-8") as f:
        kanji: dict = json.load(f)

    # For my purposes, I only need select keys from the original dataset.
    filtered_kanji: dict = {
        k: {"meanings": v["meanings"], "readings": v["readings_on"]}
        for (k, v) in kanji.items()
    }

    # Write the filtered kanji data to the output file.
    with open(__argv[1], "w+", encoding="utf-8") as f:
        # `ensure_ascii=False` is required to write the kanji characters.
        json.dump(filtered_kanji, f, ensure_ascii=False, indent=4)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

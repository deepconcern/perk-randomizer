from bs4 import BeautifulSoup, ResultSet, Tag
from json import dump
from os import listdir
from os.path import isfile
from pathlib import Path
from re import compile
from uuid import uuid4

SOURCE_DIR = Path("perklist")
SURVIVOR_PERK_REGEX = compile(r"^Survivor - (?P<perk_character>.*)$")
KILLER_PERK_REGEX = compile(r"^Killer - (?P<perk_character>.*)$")
TARGET = Path("src", "data.json")


def parse_page(file: Path, perk_list: list, character_list: list) -> None:
    with open(file, "r") as f:
        data = f.read().replace("\n", "")

    soup = BeautifulSoup(data, "html.parser")

    rows: ResultSet[Tag] = soup.find("tbody", id="perk_list").find_all("tr")

    for row in rows:
        id = str(uuid4())

        perk_origin = row.find("span", class_="text-muted")

        # Check if perk has survivor origin
        perk_character = None

        if perk_origin.text.startswith("Survivor"):
            perk_type = "survivor"

            re_match = SURVIVOR_PERK_REGEX.match(perk_origin.text)

            if re_match:
                perk_character = re_match.groupdict()["perk_character"]
        else:
            perk_type = "killer"
            re_match = KILLER_PERK_REGEX.match(perk_origin.text)

            if re_match:
                perk_character = re_match.groupdict()["perk_character"]
        
        if perk_character is not None:
            character_id = None
            for c in character_list:
                if c["name"] == perk_character:
                    character_id = c["id"]
                    break
            
            if character_id is None:
                character_id = str(uuid4())
                character_list.append({
                    "id": character_id,
                    "name": perk_character,
                    "type": perk_type,
                })
        else:
            character_id = None

        perk_list.append(
            {
                "characterId": character_id,
                "id": id,
                "name": row.find("a").text,
                "type": perk_type,
            }
        )


def main() -> None:
    character_list = []
    perk_list = []

    for file in listdir(SOURCE_DIR):
        if not file.endswith(".html"):
            continue

        file_path = SOURCE_DIR / file

        if not isfile(file_path):
            continue

        parse_page(SOURCE_DIR / file, perk_list, character_list)

    character_list.sort(key=lambda c: str.casefold(c["name"]))
    perk_list.sort(key=lambda p: str.casefold(p["name"]))

    with open(TARGET, "w") as f:
        dump({ "characters": character_list, "perks": perk_list}, f)


if __name__ == "__main__":
    main()

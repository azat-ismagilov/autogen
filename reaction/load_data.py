import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta

import ffmpeg
import requests

REACTION_VIDEO_FILE = "videos/reaction.mp4"
SCREEN_VIDEO_FILE = "videos/screen.mp4"
REACTION_VIDEO_PATH = Path(".") / "public" / REACTION_VIDEO_FILE
SCREEN_VIDEO_PATH = Path(".") / "public" / SCREEN_VIDEO_FILE


def convert(input_path, output_path):
    if os.path.exists(output_path):
        os.remove(output_path)
    print(f"Converting {input_path} to {output_path}...")
    start_time = datetime.now()
    ffmpeg.input(str(input_path)).output(
        str(output_path), **{"c:v": "copy", "c:a": "aac"}
    ).run(quiet=True)
    end_time = datetime.now()
    elapsed_time = end_time - start_time
    print(f"Conversion completed in {elapsed_time.total_seconds()} seconds.")


def load_url_and_save(url, id):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()
    screen_path = data["reactionVideos"][1]["url"]
    webcam_path = data["reactionVideos"][0]["url"]
    convert(screen_path, SCREEN_VIDEO_PATH)
    convert(webcam_path, REACTION_VIDEO_PATH)

    is_success = data["result"]["verdict"]["isAccepted"]

    response = {
        "title": data["team"]["fullName"],
        "subtitle": data["team"]["displayName"],
        "hashtag": data["team"]["hashTag"],
        "logoPath": data["team"]["organization"]["logo"]["url"],
        "task": data["problem"]["letter"],
        "success": is_success,
        "rankBefore": data["team"]["rankBefore"],
        "rankAfter": data["team"]["rankAfter"],
        "audioPath": (
            "audio/success-sound-effect.wav"
            if is_success
            else "audio/fail-sound-effect.wav"
        ),
        "outcome": data["result"]["verdict"]["shortName"],
        "time": data["time"],
        "webcamVideoPath": REACTION_VIDEO_FILE,
        "screenVideoPath": SCREEN_VIDEO_FILE,
        "contestHeader": "svg/header_46.svg",
        "backgroundVideoPath": "videos/blue_motion.mp4",
    }

    if os.path.exists("public/config.json"):
        os.remove("public/config.json")

    with open("public/config.json", "w") as file:
        json.dump(response, file, indent=4)

    subprocess.run(["npm", "run", "build"])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python load_data.py <url> <id>")
        sys.exit(1)

    url = sys.argv[1]
    id = sys.argv[2]
    load_url_and_save(url, id)

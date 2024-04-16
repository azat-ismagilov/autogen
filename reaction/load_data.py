import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta

import ffmpeg
import requests
import subprocess

REACTION_VIDEO_FILE = "videos/reaction.mp4"
SCREEN_VIDEO_FILE = "videos/screen.mp4"
LOGO_FILE = "logo"
REACTION_VIDEO_PATH = Path(".") / "public" / REACTION_VIDEO_FILE
SCREEN_VIDEO_PATH = Path(".") / "public" / SCREEN_VIDEO_FILE
LOGO_PATH = Path(".") / "public" / LOGO_FILE


def convert(input_path, output_path, extra_curl_options):
    if os.path.exists(output_path):
        os.remove(output_path)

    print(f"Converting {input_path} to {output_path}...")
    start_time = datetime.now()

    extra_curl_options = " ".join(extra_curl_options)
    command = f"curl {input_path} {extra_curl_options} | ffmpeg -i - -c:v copy -c:a aac {output_path}"

    process = subprocess.Popen(
        command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    process.wait()

    end_time = datetime.now()
    elapsed_time = end_time - start_time
    print(f"Conversion completed in {elapsed_time.total_seconds()} seconds.")


def download(input_path, output_path, extra_curl_options):
    if os.path.exists(output_path):
        os.remove(output_path)

    print(f"Downloading {input_path} to {output_path}...")
    start_time = datetime.now()

    extra_curl_options = " ".join(extra_curl_options)
    command = f"curl {input_path} {extra_curl_options} -o {output_path}"

    process = subprocess.Popen(
        command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    process.wait()

    end_time = datetime.now()
    elapsed_time = end_time - start_time
    print(f"Download completed in {elapsed_time.total_seconds()} seconds.")


def load_url_and_save(url, id, extra_curl_options):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()
    screen_path = data["reactionVideos"][1]["url"]
    webcam_path = data["reactionVideos"][0]["url"]
    logo_path = data["team"]["organization"]["logo"]["url"]
    convert(screen_path, SCREEN_VIDEO_PATH, extra_curl_options)
    convert(webcam_path, REACTION_VIDEO_PATH, extra_curl_options)
    download(logo_path, LOGO_PATH, extra_curl_options)

    is_success = data["result"]["verdict"]["isAccepted"]

    response = {
        "title": data["team"]["fullName"],
        "subtitle": data["team"]["displayName"],
        "hashtag": data["team"]["hashTag"],
        "logoPath": data["team"]["organization"]["logo"]["url"],
        "task": LOGO_FILE,
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
    if len(sys.argv) < 3:
        print("Usage: python load_data.py <url> <id> [extra_curl_options]")
        sys.exit(1)
    url = sys.argv[1]
    id = sys.argv[2]
    extra_curl_options = sys.argv[3:]
    load_url_and_save(url, id, extra_curl_options)

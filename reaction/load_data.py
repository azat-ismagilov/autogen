import json
import os
import sys

import ffmpeg
import requests


def load_url_and_save(url, id):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()

    screen_path = data["reactionVideos"][1]["url"]
    webcam_path = data["reactionVideos"][0]["url"]

    if os.path.exists("public/screen.mp4"):
        os.remove("public/screen.mp4")
        ffmpeg.input(screen_path).output("public/screen.mp4").run()

    if os.path.exists("public/reaction.mp4"):
        os.remove("public/reaction.mp4")
        ffmpeg.input(webcam_path).output("public/reaction.mp4").run()

    is_success = data["result"]["verdict"]["isAccepted"]

    millis = int(data["time"])
    seconds = (millis / 1000) % 60
    seconds = int(seconds)
    minutes = (millis / (1000 * 60)) % 60
    minutes = int(minutes)
    hours = (millis / (1000 * 60 * 60)) % 24

    response = {
        "title": data["team"]["fullName"],
        "subtitle": data["team"]["displayName"],
        "hashtag": data["team"]["hashTag"],
        "logoPath": data["team"]["organization"]["logo"]["url"],
        "task": data["problem"]["letter"],
        "success": is_success,
        "audioPath": "audio/success-sound-effect.wav" if is_success else "audio/fail-sound-effect.wav",
        "outcome": data["result"]["verdict"]["shortName"],
        "time": ("%d:%02d:%02d" % (hours, minutes, seconds)),
        "webcamVideoPath": "/reaction.mp4",
        "screenVideoPath": "/screen.mp4",
        "contestHeader": "svg/header_46.svg",
        "backgroundVideoPath": "videos/blue_motion.mp4"
    }

    if os.path.exists("public/config.json"):
        os.remove("public/config.json")

    with open("public/config.json", "w") as file:
        json.dump(response, file, indent=4)

    # subprocess.run(["npm", "run", "build"])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python load_data.py <url> <id>")
        sys.exit(1)

    url = sys.argv[1]
    id = sys.argv[2]
    load_url_and_save(url, id)

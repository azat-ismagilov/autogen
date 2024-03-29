import json
import sys
import os

import ffmpeg
import requests


def load_url_and_save(url, id):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()

    screen_path = data["reactionVideos"][1]["url"]
    webcam_path = data["reactionVideos"][0]["url"]

    os.makedirs("public/" + id)
    ffmpeg.input(screen_path).output("public/" + id + "/screen.mp4").run()
    ffmpeg.input(webcam_path).output("public/" + id + "/reaction.mp4").run()

    is_success = data["result"]["verdict"]["isAccepted"]

    response = {
        "title": data["team"]["fullName"],
        "subtitle": data["team"]["displayName"],
        # "hashtag": data["team"]["hashTag"],
        # "logoPath": data["team"]["organization"]["logo"]["url"],
        "task": data["problem"]["letter"],
        "success": is_success,
        "audioPath": "audio/success-sound-effect.wav" if is_success == "true" else "audio/fail-sound-effect.wav",
        "outcome": data["result"]["verdict"]["shortName"],
        "time": data["time"],
        "webcamVideoPath": id + "/reaction.mp4",
        "screenVideoPath": id + "/screen.mp4",
        "backgroundVideoPath": "videos/yellow_motion.mp4"
    }

    with open("public/" + id + "/config.json", "w") as file:
        json.dump(response, file, indent=4)

    # subprocess.run(["npm", "run", "build"])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python load_data.py <url> <id>")
        sys.exit(1)

    url = sys.argv[1]
    id = sys.argv[2]
    load_url_and_save(url, id)

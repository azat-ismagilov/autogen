import sys
import requests
import json
import subprocess


def load_url_and_save(url, id):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()

    response = {
        "title": data["team"]["fullName"],
        "subtitle": data["team"]["displayName"],
        "hashtag": data["team"]["hashTag"],
        "logoPath": data["team"]["organization"]["logo"]["url"],
        "task": data["problem"]["letter"],
        "success": data["result"]["verdict"]["isAccepted"],
        "webcam_video_path": (
            data["reactionVideos"][0]["url"]
            if len(data["reactionVideos"]) > 0
            else None
        ),
        "screen_video_path": (
            data["reactionVideos"][1]["url"]
            if len(data["reactionVideos"]) > 1
            else None
        ),
    }

    with open("public/config.json", "w") as file:
        json.dump(response, file, indent=4)

    # subprocess.run(["npm", "run", "build"])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python build_video.py <url> <id>")
        sys.exit(1)

    url = sys.argv[1]
    id = sys.argv[2]
    load_url_and_save(url, id)

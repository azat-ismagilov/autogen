import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta

import ffmpeg
import requests
import shutil
import argparse
import multiprocessing


def convert(input_path, output_path):
    if os.path.exists(output_path):
        os.remove(output_path)
    print(f"Converting {input_path} to {output_path}...")
    start_time = datetime.now()
    ffmpeg.input(str(input_path)).output(
        str(output_path),
        threads=1,
        **{"c:a": "aac", "b:v": "2000k", "s": "1280x720"}
    ).run(quiet=True)
    end_time = datetime.now()
    elapsed_time = end_time - start_time
    print(f"Conversion completed in {elapsed_time.total_seconds()} seconds.")


def from_image(input_path, output_path):
    fps = 30
    duration = 300
    if os.path.exists(output_path):
        os.remove(output_path)
    print(f"Converting {input_path} to {output_path}...")
    start_time = datetime.now()
    ffmpeg.input(str(input_path), loop=1, framerate=30).output(
        str(output_path),
        threads=1,
        vcodec='libx264',
        pix_fmt='yuv420p',
        t=duration,
        r=fps
    ).run(quiet=True)
    end_time = datetime.now()
    elapsed_time = end_time - start_time
    print(f"Conversion completed in {elapsed_time.total_seconds()} seconds.")


def apply_cds_auth(url, cds_auth):
    if cds_auth is None:
        return url
    return url.replace("http://", f"http://{cds_auth}@").replace("https://", f"https://{cds_auth}@")


def load_url_and_save(url, id, file_dir, destination, override=True, cds_auth=None):
    response = requests.get(f"{url}/api/overlay/externalRun/{id}")
    data = response.json()
    config_dir = Path(".") / "config"
    config_dir.mkdir(exist_ok=True)
    config_path = config_dir / f"config_{id}.json"

    if config_path.exists() and not override:
        print(f"Skipping {id} as config file already exists.")
        return

    reaction_video_file = f"videos/reaction_{id}.mp4"
    screen_video_file = f"videos/screen_{id}.mp4"
    video_dir = Path(".") / "public"
    video_server = None
    if file_dir:
        video_dir = Path(file_dir)
        video_dir.mkdir(exist_ok=True)
        video_server = f"http://localhost:9090/{file_dir}"
    (video_dir / "videos").mkdir(exist_ok=True)
    reaction_video_path = video_dir / reaction_video_file
    screen_video_path = video_dir / screen_video_file
    try:
        webcam_path = apply_cds_auth(data["reactionVideos"][0]["url"], cds_auth)
        convert(webcam_path, reaction_video_path)
    except:
        return
    try:
        screen_path = apply_cds_auth(data["reactionVideos"][1]["url"], cds_auth)
        convert(screen_path, screen_video_path)
    except:
        from_image(data["problem"]["letter"] + ".png", screen_video_path)

    is_success = data["result"]["verdict"]["isAccepted"]

    response = {
        "title": data["team"]["displayName"],
        "subtitle": data["team"]["customFields"]["clicsTeamFullName"],
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
        "webcamVideoPath": reaction_video_file,
        "screenVideoPath": screen_video_file,
        "contestHeader": (
            "svg/header.svg"
        ),
        "backgroundVideoOrSvg": (
            "videos/blue_motion.mp4"
            if data["team"]["id"].startswith("46")
            else "videos/green_motion.mp4"
        ),
        "videoServer": video_server,
    }

    with open(config_path, "w") as file:
        json.dump(response, file, indent=4)

    if destination:
        def rsync_file(path):
            print(f"Rsyncing {path} to {destination / path}...")
            rsync_command = [
                "scp",
                str(path),
                str(destination / path),
            ]

            subprocess.run(rsync_command, stdout=subprocess.DEVNULL)

        rsync_file(screen_video_path)
        rsync_file(reaction_video_path)
        rsync_file(config_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Load data from URL and save")
    parser.add_argument("url", help="URL to load data from")
    parser.add_argument(
        "id",
        nargs="*",
        default=[],
        help="ID(s) of the submissions. If not specified, will load all submissions.",
    )
    parser.add_argument(
        "-d",
        "--file_dir",
        help="Directory to save the files. If specified, then we assume that you will run a server from root with port 9090.",
    )
    parser.add_argument(
        "-o",
        "--override",
        action="store_true",
        help="Override existing files if they already exist",
    )
    parser.add_argument(
        "-p",
        "--processes",
        type=int,
        default=1,
        help="Number of processes to use for parallel execution",
    )
    parser.add_argument(
        "--destination",
        help="Destination directory for rsync",
    )
    parser.add_argument(
        "--cds_auth",
        default=None,
        help="Basic http auth that need to use for downloading reaction from cds in format login@password",
    )
    args = parser.parse_args()

    url = args.url
    ids = args.id
    file_dir = args.file_dir
    override = args.override
    processes = args.processes
    destination = args.destination
    cds_auth = args.destination

    if not ids:
        response = requests.get(f"{url}/api/overlay/runs")
        ids = [run["id"] for run in response.json() if run["isHidden"] == False]

    with multiprocessing.Pool(processes=processes) as pool:
        pool.starmap(
            load_url_and_save,
            [(url, id, file_dir, destination, override, cds_auth) for id in ids],
        )

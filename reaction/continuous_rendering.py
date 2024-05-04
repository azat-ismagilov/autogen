import os
import shutil
import time
from pathlib import Path
import subprocess
import multiprocessing
import argparse


def render_video(public_directory, filename):
    id = filename.removeprefix("config_").removesuffix(".json")
    print(f"Rendering {id}...")
    props_path = public_directory / filename
    output_path = Path(".") / "out" / f"output_{id}.mp4"
    render_command = [
        "npx",
        "remotion",
        "render",
        "ReactionVideo",
        output_path,
        f"--props={props_path}",
        "--concurrency=1",
    ]
    subprocess.run(render_command, stdout=subprocess.DEVNULL)
    processed_directory = public_directory / "processed"
    os.makedirs(processed_directory, exist_ok=True)
    shutil.move(public_directory / filename, processed_directory / filename)
    print(f"Rendered {id}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-p",
        "--processes",
        type=int,
        default=1,
        help="Number of processes to use for parallel execution",
    )
    args = parser.parse_args()
    processes = args.processes

    public_directory = Path(".") / "public"
    while True:
        filenames = [
            (public_directory, filename)
            for filename in os.listdir(public_directory)
            if filename.startswith("config_") and filename.endswith(".json")
        ]
        with multiprocessing.Pool(processes=processes) as pool:
            pool.starmap(render_video, filenames)
        time.sleep(1)

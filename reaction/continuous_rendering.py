import os
import shutil
import time
from pathlib import Path
import subprocess
import multiprocessing
import argparse


def render_video(config_directory: Path, filename: str) -> None:
    id = filename.removeprefix("config_").removesuffix(".json")
    print(f"Rendering {id}...")
    props_path = config_directory / filename
    output_path = Path(".") / "out" / f"output_{id}.mp4"
    render_command = [
        "npx",
        "remotion",
        "render",
        "ReactionVideo",
        str(output_path),
        f"--props={props_path}",
        "--enable-multi-process-on-linux",
        "--concurrency=1",
        "--offthreadvideo-cache-size-in-bytes=3000000000",
    ]
    subprocess.run(render_command, stdout=subprocess.DEVNULL)
    processed_directory = config_directory / "processed"
    os.makedirs(processed_directory, exist_ok=True)
    shutil.move(config_directory / filename, processed_directory / filename)
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

    print("Serving at http://localhost:9090")
    server_command = [
        "npx",
        "--yes",
        "serve",
        "-p",
        "9090",
        "--cors",
        ".",
    ]
    subprocess.Popen(server_command)
    time.sleep(1)

    config_directory = Path(".") / "config"
    while True:
        filenames = [
            (config_directory, filename)
            for filename in os.listdir(config_directory)
            if filename.startswith("config_") and filename.endswith(".json")
        ]
        with multiprocessing.Pool(processes=processes) as pool:
            pool.starmap(render_video, filenames)
        time.sleep(1)
